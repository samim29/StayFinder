const ROOM_TYPES = [
  ["single", "Single"],
  ["double", "Double sharing"],
  ["triple", "Triple sharing"],
];
const AMENITIES = ["WiFi", "Meals", "AC", "Laundry", "Power backup", "CCTV"];

const PgFilters = ({ value, onChange, onApply, onClear }) => {
  const set = (key, nextValue) => onChange({ ...value, [key]: nextValue });
  const toggle = (key, item) =>
    set(
      key,
      value[key].includes(item)
        ? value[key].filter((entry) => entry !== item)
        : [...value[key], item],
    );

  return (
    <aside className="discovery-filters">
      <h2>Monthly rent</h2>
      <div className="rent-inputs">
        <label>
          ₹
          <input
            type="number"
            value={value.minRent}
            onChange={(event) => set("minRent", event.target.value)}
          />
        </label>
        <span>to</span>
        <label>
          ₹
          <input
            type="number"
            value={value.maxRent}
            onChange={(event) => set("maxRent", event.target.value)}
          />
        </label>
      </div>
      <h2>Room type</h2>
      {ROOM_TYPES.map(([key, label]) => (
        <label className="check-row" key={key}>
          <input
            type="checkbox"
            checked={value.roomTypes.includes(key)}
            onChange={() => toggle("roomTypes", key)}
          />
          {label}
        </label>
      ))}
      <h2>Amenities</h2>
      {AMENITIES.map((amenity) => (
        <label className="check-row" key={amenity}>
          <input
            type="checkbox"
            checked={value.amenities.includes(amenity)}
            onChange={() => toggle("amenities", amenity)}
          />
          {amenity === "Meals" ? "Meals included" : amenity}
        </label>
      ))}
      <h2>Availability</h2>
      <label className="check-row">
        <input
          type="checkbox"
          checked={value.availableBeds}
          onChange={(event) => set("availableBeds", event.target.checked)}
        />
        Beds available now
      </label>
      <div className="filter-actions">
        <button type="button" className="apply-filters" onClick={onApply}>
          Apply filters
        </button>
        <button type="button" className="clear-filters" onClick={onClear}>
          Clear filters
        </button>
      </div>
    </aside>
  );
};

export default PgFilters;
