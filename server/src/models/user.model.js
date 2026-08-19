const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned by default in queries
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Enter a valid 10-digit phone number"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "owner"],
        message: "Role must be either student or owner",
      },
      default: "student",
    },
  },
  { timestamps: true },
);

//Hash password before saving, but only if it changed

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  return;
});

// Instance method used during login
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
