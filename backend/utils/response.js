function successResponse(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message, statusCode = 400, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { successResponse, errorResponse };
