import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import StudentDashboard from "../../booking/pages/StudentDashboard";
import OwnerDashboardLayout from "./OwnerDashboardLayout";

const DashboardRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <main className="pg-page">Loading your account…</main>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role === "student") {
    if (location.pathname !== "/dashboard")
      return <Navigate to="/dashboard" replace />;
    return <StudentDashboard />;
  }
  if (user.role === "owner") return <OwnerDashboardLayout />;
  return <Navigate to="/" replace />;
};

export default DashboardRoute;
