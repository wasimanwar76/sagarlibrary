import express from "express";
import { tokenCheckMiddleware } from "../middleware/tokenCheck.middleware.js";
import { bookSeatWithPayment } from "../controller/BatchAllot.js";

export const paymentRoute = express.Router();
// Route to initiate seat booking and payment
paymentRoute.post("/book-seat", tokenCheckMiddleware, bookSeatWithPayment);
