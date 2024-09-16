import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["student", "admin"], // Example user types, can be adjusted
      default: "student",
    },
    batch: { type: String, enum: ["alpha", "beta", "gamma", "custom"] },
    seatNo: { type: Number, default: null },
    subscriptionDate: {
      type: Date,
      required: false,
      default: null,
    },

    slot: {
      type: String,
      enum: ["6am-10am", "10am-2pm", "2pm-6pm", "6pm-10pm"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    verifyToken: { type: String },
    verifyTokenExpiresIn: { type: Date },
    userVerified: { type: Boolean, default: false },
  },
  { versionKey: false, timeseries: true }
);

export const User = mongoose.model("User", userSchema);
