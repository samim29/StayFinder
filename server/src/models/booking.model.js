const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true,
    },
    moveInDate: { type: Date, required: true },
    roomType: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },
    durationMonths: { type: Number, required: true, min: 1, max: 36 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "expired"],
      default: "pending",
    },
    expiresAt: { type: Date, required: true },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

// MongoDB removes expired booking documents automatically.
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
bookingSchema.index(
  { student: 1, pg: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
  },
);
bookingSchema.index({ owner: 1, status: 1, createdAt: -1 });
bookingSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
