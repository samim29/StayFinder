import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePg } from "../hooks/usePg";
import { getOptimizedImageUrl } from "../utils/image.utils";
import "../pg.scss";
import LoadingState from "../../../components/LoadingState";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { pgs, loading, handleGetMyPgs, handleDeletePg } = usePg();
  const [deletingPgId, setDeletingPgId] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (user?.role === "owner")
      handleGetMyPgs().catch(() =>
        setLoadError("Could not load your listings. Please try again."),
      );
    // The context action is intentionally excluded because it is recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onDelete = async (pg) => {
    if (
      !window.confirm(
        `Delete “${pg.title}”? This permanently removes its photos too.`,
      )
    )
      return;
    try {
      setDeleteError("");
      setDeletingPgId(pg._id);
      await handleDeletePg(pg._id);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Could not delete this listing.",
      );
    } finally {
      setDeletingPgId("");
    }
  };

  return (
    <>
      <div className="dashboard-topline">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1>Your PG listings</h1>
        </div>
        <Link className="new-listing-button" to="/listings/new">
          + Add new listing
        </Link>
      </div>
      {deleteError && <div className="form-error">{deleteError}</div>}
      {loadError && <div className="form-error">{loadError}</div>}
      {loading ? (
        <LoadingState label="Loading listings" />
      ) : pgs.length === 0 && !loadError ? (
        <div className="dashboard-empty">
          <p>You have not published a listing yet.</p>
          <Link to="/listings/new">Create your first listing</Link>
        </div>
      ) : (
        !loadError && (
          <div className="listing-grid">
            {pgs.map((pg) => (
              <article className="listing-card" key={pg._id}>
                {pg.images?.[0]?.url ? (
                  <img
                    src={getOptimizedImageUrl(pg.images[0].url, {
                      width: 300,
                      height: 220,
                    })}
                    alt=""
                  />
                ) : (
                  <div className="listing-image-placeholder" />
                )}
                <div>
                  <h2>{pg.title}</h2>
                  <p>
                    ₹{pg.rent.toLocaleString()} / month · {pg.availableBeds}{" "}
                    beds available
                  </p>
                  <div className="listing-actions">
                    <Link to={`/listings/${pg._id}/edit`}>Edit listing</Link>
                    <button
                      type="button"
                      className="delete-listing-button"
                      disabled={deletingPgId === pg._id}
                      onClick={() => onDelete(pg)}
                    >
                      {deletingPgId === pg._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default OwnerDashboard;
