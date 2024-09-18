import { verifyToken } from "../utils/jsonwebtojen.js"; // Ensure the import path is correct
import { errorResponse, successResponse } from "../utils/response.js";

export const tokenCheckMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return errorResponse(res, "No authorization header provided!", "", 403);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return errorResponse(res, "Invalid authorization header format!", "", 400);
  }

  try {
    const decoded = await verifyToken(token);
    req.userId = decoded.id; // Assuming the token contains the userId as 'id'
    next();
  } catch (err) {
    return errorResponse(res, "Unauthorized!", err.message, 401);
  }
};
