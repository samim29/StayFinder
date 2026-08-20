import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import DiscoveryHeader from "../../pg/components/DiscoveryHeader";
import { usePg } from "../../pg/hooks/usePg";
import { getOptimizedImageUrl } from "../../pg/utils/image.utils";
import { useBooking } from "../hooks/useBooking";
import "../booking.scss";
import LoadingState from "../../../components/LoadingState";
import LoadingButtonContent from "../../../components/LoadingButtonContent";

const today = new Date().toISOString().split("T")[0];

const BookingPage = () => {
  const { pgId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGetPublicPg } = usePg();
  const { loading, handleCreateBooking } = useBooking();
  const [pg, setPg] = useState(null);
  const [form, setForm] = useState({
    moveInDate: today,
    roomType: searchParams.get("roomType") || "",
    durationMonths: 11,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    handleGetPublicPg(pgId)
      .then((data) => {
        setPg(data);
        setForm((current) => ({
          ...current,
          roomType: data.roomTypes?.includes(current.roomType)
            ? current.roomType
            : data.roomTypes?.[0] || "single",
        }));
      })
      .catch(() => setError("This listing could not be found.")); // eslint-disable-line react-hooks/exhaustive-deps
  }, [pgId]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await handleCreateBooking({ pgId, ...form });
      navigate("/bookings", { state: { sent: true } });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not send your booking request.",
      );
    }
  };

  if (error && !pg)
    return (
      <>
        <DiscoveryHeader />
        <main className="booking-page">
          <div className="empty-state">
            {error}
            <Link to="/browse">Back to browse</Link>
          </div>
        </main>
      </>
    );
  if (!pg)
    return (
      <>
        <DiscoveryHeader />
        <main className="booking-page"><LoadingState label="Loading booking details" /></main>
      </>
    );

  const image = getOptimizedImageUrl(pg.images?.[0]?.url, {
    width: 360,
    height: 240,
  });
  return (
    <>
      <DiscoveryHeader />
      <main className="booking-page">
        <section className="booking-shell">
          <h1>Confirm your booking request</h1>
          <div className="booking-stepper">
            <b>Details</b>
            <span className="active">Review</span>
            <span className="inactive">Sent</span>
          </div>
          <div className="booking-pg-summary">
            {image ? (
              <img src={image} alt="" />
            ) : (
              <div className="booking-image-placeholder" />
            )}
            <div>
              <h2>{pg.title}</h2>
              <p>{pg.address}</p>
            </div>
            <aside>
              <strong>₹{Number(pg.rent).toLocaleString("en-IN")}</strong>
              <small>/ month</small>
            </aside>
          </div>
          {error && <div className="booking-error">{error}</div>}
          <form className="booking-form" onSubmit={submit}>
            <div className="booking-review">
              <div className="review-row">
                <span>Move-in date</span>
                <strong>
                  {new Date(`${form.moveInDate}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )}
                </strong>
              </div>
              <div className="review-row">
                <span>Room type</span>
                <strong>{form.roomType} sharing</strong>
              </div>
              <div className="review-row">
                <span>Duration</span>
                <strong>{form.durationMonths} months</strong>
              </div>
              <div className="review-row">
                <strong>Total due at booking (online)</strong>
                <strong>₹0</strong>
              </div>
            </div>
            <label>
              Move-in date
              <input
                type="date"
                min={today}
                value={form.moveInDate}
                onChange={(event) =>
                  setForm({ ...form, moveInDate: event.target.value })
                }
                required
              />
            </label>
            <label>
              Room type
              <select
                value={form.roomType}
                onChange={(event) =>
                  setForm({ ...form, roomType: event.target.value })
                }
              >
                {pg.roomTypes?.map((type) => (
                  <option key={type} value={type}>
                    {type} sharing
                  </option>
                ))}
              </select>
            </label>
            <label>
              Duration (months)
              <input
                type="number"
                min="1"
                max="36"
                value={form.durationMonths}
                onChange={(event) =>
                  setForm({ ...form, durationMonths: event.target.value })
                }
                required
              />
            </label>
            <div className="booking-notice">
              Your bed will be held as soon as you submit this request. The
              owner has 48 hours to confirm — you’ll be notified either way.
            </div>
            <button className="booking-submit" type="submit" disabled={loading}>
              <LoadingButtonContent loading={loading} loadingLabel="Sending request…">Send Booking Request</LoadingButtonContent>
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default BookingPage;
