
import React, { useEffect, useState } from "react";
import AuthSide from "../components/AuthSide";
import "../auth.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/auth.validation";
import { getErrorMessage } from "../utils/errorHandler";

const Login = () => {
  const { handleLogin, loading, user } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      identifier: "",
      password: "",
      role: "student",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const isLoggedIn = await handleLogin(data);

      if (isLoggedIn) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setServerError(
        getErrorMessage(error, "Login failed. Please check your credentials.")
      );
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <main className="auth-page">
      <AuthSide />

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Login to your account</h2>

          <p>
            Enter your email or phone number to access your dashboard.
          </p>

          {/* Role Selection */}
          <div
            className="role-toggle"
            role="tablist"
            aria-label="Account type"
          >
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              aria-pressed={role === "student"}
              onClick={() => setValue("role", "student")}
            >
              I'm a Student
            </button>

            <button
              type="button"
              className={role === "owner" ? "active" : ""}
              aria-pressed={role === "owner"}
              onClick={() => setValue("role", "owner")}
            >
              I'm a PG Owner
            </button>
          </div>

          <p className="role-status">
            Selected role:{" "}
            {role === "student" ? "Student" : "PG Owner"}
          </p>

          {/* Server Error */}
          {serverError && (
            <div className="form-error">
              {serverError}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Identifier */}
            <div className="field">
              <label htmlFor="identifier">
                EMAIL OR PHONE NUMBER
              </label>

              <input
                type="text"
                id="identifier"
                placeholder="rohan@email.com or 9xxxxxxxxx"
                {...register("identifier")}
              />

              {errors.identifier && (
                <p className="field-error">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">PASSWORD</label>

              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register("password")}
              />

              {errors.password && (
                <p className="field-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="switch-line">
            Don't have an account?{" "}
            <Link to="/register">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;

