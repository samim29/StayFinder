import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DiscoveryHeader from "../components/DiscoveryHeader";
import PgMap from "../components/PgMap";
import { usePg } from "../hooks/usePg";
import "../discovery.scss";

const PgDetails = () => {
  const { pgId } = useParams();
  const { handleGetPublicPg } = usePg();
  const [pg, setPg] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { handleGetPublicPg(pgId).then(setPg).catch(() => setError("This listing could not be found.")); // eslint-disable-line react-hooks/exhaustive-deps
  }, [pgId]);

  if (error) return <><DiscoveryHeader /><main className="details-page"><div className="empty-state">{error}<Link to="/browse">Back to browse</Link></div></main></>;
  if (!pg) return <><DiscoveryHeader /><main className="details-page"><div className="empty-state">Loading listing…</div></main></>;

  const imageUrls = pg.images?.map((image) => image.url) || [];
  return <><DiscoveryHeader /><main className="details-page"><div className="details-gallery">{imageUrls.length ? <><img className="gallery-main" src={imageUrls[0]} alt={pg.title} /><div className="gallery-side">{imageUrls.slice(1, 3).map((url) => <img key={url} src={url} alt="" />)}</div></> : <div className="gallery-placeholder" />}</div><div className="details-layout"><section><p className="kicker">{pg.genderPreference} PG · {pg.address}</p><h1>{pg.title}</h1><p className="details-address">📍 {pg.address}</p><p className="details-description">{pg.description}</p><div className="details-section"><h2>Amenities</h2><div className="amenity-pills">{pg.amenities?.map((amenity) => <span key={amenity}>{amenity}</span>)}</div></div>{pg.rules && <div className="details-section"><h2>House rules</h2><p>{pg.rules}</p></div>}<div className="details-section"><h2>Location</h2><PgMap pgs={[pg]} onSelect={() => {}} /></div></section><aside className="booking-card"><strong>₹{Number(pg.rent).toLocaleString("en-IN")}</strong><span>/ month</span><p className="available-copy">● {pg.availableBeds} beds available</p><label>Room type<select defaultValue={pg.roomTypes?.[0] || "single"}>{pg.roomTypes?.map((type) => <option key={type} value={type}>{type} sharing</option>)}</select></label><a className="contact-owner" href={`tel:${pg.contact?.phone}`}>Contact owner</a><small>Payment is handled directly with the owner after you confirm the details.</small></aside></div></main></>;
};

export default PgDetails;
