import jwt from "jsonwebtoken";
import { config } from "dotenv";
config({
  path: "./.env",
});

const { JWT_SECRET } = process.env;

const { sign, verify } = jwt;

// Function to generate a JWT
export const generateToken = (payload, expiresIn = "7d") => {
  const token = sign(payload, JWT_SECRET, { expiresIn });
  return token;
};

// Function to verify a JWT
export const verifyToken = (token) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // Return null if token is invalid or expired
  }
};
