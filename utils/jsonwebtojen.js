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
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err); // Pass the error to the reject function
      }
      resolve(decoded); // Pass the decoded token to the resolve function
    });
  });
};
