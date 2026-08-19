import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const DiscoveryHeader = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="discovery-header">
      <Link className="discovery-brand" to="/">
        <span className="brand-mark">SF</span>
        <strong>StayFinder</strong>
      </Link>
      <nav>
        <Link to="/browse">Browse PGs</Link>
        <Link to="/how-it-works">How it works</Link>
        {user?.role === "student" && <Link to="/bookings">My bookings</Link>}
        {user?.role === "owner" && <Link to="/dashboard">Dashboard</Link>}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            {/* <button type="button" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button> */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await handleLogout();
                  navigate("/");
                } catch {
                  /* keep the current session visible when logout fails */
                }
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link className="header-signup" to="/register">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default DiscoveryHeader;
