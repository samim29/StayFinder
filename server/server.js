if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = require("./src/app");
const connectDb = require("./src/config/database.config");
const {
  startBookingExpiryJob,
} = require("./src/controllers/booking.controller");
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production" && (!process.env.MONGODB_URI || !process.env.JWT_SECRET || !process.env.CLIENT_URLS)) {
  throw new Error("Missing required production environment variables: MONGODB_URI, JWT_SECRET, CLIENT_URLS");
}

connectDb();
startBookingExpiryJob();

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
