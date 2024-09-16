import { User } from "../model/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
export const verifyEmailController = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    if (user.verifyTokenExpiresIn >= Date.now()) {
      user.verifyToken = null;
      user.verifyTokenExpiresIn = null;
      user.userVerified = true;
      await user.save();
      return successResponse(res, "Email verified successfully!", "", 201);
    } else {
      return errorResponse(
        res,
        "Email Verification Token was expired",
        error.message
      );
    }
  } catch (error) {
    return errorResponse(res, "Server error", error.message);
  }
};
