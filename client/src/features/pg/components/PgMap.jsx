import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [10.7905, 78.7047];

const PgMap = ({ pgs = [], selectedId, onSelect, userLocation }) => {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const queryLocation = new URLSearchParams(window.location.search);
  const queryLat = Number(queryLocation.get("lat"));
  const queryLng = Number(queryLocation.get("lng"));
  const resolvedUserLocation =
    userLocation ||
    (Number.isFinite(queryLat) && Number.isFinite(queryLng)
      ? { lat: queryLat, lng: queryLng }
      : null);

  useEffect(() => {
    if (!mapElementRef.current) return undefined;
    const map = L.map(mapElementRef.current, { scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    const points = pgs.filter(
      (pg) =>
        Array.isArray(pg.location?.coordinates) &&
        pg.location.coordinates.length === 2,
    );
    const bounds = [];
    points.forEach((pg) => {
      const [lng, lat] = pg.location.coordinates;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const icon = L.divIcon({
        className: `pg-price-marker${selectedId === pg._id ? " selected" : ""}`,
        html: `<span>₹${Number(pg.rent).toLocaleString("en-IN")}</span>`,
        iconAnchor: [0, 18],
      });
      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.bindPopup(
        `<strong>${pg.title || "PG listing"}</strong><br/>₹${Number(pg.rent).toLocaleString("en-IN")} / month`,
      );
      marker.on("click", () => {
        map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true });
        onSelectRef.current?.(pg._id);
      });
      markersRef.current.push(marker);
      bounds.push([lat, lng]);
    });
    if (
      resolvedUserLocation &&
      Number.isFinite(resolvedUserLocation.lat) &&
      Number.isFinite(resolvedUserLocation.lng)
    ) {
      const userMarker = L.circleMarker(
        [resolvedUserLocation.lat, resolvedUserLocation.lng],
        {
          radius: 8,
          color: "#fff",
          weight: 3,
          fillColor: "#2878d8",
          fillOpacity: 1,
        },
      ).addTo(map);
      userMarker.bindTooltip("Your location");
      markersRef.current.push(userMarker);
      bounds.push([resolvedUserLocation.lat, resolvedUserLocation.lng]);
    }
    const selectedPoint = points.find((pg) => pg._id === selectedId);
    if (selectedPoint && Array.isArray(selectedPoint.location?.coordinates)) {
      const [selectedLng, selectedLat] = selectedPoint.location.coordinates;
      map.setView([selectedLat, selectedLng], Math.max(map.getZoom(), 16), {
        animate: true,
      });
    } else if (bounds.length)
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
    else map.setView(DEFAULT_CENTER, 13);
  }, [pgs, selectedId, resolvedUserLocation]);

  return (
    <div className="pg-map-wrap">
      <div
        ref={mapElementRef}
        className="pg-leaflet-map"
        aria-label="PG locations map"
      />
      <a
        className="map-attribution"
        href="https://www.openstreetmap.org/"
        target="_blank"
        rel="noreferrer"
      >
        View larger map
      </a>
    </div>
  );
};

export default PgMap;
