import express from "express";
import AuthController from "../controller/AuthController.js";
import { verifyEmailController } from "../controller/VerifyEmail.controller.js";
import { forgetPasswordController } from "../controller/ForgetPassword.js";
const { signUp, signIn } = AuthController;

const { requestPasswordReset, resetPassword } = forgetPasswordController;

const userRoute = express.Router();

userRoute.post("/signup", signUp);
userRoute.post("/signin", signIn);
userRoute.get("/verify-email/:token", verifyEmailController);

userRoute.post("/forget-password", requestPasswordReset);

userRoute.post("/reset-password/:token", resetPassword);

export default userRoute;
