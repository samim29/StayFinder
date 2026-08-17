import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePg } from "../hooks/usePg";
import "../pg.scss";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { pgs, loading, handleGetMyPgs, handleDeletePg } = usePg();
  const [deletingPgId, setDeletingPgId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (user?.role === "owner") handleGetMyPgs().catch(() => {});
    // `handleGetMyPgs` is recreated by the shared context hook on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user?.role !== "owner") {
    return (
      <main className="pg-page">
        <section className="pg-dashboard">
          <h1>Welcome to StayFinder</h1>
          <p>Listing management is available to PG owner accounts.</p>
        </section>
      </main>
    );
  }

  const onDelete = async (pg) => {
    if (!window.confirm(`Delete “${pg.title}”? This permanently removes its photos too.`)) return;

    try {
      setDeleteError("");
      setDeletingPgId(pg._id);
      await handleDeletePg(pg._id);
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Could not delete this listing.");
    } finally {
      setDeletingPgId("");
    }
  };

  return (
    <main className="pg-page">
      <section className="pg-dashboard">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Owner dashboard</p>
            <h1>Your PG listings</h1>
          </div>
          <Link className="new-listing-button" to="/listings/new">
            + Add new listing
          </Link>
        </div>
        {deleteError && <div className="form-error">{deleteError}</div>}
        {loading && !deletingPgId ? (
          <p>Loading listings…</p>
        ) : pgs.length === 0 ? (
          <div className="empty-listings">
            <p>You have not published a listing yet.</p>
            <Link to="/listings/new">Create your first listing</Link>
          </div>
        ) : (
          <div className="listing-grid">
            {pgs.map((pg) => (
              <article className="listing-card" key={pg._id}>
                {pg.images[0]?.url ? <img src={pg.images[0].url} alt="" /> : <div className="listing-image-placeholder" />}
                <div>
                  <h2>{pg.title}</h2>
                  <p>
                    ₹{pg.rent.toLocaleString()} / month · {pg.availableBeds}{" "}
                    beds available
                  </p>
                  <div className="listing-actions">
                    <Link to={`/listings/${pg._id}/edit`}>Edit listing</Link>
                    <button type="button" className="delete-listing-button" disabled={deletingPgId === pg._id} onClick={() => onDelete(pg)}>
                      {deletingPgId === pg._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default OwnerDashboard;
