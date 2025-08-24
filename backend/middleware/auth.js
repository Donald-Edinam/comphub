const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return errorResponse(res, "Access denied. No token provided", 401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Check if it's an expired token
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, "Token expired", 401);
      }
      return errorResponse(res, "Invalid token", 403);
    }
    
    // Make sure it's not a refresh token being used as access token
    if (user.type === 'refresh') {
      return errorResponse(res, "Invalid token type", 403);
    }
    
    req.user = user; // Attach user info to request
    next();
  });
}

module.exports = authenticateToken;
