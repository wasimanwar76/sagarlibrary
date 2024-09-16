import { User } from "../model/user.model.js"; // Import the User model
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { errorResponse, successResponse } from "../utils/response.js";
import { generateToken } from "../utils/jsonwebtojen.js";
import crypto from "crypto";
import { verifyEmail } from "../mail/authmail/verifyMail.js";
import { welcomeEmail } from "../mail/authmail/welcomeMail.js";

const AuthController = {
  async signUp(req, res) {
    const { name, email, password, phone } = req.body;
    // Check if required fields are missing
    if (!name || !email || !password || !phone) {
      return errorResponse(
        res,
        "All fields required: name, email, and password are mandatory",
        null,
        400
      );
    }
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return errorResponse(res, "User already exists", null, 400);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate 16 random bytes and convert to hexadecimal string
      const verifyEmailToken = crypto.randomBytes(16).toString("hex");
      const verifyEmailExpiresIn = Date.now() + 24 * 60 * 60 * 1000;

      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        verifyToken: verifyEmailToken,
        verifyTokenExpiresIn: verifyEmailExpiresIn,
      });

      await newUser.save();
      const token = generateToken({
        id: newUser.id,
        name: newUser.name,
        role: newUser.userType,
      });
      await verifyEmail(
        { name: newUser.name, email: newUser.email },
        newUser.verifyToken
      );
      await welcomeEmail({ name: newUser.name, email: newUser.email });
      const userData = {
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        phone: newUser.phone,
        token,
      };
      return successResponse(res, "User created successfully", userData, 201);
    } catch (error) {
      return errorResponse(res, "Server error", error.message);
    }
  },

  async signIn(req, res) {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return errorResponse(res, "Invalid email or password", null, 404);
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, "Invalid email or password", null, 400);
      }

      // Create a token
      const token = generateToken({ id: user.id, name: user.name });

      // Respond with token

      const data = {
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        isverified: user.userVerified,
        token,
      };
      return successResponse(res, "logged in successful", data);
    } catch (error) {
      // Handle server errors
      return errorResponse(res, "Server error", error.message);
    }
  },
};

export default AuthController;
