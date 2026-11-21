import React, { lazy, Suspense, useState } from "react";
import { MapPin, Box, Map as MapIcon, Navigation as NavIcon, Train, Plane, Waves, Mountain, PencilRuler, ExternalLink } from "lucide-react";
import SourceNote from "./SourceNote";
import VillageMap2D from "./VillageMap2D";
import {
  VILLAGE,
  TEMPLE,
  GODAVARI_KM,
  ELEVATION_M,
  PENUGONDA_KM,
  neighbours,
  towns,
  stations,
  airport,
  osm,
  OSM_EDIT_URL,
} from "../data/mapData";
import { adminFacts } from "../data/censusData";
import { direction, directionsUrl } from "../utils/geo";

// MapLibre (about 400 KB compressed) is only downloaded when the 3D tab opens.
const Village3D = lazy(() => import("./Village3D"));

const km = (n) => `${n.toFixed(1)} km`;

export default function MapHub({ lang }) {
  const isTe = lang === "te";
  const [view, setView] = useState("2d");
  const name = (p) => (isTe && p.nameTe ? p.nameTe : p.name);

  const travelRows = [
    ...towns.map((t) => ({ icon: MapPin, label: name(t), km: t.km, coord: t.coord })),
    ...stations.map((s) => ({ icon: Train, label: `${name(s)} ${isTe ? "రైల్వే స్టేషన్" : "railway station"}`, km: s.km, coord: s.coord })),
    ...(airport ? [{ icon: Plane, label: name(airport), km: airport.km, coord: airport.coord }] : []),
  ].sort((a, b) => a.km - b.km);

  return (
    <div className="map-hub-container">
      {/* Header and actions */}
      <div className="card hero-card" style={{ marginBottom: "20px" }}>
        <div className="hero-badge">
          <MapPin size={16} />
          <span>{isTe ? "నడిపూడి స్థానం & పటం" : "Location & Map"}</span>
        </div>
        <h2 className="hero-heading" style={{ fontSize: "1.6rem" }}>
          {isTe ? "నడిపూడి ఎక్కడ ఉంది" : "Where Nadipudi Is"}
        </h2>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "760px" }}>
          {isTe
            ? `${adminFacts.districtTe} జిల్లా, ${adminFacts.mandalTe} మండలంలో, గోదావరి (వశిష్ఠ గోదావరి పాయ) పశ్చిమ వైపున ఉన్న డెల్టా గ్రామం.`
            : `A delta village in ${adminFacts.mandalEn} mandal, ${adminFacts.districtEn} district, on the west side of the Godavari (Vasishta branch).`}
        </p>
        <div className="hero-cta-buttons" style={{ marginTop: "14px" }}>
          <a className="btn-primary" href={directionsUrl(VILLAGE)} target="_blank" rel="noopener noreferrer">
            <NavIcon size={16} />
            <span>{isTe ? "నడిపూడికి దారి" : "Directions to Nadipudi"}</span>
          </a>
          <a className="btn-outline" href={directionsUrl(TEMPLE)} target="_blank" rel="noopener noreferrer">
            🛕 <span>{isTe ? "ఆలయానికి దారి" : "Directions to the temple"}</span>
          </a>
        </div>
      </div>

      {/* 2D / 3D switch */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="map-view-tabs" role="tablist">
          <button role="tab" aria-selected={view === "2d"} className={`nav-tab-btn ${view === "2d" ? "active" : ""}`} onClick={() => setView("2d")}>
            <MapIcon size={16} />
            <span>{isTe ? "పటం" : "Map"}</span>
          </button>
          <button role="tab" aria-selected={view === "3d"} className={`nav-tab-btn ${view === "3d" ? "active" : ""}`} onClick={() => setView("3d")}>
            <Box size={16} />
            <span>{isTe ? "3D గ్రామ నిర్మాణ దృశ్యం" : "3D layout"}</span>
          </button>
        </div>

        {view === "2d" ? (
          <VillageMap2D lang={lang} />
        ) : (
          <Suspense fallback={<div className="map3d-message">{isTe ? "3D పటం లోడ్ అవుతోంది…" : "Loading 3D view…"}</div>}>
            <Village3D lang={lang} />
          </Suspense>
        )}

        {view === "2d" ? (
          <p style={{ fontSize: "0.82rem", marginTop: "10px", lineHeight: 1.5, color: "var(--text-muted)" }}>
            {isTe
              ? "ఆకుపచ్చ బిందువు: గ్రామ కేంద్రం · 🛕: ఆలయం · చుక్కల గీత: 3D దృశ్యంలో చూపిన ప్రాంతం. గ్రామ సరిహద్దు చూపడం లేదు — అధికారిక సరిహద్దు బహిరంగంగా అందుబాటులో లేదు."
              : "Green dot: village centre · 🛕: temple · dashed line: area shown in the 3D view. No village boundary is drawn — the official boundary is not openly available."}
          </p>
        ) : (
          <p style={{ fontSize: "0.82rem", marginTop: "10px", lineHeight: 1.5, color: "var(--text-muted)" }}>
            {isTe
              ? "ఇది గ్రామ నిర్మాణ నమూనా: ఉపగ్రహ చిత్రాల నుండి గుర్తించిన ప్రతి భవనం యొక్క నిజమైన స్థానం మరియు ఆకారం చూపబడ్డాయి. భవనాల ఎత్తు సమాచారం లేనందున అన్నీ ఒకే ఎత్తులో చూపబడ్డాయి; ఇది అసలు ఇళ్ళ రూపం కాదు. కాషాయ రంగు భవనం: ఆలయం. లాగి తిప్పండి, రెండు వేళ్ళతో వంచండి."
              : "This is a layout model: every building detected from satellite imagery, in its real position and shape. There is no height data, so all buildings are drawn at the same height; it does not show what the houses actually look like. Orange building: the temple. Drag to move, right-drag or two-finger drag to tilt and turn."}
          </p>
        )}
        <SourceNote
          lang={lang}
          source={isTe ? "Google Open Buildings (Overture Maps ద్వారా), OpenStreetMap, Esri ఉపగ్రహ చిత్రాలు" : "Google Open Buildings via Overture Maps, OpenStreetMap, Esri imagery"}
          url="https://overturemaps.org/"
        />
      </div>

      <div className="grid-2" style={{ marginBottom: "20px" }}>
        {/* Location facts */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <MapPin size={22} />
            </div>
            <h3>{isTe ? "స్థాన వివరాలు" : "Location Facts"}</h3>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <tbody>
                <tr>
                  <td>{isTe ? "అక్షాంశ, రేఖాంశాలు" : "Coordinates"}</td>
                  <td>
                    <strong>
                      {VILLAGE[1].toFixed(4)}° N, {VILLAGE[0].toFixed(4)}° E
                    </strong>
                  </td>
                </tr>
                {GODAVARI_KM != null && (
                  <tr>
                    <td>
                      <Waves size={14} style={{ display: "inline", marginRight: 4 }} />
                      {isTe ? "గోదావరి నది" : "Godavari river"}
                    </td>
                    <td>
                      <strong>{isTe ? "గ్రామానికి తూర్పున ప్రవహిస్తుంది" : "flows just east of the village"}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {isTe ? `నది మధ్య భాగం సుమారు ${GODAVARI_KM.toFixed(1)} కి.మీ.; ఒడ్డు ఇంకా దగ్గర` : `about ${GODAVARI_KM.toFixed(1)} km to mid-river; the bank is closer`}
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <Mountain size={14} style={{ display: "inline", marginRight: 4 }} />
                    {isTe ? "సముద్ర మట్టం నుండి ఎత్తు" : "Elevation"}
                  </td>
                  <td>
                    <strong>{isTe ? `సుమారు ${ELEVATION_M} మీటర్లు` : `about ${ELEVATION_M} m`}</strong>
                  </td>
                </tr>
                <tr>
                  <td>{isTe ? "మండల కేంద్రం (పెనుగొండ)" : "Mandal HQ (Penugonda)"}</td>
                  <td>
                    <strong>{isTe ? `సుమారు ${PENUGONDA_KM.km} కి.మీ.` : `about ${PENUGONDA_KM.km} km`}</strong>{" "}
                    <a href={PENUGONDA_KM.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "var(--sky-blue)" }}>
                      ({isTe ? "జనగణన గ్రామ డైరెక్టరీ" : "census village directory"})
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>{isTe ? "పిన్ కోడ్" : "PIN code"}</td>
                  <td>
                    <strong>{adminFacts.pin}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Travel distances */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <NavIcon size={22} />
            </div>
            <div>
              <h3>{isTe ? "సమీప పట్టణాలు & ప్రయాణం" : "Nearby Towns & Travel"}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {isTe ? "నేరుగా (గాలి) దూరం; రోడ్డు మార్గం ఎక్కువ ఉంటుంది" : "Straight-line distance; the road route is longer"}
              </p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <tbody>
                {travelRows.map((row) => (
                  <tr key={row.label}>
                    <td>
                      <row.icon size={14} style={{ display: "inline", marginRight: 6 }} />
                      {row.label}
                    </td>
                    <td>
                      <strong>{km(row.km)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Neighbouring villages */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
              <MapPin size={22} />
            </div>
            <h3>{isTe ? "పొరుగు గ్రామాలు & పల్లెలు" : "Neighbouring Villages & Hamlets"}</h3>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <tbody>
                {neighbours.slice(0, 12).map((p) => (
                  <tr key={`${p.name}-${p.coord}`}>
                    <td>{name(p)}</td>
                    <td>
                      {km(p.km)} · {direction(VILLAGE, p.coord, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote
            lang={lang}
            source="OpenStreetMap"
            url="https://www.openstreetmap.org/"
            note={
              isTe
                ? `నేరుగా దూరం · సమీపంలోని 12 చూపబడ్డాయి; 4.5 కి.మీ. లోపు ఉన్న మొత్తం ${neighbours.length} పటంలో ఉన్నాయి`
                : `straight-line distance · nearest 12 shown; all ${neighbours.length} within 4.5 km are on the map`
            }
          />
        </div>

        {/* Help improve the map */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}>
              <PencilRuler size={22} />
            </div>
            <h3>{isTe ? "పటాన్ని మెరుగుపరచడంలో సహాయం చేయండి" : "Help Improve the Map"}</h3>
          </div>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
            {isTe
              ? `OpenStreetMap ప్రపంచ ఉచిత పటంలో నడిపూడి వద్ద ప్రస్తుతం ${osm.features.features.filter((f) => f.properties.kind === "road").length} రోడ్లు మాత్రమే ఉన్నాయి — ఆలయం, పాఠశాలలు, సచివాలయం, కాలువలు, చెరువులు ఇంకా నమోదు కాలేదు. ఎవరైనా ఉచితంగా వాటిని జోడించవచ్చు; జోడించిన తరువాత ఈ పటంలో కూడా కనిపిస్తాయి. పాఠశాల విద్యార్థులు లేదా యువత కలిసి ఒక "మ్యాపింగ్ రోజు" నిర్వహించడానికి ఇది మంచి అవకాశం.`
              : `In OpenStreetMap, the free world map, Nadipudi currently has only ${osm.features.features.filter((f) => f.properties.kind === "road").length} roads — the temple, schools, Sachivalayam, canals and ponds are not mapped yet. Anyone can add them for free, and they will then appear on this map too. A good project for a students' or youth "mapping day".`}
          </p>
          <a className="btn-outline" href={OSM_EDIT_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: "12px", display: "inline-flex" }}>
            <span>{isTe ? "OpenStreetMap లో నడిపూడిని సవరించండి" : "Edit Nadipudi on OpenStreetMap"}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
