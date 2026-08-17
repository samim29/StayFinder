import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * @description Prevents non-owner accounts from accessing owner listing screens.
 */
const OwnerRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <main className="pg-page">Loading your account…</main>;

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== "owner") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default OwnerRoute;
