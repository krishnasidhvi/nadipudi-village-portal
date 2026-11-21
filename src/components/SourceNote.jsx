import React from "react";

// One-line provenance for a figure: where it came from, when it was observed,
// and a visible warning when the reading is older than it should be.
export default function SourceNote({ lang, source, url, asOf, stale = false, note, style }) {
  const isTe = lang === "te";
  return (
    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", opacity: 0.9, marginTop: "10px", lineHeight: 1.5, ...style }}>
      {isTe ? "మూలం: " : "Source: "}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          {source}
        </a>
      ) : (
        source
      )}
      {asOf && <> · {isTe ? `${asOf} నాటి సమాచారం` : `as of ${asOf}`}</>}
      {note && <> · {note}</>}
      {stale && (
        <strong style={{ color: "#fbbf24", marginLeft: "6px" }}>
          ⚠ {isTe ? "పాత సమాచారం — తాజాది అందలేదు" : "Out of date — no newer reading received"}
        </strong>
      )}
    </p>
  );
}
