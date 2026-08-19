import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import OwnerDashboard from "./OwnerDashboard";
import StudentDashboard from "../../booking/pages/StudentDashboard";

const DashboardEntry = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main className="pg-page">Loading your account…</main>;
  if (user?.role === "owner") return <OwnerDashboard />;
  if (user?.role === "student") return <StudentDashboard />;
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default DashboardEntry;
