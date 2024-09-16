// response.js
export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    status: false,
    message,
    error,
  });
};
