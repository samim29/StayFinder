import React, { useEffect, useState } from "react";
import AuthSide from "../components/AuthSide";
import "../auth.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
const Login = () => {
  const { handleLogin, loading, user } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  useEffect(() => {

    if (!loading && user) {
      navigate("/dashboard");
    }

  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    const isLoggedIn = await handleLogin({ identifier, password, role });
    if (isLoggedIn) {
      // Handle successful login (e.g., redirect to dashboard)
      navigate("/dashboard");
    } else {
      // Handle login failure (e.g., show error message)
      console.error("Login failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="auth-page">
      <AuthSide />
      <section className="auth-panel">
        <div className="auth-card">
          <h2>Login to your account</h2>
          <p>Enter your email or phone number to access your dashboard.</p>
          <div className="role-toggle" role="tablist" aria-label="Account type">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              aria-pressed={role === "student"}
              onClick={() => {
                setRole("student");
              }}
            >
              I'm a Student
            </button>
            <button
              type="button"
              className={role === "owner" ? "active" : ""}
              aria-pressed={role === "owner"}
              onClick={() => {
                setRole("owner");
              }}
            >
              I'm a PG Owner
            </button>
          </div>
          <p className="role-status">
            Selected role: {role === "student" ? "Student" : "PG Owner"}
          </p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="identifier">EMAIL OR PHONE NUMBER</label>
              <input
                type="text"
                name="identifier"
                id="identifier"
                placeholder="rohan@email.com or 9xxxxxxxxx"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="field-error">
                Password must be at least 8 characters.
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Log in
            </button>
          </form>
          <p className="switch-line">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
