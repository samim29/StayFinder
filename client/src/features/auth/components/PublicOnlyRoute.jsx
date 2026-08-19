import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <main className="auth-page">
        <div className="auth-card">Loading your account…</div>
      </main>
    );
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default PublicOnlyRoute;
