import axios from "axios";
import { User } from "../model/user.model.js";
import { Order } from "../model/order.model.js";
import { Seat } from "../model/seat.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
const { UPIGATEWAY_API_KEY, UPIGATEWAY_ENDPOINT } = process.env;

export const bookSeatWithPayment = async (req, res) => {
  try {
    const { batch, timing, amount } = req.body;
    const userId = req.userId;

    const batches = {
      alpha: { duration: "3 months", name: "Alpha" },
      beta: { duration: "6 months", name: "Beta" },
      gamma: { duration: "12 months", name: "Gamma" },
      custom: { duration: "1 month", name: "Custom" },
    };

    const timings = ["6am-10am", "10am-2pm", "2pm-6pm", "6pm-10pm"];

    // Validate batch and timing

    if ((!batch || !timing, !amount)) {
      return errorResponse(res, "Please Enter all required fields", "", 400);
    }

    if (!batches[batch]) {
      return errorResponse(res, "Invalid batch selected", "", 400);
    }

    if (!timings.includes(timing)) {
      return errorResponse(res, "Invalid timing selected", "", 400);
    }

    // Find available seat
    const seats = await Seat.findOne({ [`seats.${timing}`]: null });
    if (seats === null) {
      const existingSeats = await Seat.findOne();
      if (!existingSeats) {
        const newSeats = new Seat();
        for (let i = 1; i <= 101; i++) {
          newSeats.seat.push({ seatNo: i });
        }
        await newSeats.save();
      }
    }

    const emptySeats = await Seat.find({ seat: { $eq: null } });

    const seat = await Seat.find({
      seats: {
        $elemMatch: {
          timing: timing,
          batch: batch,
          studentId: null, // Ensure seat is free
        },
      },
    });

    // if (seat || seat.length === 0) {
    //   return res.status(400).json({ message: "No seats available." });
    // }
  } catch (error) {
    return errorResponse(res, "Unable to book the batch", error.message, 500);
  }
};
