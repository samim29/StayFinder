import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../utils/image.utils";

const PgCard = ({ pg, compact = false }) => {
  const distance =
    pg.distanceInMeters !== undefined
      ? `${(pg.distanceInMeters / 1000).toFixed(1)} km`
      : null;
  const image = getOptimizedImageUrl(pg.images?.[0]?.url, {
    width: 360,
    height: 240,
  });
  const availability =
    pg.availableBeds > 0 ? `${pg.availableBeds} beds left` : "Full";

  return (
    <Link
      id={`pg-${pg._id}`}
      className={`discovery-card ${compact ? "discovery-card-compact" : ""}`}
      to={`/pg/${pg._id}`}
    >
      {image ? (
        <img src={image} alt="" />
      ) : (
        <div className="card-image-placeholder" />
      )}
      <div className="card-main">
        <h3>{pg.title}</h3>
        <p>
          {distance || pg.address} {distance && `· ${pg.genderPreference}`}
        </p>
        <div className="card-tags">
          {(pg.amenities || []).slice(0, 3).map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>
      </div>
      <div className="card-price">
        <span className={pg.availableBeds > 0 ? "beds-available" : "beds-full"}>
          {availability}
        </span>
        <strong>₹{Number(pg.rent).toLocaleString("en-IN")}</strong>
        <small>/ month</small>
      </div>
    </Link>
  );
};

export default PgCard;
