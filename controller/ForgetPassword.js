import { User } from "../model/user.model.js";
import { passwordResetMail } from "../mail/authmail/passwordResetMail.js";
import { errorResponse, successResponse } from "../utils/response.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const forgetPasswordController = {
  requestPasswordReset: async (req, res) => {
    const { email } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse(res, "User not found", null, 404);
      }
      // Generate a secure token
      const token = crypto.randomBytes(32).toString("hex");

      // Set token and expiration date
      user.verifyToken = token;
      user.verifyTokenExpiresIn = Date.now() + 86400000; // Token expires in 24 hours
      // Save the user with the updated fields
      await user.save();
      await passwordResetMail(
        { name: user.name, email: user.email },
        user.verifyToken
      );
      return successResponse(res, "Password reset email sent");
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error in sending password reset email", error });
    }
  },

  resetPassword: async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;
    try {
      const user = await User.findOne({ verifyToken: token });
      if (!user) {
        return errorResponse(res, "User not found", null, 404);
      }
      if (user.verifyTokenExpiresIn >= Date.now()) {
        user.verifyToken = null;
        user.verifyTokenExpiresIn = null;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return successResponse(res, "Password Changed successfully", "", 201);
      } else {
        return errorResponse(
          res,
          "Password Reset Token was expired",
          error.message
        );
      }
    } catch (error) {
      return errorResponse(res, "Error While reseting password", error.message);
    }
  },
};
