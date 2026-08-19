import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const StudentRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return <main className="booking-page">Loading your account…</main>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== "student") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default StudentRoute;
