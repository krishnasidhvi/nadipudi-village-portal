// Small geometry helpers for the map page. Coordinates are [lon, lat].

const R = 6371; // km
const toRad = (d) => (d * Math.PI) / 180;

export function distanceKm(a, b) {
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DIRECTIONS = {
  en: ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"],
  te: ["ఉత్తరం", "ఈశాన్యం", "తూర్పు", "ఆగ్నేయం", "దక్షిణం", "నైరుతి", "పడమర", "వాయువ్యం"],
};

export function direction(from, to, lang) {
  const y = Math.sin(toRad(to[0] - from[0])) * Math.cos(toRad(to[1]));
  const x =
    Math.cos(toRad(from[1])) * Math.sin(toRad(to[1])) -
    Math.sin(toRad(from[1])) * Math.cos(toRad(to[1])) * Math.cos(toRad(to[0] - from[0]));
  const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return DIRECTIONS[lang === "te" ? "te" : "en"][Math.round(bearing / 45) % 8];
}

// Shortest distance from a point to a polyline, in km (flat approximation,
// fine over a few kilometres).
export function distanceToLineKm(point, line) {
  const kx = 111.32 * Math.cos(toRad(point[1]));
  const ky = 110.57;
  let best = Infinity;
  for (let i = 1; i < line.length; i++) {
    const ax = (line[i - 1][0] - point[0]) * kx;
    const ay = (line[i - 1][1] - point[1]) * ky;
    const bx = (line[i][0] - point[0]) * kx;
    const by = (line[i][1] - point[1]) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  }
  return best;
}

function insideRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function polygonContains(geometry, point) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some((rings) => insideRing(point, rings[0]) && !rings.slice(1).some((hole) => insideRing(point, hole)));
}

export const directionsUrl = ([lon, lat]) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
