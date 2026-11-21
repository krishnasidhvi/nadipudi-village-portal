// Loads the building outlines only when a map that needs them is shown.
// The file is a hashed static asset (~270 KB), not part of any JS bundle.

import { useEffect, useState } from "react";
import buildingsUrl from "../data/map/buildings.json?url";
import { polygonContains } from "./geo";
import { TEMPLE } from "../data/mapData";

let cached = null;

function load() {
  if (!cached) {
    cached = fetch(buildingsUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Mark the outline the temple's map pin falls inside.
        for (const f of data.features) f.properties.temple = polygonContains(f.geometry, TEMPLE);
        return data;
      })
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}

// Returns { status: "loading" | "ok" | "error", data }.
export function useBuildings(enabled = true) {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    load()
      .then((data) => alive && setState({ status: "ok", data }))
      .catch(() => alive && setState({ status: "error", data: null }));
    return () => {
      alive = false;
    };
  }, [enabled]);

  return state;
}
