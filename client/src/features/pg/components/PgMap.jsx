const PgMap = ({ pgs, selectedId, onSelect, userLocation }) => {
  const queryLocation = new URLSearchParams(window.location.search);
  const queryLat = queryLocation.get("lat");
  const queryLng = queryLocation.get("lng");
  const resolvedUserLocation = userLocation || (queryLat && queryLng ? {
    lat: Number(queryLat),
    lng: Number(queryLng),
  } : null);
  const points = pgs.filter((pg) => pg.location?.coordinates?.length === 2);
  const defaultPoint = [78.7047, 10.7905];
  const lngs = points.map((pg) => pg.location.coordinates[0]);
  const lats = points.map((pg) => pg.location.coordinates[1]);
  if (resolvedUserLocation && Number.isFinite(resolvedUserLocation.lng) && Number.isFinite(resolvedUserLocation.lat)) {
    lngs.push(resolvedUserLocation.lng);
    lats.push(resolvedUserLocation.lat);
  }
  const minLng = points.length ? Math.min(...lngs) : defaultPoint[0] - 0.05;
  const maxLng = points.length ? Math.max(...lngs) : defaultPoint[0] + 0.05;
  const minLat = points.length ? Math.min(...lats) : defaultPoint[1] - 0.05;
  const maxLat = points.length ? Math.max(...lats) : defaultPoint[1] + 0.05;
  const lngPad = Math.max((maxLng - minLng) * 0.25, 0.01);
  const latPad = Math.max((maxLat - minLat) * 0.25, 0.01);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng - lngPad}%2C${minLat - latPad}%2C${maxLng + lngPad}%2C${maxLat + latPad}&layer=mapnik`;
  const userMarker = resolvedUserLocation && Number.isFinite(resolvedUserLocation.lat) && Number.isFinite(resolvedUserLocation.lng)
    ? {
      left: `${((resolvedUserLocation.lng - (minLng - lngPad)) / (maxLng - minLng + lngPad * 2)) * 100}%`,
      top: `${(1 - (resolvedUserLocation.lat - (minLat - latPad)) / (maxLat - minLat + latPad * 2)) * 100}%`,
    }
    : null;

  return (
    <div className="pg-map-wrap">
      <iframe title="PG locations map" src={mapUrl} />
      <div className="map-markers">
        {userMarker && <span className="user-map-marker" style={userMarker} title="Your location">You</span>}
        {points.map((pg) => { const [lng, lat] = pg.location.coordinates; const left = `${((lng - (minLng - lngPad)) / (maxLng - minLng + lngPad * 2)) * 100}%`; const top = `${(1 - (lat - (minLat - latPad)) / (maxLat - minLat + latPad * 2)) * 100}%`; return <button key={pg._id} type="button" className={`map-marker ${selectedId === pg._id ? "active" : ""}`} style={{ left, top }} title={pg.title} onClick={() => onSelect(pg._id)}>₹{Number(pg.rent).toLocaleString("en-IN")}</button>; })}
      </div>
      <a className="map-attribution" href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">View larger map</a>
    </div>
  );
};

export default PgMap;
