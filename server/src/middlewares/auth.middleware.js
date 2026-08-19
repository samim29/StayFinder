const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const tokenBlackListModel = require("../models/blackList.model");

/**
 * @description Middleware to authenticate user based on JWT token.
 * It checks for the token in cookies or authorization header,
 * verifies it, and attaches the user object to the request.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const isBlacklisted = await tokenBlackListModel.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Unauthorized access, token is invalid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

/**
 * @description Middleware to authorize user based on role.
 * It checks if the authenticated user has the required role to access the route.
 * @param {string} role - The required role for the route.
 */
const authorizeRoleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoleMiddleware };
