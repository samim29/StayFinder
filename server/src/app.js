const express = require("express");

const authRouter = require("./routes/auth.route");
const pgRouter = require("./routes/pg.route");
const uploadRouter = require("./routes/upload.route");
const bookingRouter = require("./routes/booking.route");
const {
  responseShapeMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} = require("./middlewares/error.middleware");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(responseShapeMiddleware);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

/**
 *
 * @description health check route
 */
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

/**
 * @description authentication routes
 */
app.use("/api/auth", authRouter);

/**
 * @description PG routes
 */

app.use("/api/pg", pgRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/bookings", bookingRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
