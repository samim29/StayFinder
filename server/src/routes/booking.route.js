const express = require("express");
const {
  authMiddleware,
  authorizeRoleMiddleware,
} = require("../middlewares/auth.middleware.js");
const {
  validateCreateBooking,
} = require("../validations/booking.validation.js");
const bookingController = require("../controllers/booking.controller.js");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoleMiddleware("student"),
  validateCreateBooking,
  bookingController.createBookingController,
);
router.get(
  "/mine",
  authMiddleware,
  authorizeRoleMiddleware("student"),
  bookingController.getMyBookingsController,
);
router.get(
  "/owner",
  authMiddleware,
  authorizeRoleMiddleware("owner"),
  bookingController.getOwnerBookingsController,
);
router.patch(
  "/:bookingId/accept",
  authMiddleware,
  authorizeRoleMiddleware("owner"),
  bookingController.acceptBookingController,
);
router.patch(
  "/:bookingId/reject",
  authMiddleware,
  authorizeRoleMiddleware("owner"),
  bookingController.rejectBookingController,
);
router.patch(
  "/:bookingId/cancel",
  authMiddleware,
  authorizeRoleMiddleware("student"),
  bookingController.cancelBookingController,
);

module.exports = router;
