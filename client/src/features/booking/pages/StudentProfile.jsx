import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { changePassword, updateProfile } from "../../auth/services/auth.api";
import DiscoveryHeader from "../../pg/components/DiscoveryHeader";
import "../booking.scss";

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submitProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await updateProfile(profile);
      setUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };
  const submitPassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await changePassword(password);
      setPassword({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };
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
            <a href="/bookings">My Bookings</a>
            {/* <a href="/browse">Browse PGs</a> */}
            <a className="active" href="/student/profile">
              Profile
            </a>
          </nav>
        </aside>
        <section className="dashboard-content">
          <div className="owner-profile">
            <div className="dashboard-topline">
              <div>
                <p className="eyebrow">Account settings</p>
                <h1>Student profile</h1>
              </div>
            </div>
            {message && <div className="profile-success">{message}</div>}
            {error && <div className="form-error">{error}</div>}
            <div className="profile-grid">
              <section className="profile-card">
                <h2>Personal details</h2>
                <p className="profile-muted">
                  Keep your contact details current so PG owners can reach you.
                </p>
                <form onSubmit={submitProfile}>
                  <label>
                    Full name
                    <input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      required
                      minLength="2"
                    />
                  </label>
                  <label>
                    Email address
                    <input value={user?.email || ""} disabled />
                  </label>
                  <label>
                    Phone number
                    <input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      maxLength="10"
                      required
                    />
                  </label>
                  <button className="publish-button" disabled={saving}>
                    {saving ? "Saving…" : "Save profile"}
                  </button>
                </form>
              </section>
              <section className="profile-card">
                <h2>Security</h2>
                <p className="profile-muted">
                  Use a strong password you do not reuse elsewhere.
                </p>
                <form onSubmit={submitPassword}>
                  <label>
                    Current password
                    <input
                      type="password"
                      value={password.currentPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label>
                    New password
                    <input
                      type="password"
                      minLength="8"
                      value={password.newPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <button
                    className="secondary-profile-button"
                    disabled={saving}
                  >
                    {saving ? "Updating…" : "Change password"}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default StudentProfile;
