import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seat: [
      {
        seatNo: {
          type: Number,
          required: true,
          unique: true,
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null, // Set default value
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          default: null, // Set default value
        },
        timing: {
          type: String,
          default: "", // Set default value
        },
        batch: {
          type: String,
          default: "", // Set default value
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Seat = mongoose.model("Seat", seatSchema);
