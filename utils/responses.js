export const successResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    message,
    data,
  });
};

export const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ status: "error", message });
};
