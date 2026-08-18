import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import OwnerDashboard from "./OwnerDashboard";

const DashboardEntry = () => {
  const { user, loading } = useAuth();
  if (loading) return <main className="pg-page">Loading your account…</main>;
  if (user?.role === "owner") return <OwnerDashboard />;
  return <Navigate to="/browse" replace />;
};

export default DashboardEntry;
