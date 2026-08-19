import { Link, Outlet, useLocation } from "react-router-dom";
import DiscoveryHeader from "../components/DiscoveryHeader";
import "../../booking/booking.scss";

const OwnerDashboardLayout = () => {
  const location = useLocation();
  const requestsActive = location.pathname.endsWith("/requests");
  const addActive = location.pathname.endsWith("/new");

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
            <Link
              className={
                !requestsActive &&
                !addActive &&
                !location.pathname.endsWith("/profile")
                  ? "active"
                  : ""
              }
              to="/dashboard"
            >
              My Listings
            </Link>
            <Link
              className={requestsActive ? "active" : ""}
              to="/dashboard/requests"
            >
              Booking Requests
            </Link>
            <Link className={addActive ? "active" : ""} to="/dashboard/new">
              Add New PG
            </Link>
            <Link
              className={location.pathname.endsWith("/profile") ? "active" : ""}
              to="/dashboard/profile"
            >
              Profile
            </Link>
          </nav>
        </aside>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default OwnerDashboardLayout;
