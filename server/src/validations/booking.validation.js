const validationMiddleware = require("../middlewares/validation.middleware.js");
const mongoose = require("mongoose");

const validateCreateBooking = validationMiddleware([
  (payload) => {
    if (
      !payload.pgId ||
      typeof payload.pgId !== "string" ||
      !mongoose.isValidObjectId(payload.pgId)
    )
      return "A valid PG listing is required";
    return null;
  },
  (payload) => {
    if (
      !payload.moveInDate ||
      Number.isNaN(new Date(payload.moveInDate).getTime())
    )
      return "A valid move-in date is required";
    if (new Date(payload.moveInDate) < new Date(new Date().toDateString()))
      return "Move-in date cannot be in the past";
    return null;
  },
  (payload) =>
    ["single", "double", "triple"].includes(payload.roomType)
      ? null
      : "A valid room type is required",
  (payload) => {
    const duration = Number(payload.durationMonths);
    return Number.isInteger(duration) && duration >= 1 && duration <= 36
      ? null
      : "Duration must be between 1 and 36 months";
  },
]);

module.exports = { validateCreateBooking };
