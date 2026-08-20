import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import "../booking.scss";
import LoadingState from "../../../components/LoadingState";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const OwnerBookingRequests = () => {
  const {
    bookings,
    loading,
    handleGetOwnerBookings,
    handleAcceptBooking,
    handleRejectBooking,
  } = useBooking();
  const [actionId, setActionId] = useState("");
  const [loadError, setLoadError] = useState("");
  const [selectedStat, setSelectedStat] = useState("pending");
  const pending = useMemo(
    () => bookings.filter((booking) => booking.status === "pending"),
    [bookings],
  );
  const confirmed = useMemo(() => bookings.filter((booking) => booking.status === "confirmed"), [bookings]);
  const statDetails = selectedStat === "total" ? bookings : selectedStat === "confirmed" ? confirmed : pending;

  useEffect(() => {
    handleGetOwnerBookings().catch(() =>
      setLoadError("Could not load booking requests. Please try again."),
    ); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const decide = async (booking, action) => {
    try {
      setActionId(booking._id);
      await action(booking._id);
    } finally {
      setActionId("");
    }
  };

  return (
    <>
      <div className="dashboard-stats">
        <button type="button" className={`stat-card ${selectedStat === "total" ? "selected" : ""}`} onClick={() => setSelectedStat("total")}>
          <strong>{bookings.length}</strong>
          <span>Total requests</span>
        </button>
        <button type="button" className={`stat-card ${selectedStat === "pending" ? "selected" : ""}`} onClick={() => setSelectedStat("pending")}>
          <strong>{pending.length}</strong>
          <span>Pending requests</span>
        </button>
        <button type="button" className={`stat-card ${selectedStat === "confirmed" ? "selected" : ""}`} onClick={() => setSelectedStat("confirmed")}>
          <strong>
            {confirmed.length}
          </strong>
          <span>Confirmed beds</span>
        </button>
      </div>
      <section className="stat-details"><h2>{selectedStat === "total" ? "All booking requests" : selectedStat === "confirmed" ? "Confirmed bookings" : "Pending requests"}</h2>{statDetails.length === 0 ? <p className="profile-muted">No bookings in this category.</p> : <div className="stat-detail-list">{statDetails.map((booking) => <div className="stat-detail-row" key={booking._id}><div><strong>{booking.student?.name || "Student"}</strong><small>{booking.pg?.title || "Listing unavailable"}</small></div><span className={`status-pill status-${booking.status}`}>{booking.status}</span><time>{formatDate(booking.moveInDate)}</time></div>)}</div>}</section>
      <div className="dashboard-topline">
        <h1>Pending Requests</h1>
        <Link className="dashboard-outline-button" to="/dashboard">
          My listings
        </Link>
      </div>
      {loadError && <div className="page-error">{loadError}</div>}
      {loading ? (
        <LoadingState label="Loading requests" />
      ) : pending.length === 0 && !loadError ? (
        <div className="dashboard-empty">No pending booking requests.</div>
      ) : (
        !loadError && (
          <div className="booking-table-wrap">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>PG</th>
                  <th>Move-in</th>
                  <th>Requested</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.student?.name}</strong>
                      <small>{booking.student?.phone}</small>
                    </td>
                    <td>{booking.pg?.title}</td>
                    <td>{formatDate(booking.moveInDate)}</td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="accept-button"
                          type="button"
                          disabled={actionId === booking._id}
                          onClick={() => decide(booking, handleAcceptBooking)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={actionId === booking._id}
                          onClick={() => decide(booking, handleRejectBooking)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
};

export default OwnerBookingRequests;
