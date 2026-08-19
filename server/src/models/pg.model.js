const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude] — GeoJSON order, NOT lat/lng
        required: [true, "Location coordinates are required"],
      },
    },

    rent: {
      type: Number,
      required: [true, "Monthly rent is required"],
      min: 0,
    },
    totalBeds: {
      type: Number,
      required: [true, "Total beds is required"],
      min: 1,
    },
    availableBeds: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalBeds && value >= 0;
        },
        message: "Available beds cannot exceed total beds",
      },
    },

    roomTypes: [{ type: String, enum: ["single", "double", "triple"] }],
    amenities: [{ type: String, trim: true }],
    rules: { type: String },
    genderPreference: {
      type: String,
      enum: ["boys", "girls", "co-ed"],
      default: "co-ed",
    },

    contact: {
      phone: { type: String, required: [true, "Contact phone is required"] },
      email: { type: String },
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }, // needed to delete from Cloudinary later
      },
    ],
  },
  { timestamps: true },
);

pgSchema.index({ location: "2dsphere" });
pgSchema.index({ rent: 1, availableBeds: 1 });

const PgModel = mongoose.model("PG", pgSchema);

module.exports = PgModel;
