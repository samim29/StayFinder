import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DiscoveryHeader from "../../pg/components/DiscoveryHeader";
import { useBooking } from "../hooks/useBooking";
import "../booking.scss";
import LoadingState from "../../../components/LoadingState";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const StudentDashboard = () => {
  const location = useLocation();
  const { bookings, loading, handleGetMyBookings, handleCancelBooking } =
    useBooking();
  const [notice] = useState(
    location.state?.sent ? "Your booking request was sent to the owner." : "",
  );
  const [cancelling, setCancelling] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    handleGetMyBookings().catch(() =>
      setLoadError("Could not load your bookings. Please try again."),
    ); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async (booking) => {
    if (
      !window.confirm(
        "Cancel this booking request? The bed will become available again.",
      )
    )
      return;
    try {
      setCancelling(booking._id);
      await handleCancelBooking(booking._id);
    } finally {
      setCancelling("");
    }
  };

  return (
    <>
      <DiscoveryHeader />
      <main className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand">
            <span className="brand-mark">SF</span>
            <strong>StayFinder</strong>
          </div>
          <nav>
            <a className="active" href="#bookings">
              My Bookings
            </a>
            {/* <Link to="/browse">Browse PGs</Link> */}
            <Link to="/student/profile">Profile</Link>
          </nav>
        </aside>
        <section className="dashboard-content">
          <div className="dashboard-topline">
            <h1>My Bookings</h1>
            <Link className="dashboard-outline-button" to="/browse">
              Browse more PGs
            </Link>
          </div>
          {notice && <div className="booking-notice">{notice}</div>}
          {loadError && <div className="page-error">{loadError}</div>}
          {loading ? (
            <LoadingState label="Loading bookings" />
          ) : bookings.length === 0 && !loadError ? (
            <div className="dashboard-empty">
              You have no bookings yet.
              <br />
              <Link to="/browse">Find your next PG</Link>
            </div>
          ) : (
            !loadError && (
              <div className="booking-table-wrap">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>PG</th>
                      <th>Move-in</th>
                      <th>Status</th>
                      <th>Requested</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <strong>
                            {booking.pg?.title || "Listing unavailable"}
                          </strong>
                          <small>{booking.pg?.address}</small>
                        </td>
                        <td>{formatDate(booking.moveInDate)}</td>
                        <td>
                          <span
                            className={`status-pill status-${booking.status}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>{formatDate(booking.createdAt)}</td>
                        <td>
                          {["pending", "confirmed"].includes(
                            booking.status,
                          ) && (
                            <button
                              className="dashboard-outline-button"
                              type="button"
                              disabled={cancelling === booking._id}
                              onClick={() => cancel(booking)}
                            >
                              {cancelling === booking._id
                                ? "Cancelling…"
                                : "Cancel"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </section>
      </main>
    </>
  );
};

export default StudentDashboard;
