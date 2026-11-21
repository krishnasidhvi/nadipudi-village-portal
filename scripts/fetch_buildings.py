"""Download building outlines around Nadipudi from Overture Maps.

Overture combines OpenStreetMap with Google Open Buildings and Microsoft's
building footprints, so it covers villages that OpenStreetMap alone does not.

Usage (needs Python 3 and DuckDB):
    pip install duckdb
    python scripts/fetch_buildings.py [release]

Writes src/data/map/buildings.json (GeoJSON). Re-run after a new Overture
release, or after villagers add buildings to OpenStreetMap.
Licence: ODbL / CDLA Permissive 2.0 depending on source; attribution is shown
on the map page.
"""

import json
import os
import sys
import urllib.request
import re

import duckdb

# Area around the village (not an official boundary; none is openly available).
SOUTH, NORTH = 16.632, 16.664
WEST, EAST = 81.818, 81.852

BUCKET = "overturemaps-us-west-2"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "map", "buildings.json")


def latest_release():
    url = f"https://{BUCKET}.s3.amazonaws.com/?list-type=2&prefix=release/&delimiter=/"
    with urllib.request.urlopen(url, timeout=60) as res:
        listing = res.read().decode()
    releases = sorted(re.findall(r"<Prefix>release/([^/<]+)/</Prefix>", listing))
    if not releases:
        raise SystemExit("Could not list Overture releases")
    return releases[-1]


def round_coords(coords):
    if isinstance(coords[0], (int, float)):
        return [round(coords[0], 6), round(coords[1], 6)]
    return [round_coords(c) for c in coords]


def main():
    release = sys.argv[1] if len(sys.argv) > 1 else latest_release()
    print(f"Overture release {release}")

    con = duckdb.connect()
    con.execute("INSTALL spatial; LOAD spatial; INSTALL httpfs; LOAD httpfs;")
    con.execute("SET s3_region='us-west-2';")
    rows = con.execute(
        f"""
        SELECT
          id,
          ST_AsGeoJSON(geometry) AS geom,
          height,
          num_floors,
          class,
          names.primary AS name,
          sources[1].dataset AS source
        FROM read_parquet('s3://{BUCKET}/release/{release}/theme=buildings/type=building/*', hive_partitioning=1)
        WHERE bbox.xmin > {WEST} AND bbox.xmax < {EAST}
          AND bbox.ymin > {SOUTH} AND bbox.ymax < {NORTH}
        """
    ).fetchall()

    features = []
    for _id, geom, height, floors, cls, name, source in rows:
        g = json.loads(geom)
        if g["type"] not in ("Polygon", "MultiPolygon"):
            continue
        g["coordinates"] = round_coords(g["coordinates"])
        props = {"source": source}
        if height:
            props["height"] = round(height, 1)
        if floors:
            props["floors"] = floors
        if cls:
            props["class"] = cls
        if name:
            props["name"] = name
        features.append({"type": "Feature", "geometry": g, "properties": props})

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(
            {
                "type": "FeatureCollection",
                "metadata": {
                    "source": "Overture Maps Foundation",
                    "release": release,
                    "bbox": [WEST, SOUTH, EAST, NORTH],
                },
                "features": features,
            },
            f,
            separators=(",", ":"),
            ensure_ascii=False,
        )

    by_source = {}
    for feat in features:
        by_source[feat["properties"]["source"]] = by_source.get(feat["properties"]["source"], 0) + 1
    with_height = sum(1 for feat in features if "height" in feat["properties"])
    print(f"{len(features)} buildings ({by_source}); {with_height} with a height; {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    main()
