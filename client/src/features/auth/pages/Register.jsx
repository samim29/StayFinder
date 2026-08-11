
import React, { useState } from "react";
import AuthSide from "../components/AuthSide";
import "../auth.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/auth.validation";
import { getErrorMessage } from "../utils/errorHandler";
const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "student",
    },
  });

  // Watch role so the UI updates when the role changes
  const role = watch("role");

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const isRegistered = await handleRegister(data);

      if (isRegistered) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      setServerError(
        getErrorMessage(error, "Registration failed. Please try again.")
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
          <h2>Create your account</h2>

          <p>
            Tell us who you are so we can get you to the right dashboard.
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
            {/* Name */}
            <div className="field">
              <label htmlFor="name">FULL NAME</label>

              <input
                type="text"
                id="name"
                placeholder="Rohan Mehta"
                {...register("name")}
              />

              {errors.name && (
                <div className="field-error">
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="field">
              <label htmlFor="email">EMAIL</label>

              <input
                type="email"
                id="email"
                placeholder="rohan@email.com"
                {...register("email")}
              />

              {errors.email && (
                <div className="field-error">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="field">
              <label htmlFor="phone">PHONE</label>

              <input
                type="text"
                id="phone"
                placeholder="9xxxxxxxxx"
                {...register("phone")}
              />

              {errors.phone && (
                <div className="field-error">
                  {errors.phone.message}
                </div>
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
                <div className="field-error">
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="switch-line">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;

