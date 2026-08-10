import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} from "../services/auth.api.js";

/**
 * @description Custom hook to access authentication context and perform authentication actions.
 * @return {Object} - An object containing user, loading state, and authentication action functions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  /**
   * @description Handles user registration.
   * @param {Object} userData - The user data for registration.
   * @return {Promise<boolean>} - Returns true if registration is successful, false otherwise.
   */
  const handleRegister = async ({ name, email, phone, password, role }) => {
    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        phone,
        password,
        role,
      });

      if (!data?.user) {
        throw new Error("User data was not returned by the server");
      }

      setUser(data.user);

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Handles user login.
   * @param {Object} loginData - The login data containing identifier and password.
   * @return {Promise<boolean>} - Returns true if login is successful, false otherwise.
   */
  const handleLogin = async ({ identifier, password, role }) => {
    setLoading(true);

    try {
      const data = await loginUser({ identifier, password, role });
      // console.log("Login response data:", data);
      if (!data?.user) {
        throw new Error("User data was not returned by the server");
      }

      setUser(data.user);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Handles user logout.
   * @return {Promise<void>}
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};
