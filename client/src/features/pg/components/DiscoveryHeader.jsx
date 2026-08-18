import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const DiscoveryHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="discovery-header">
      <Link className="discovery-brand" to="/">
        <span className="brand-mark">SF</span><strong>StayFinder</strong>
      </Link>
      <nav>
        <Link to="/browse">Browse PGs</Link>
        <a href="#how-it-works">How it works</a>
        {user?.role === "owner" && <Link to="/listings/new">List your PG</Link>}
      </nav>
      <div className="header-actions">
        {user ? <button type="button" onClick={() => navigate("/dashboard")}>Dashboard</button> : <><Link to="/login">Log in</Link><Link className="header-signup" to="/register">Sign up</Link></>}
      </div>
    </header>
  );
};

export default DiscoveryHeader;
