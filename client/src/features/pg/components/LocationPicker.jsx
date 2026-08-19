import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [10.7905, 78.7047];

const LocationPicker = ({ lat, lng, onChange }) => {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!elementRef.current) return undefined;
    const initial = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)) ? [Number(lat), Number(lng)] : DEFAULT_CENTER;
    const map = L.map(elementRef.current).setView(initial, lat && lng ? 16 : 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    if (lat && lng) markerRef.current = L.marker(initial).addTo(map);
    map.on("click", (event) => {
      const point = [event.latlng.lat, event.latlng.lng];
      if (markerRef.current) markerRef.current.setLatLng(point);
      else markerRef.current = L.marker(point).addTo(map);
      onChangeRef.current?.({ lat: point[0], lng: point[1] });
    });
    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lat || !lng || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
    const point = [Number(lat), Number(lng)];
    if (markerRef.current) markerRef.current.setLatLng(point);
    else markerRef.current = L.marker(point).addTo(map);
    map.setView(point, Math.max(map.getZoom(), 16));
  }, [lat, lng]);

  const useCurrentLocation = () => navigator.geolocation?.getCurrentPosition(({ coords }) => onChangeRef.current?.({ lat: coords.latitude, lng: coords.longitude }), () => undefined);
  return <div className="location-picker"><div ref={elementRef} className="location-picker-map" /><div className="location-picker-help"><span>Click the map to choose the PG location.</span><button type="button" onClick={useCurrentLocation}>Use my location</button></div></div>;
};

export default LocationPicker;
