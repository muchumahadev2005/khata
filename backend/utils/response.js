exports.successResponse = (res, data) => {
  res.status(200).json({ success: true, data });
};

exports.errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};