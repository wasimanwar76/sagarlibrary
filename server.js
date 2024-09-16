import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import cors from "cors";

import userRoute from "./route/user.route.js";
import { paymentRoute } from "./route/payment.route.js";

dotenv.config({
  path: "./.env",
});

const app = express();

const { PORT, MONGODB_PATH, CORS_ORIGIN } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_PATH);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const SERVERPORT = PORT || 9000;
// const origin = CORS_ORIGIN || "http://localhost:3000";

// app.use(
//   cors({
//     origin,
//   })
// );
app.use(express.json());

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/payment", paymentRoute);
connectDB().then(
  app.listen(SERVERPORT, () => {
    console.log(`Your app is running in http://localhost:${PORT}`);
  })
);
