import express from "express";
import {
  BatchAllotController,
  verifyPaymentController,
} from "../controller/BatchAllot.js";

export const paymentRoute = express.Router();
// Route to initiate seat booking and payment
paymentRoute.post("/book-seat", BatchAllotController);

// Route to verify payment and allocate seat
paymentRoute.post("/verify-payment", verifyPaymentController);
