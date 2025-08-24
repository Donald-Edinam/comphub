const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { successResponse, errorResponse } = require("../utils/response");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, "All fields are required", 400);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, hashedPassword], function (err) {
    if (err) return errorResponse(res, "Email already exists", 400);
    return successResponse(res, "User registered successfully", { id: this.lastID, name, email }, 201);
  });
});

// Signin
router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return errorResponse(res, "Email and password required", 400);

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return next(err);
    if (!user) return errorResponse(res, "Invalid email or password", 401);

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) return errorResponse(res, "Invalid email or password", 401);

    // Issue access token (short-lived)
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
    
    // Issue refresh token (long-lived)
    const refreshToken = jwt.sign({ id: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, { expiresIn: "7d" });

    // Store refresh token in database
    const updateSql = `UPDATE users SET refresh_token = ? WHERE id = ?`;
    db.run(updateSql, [refreshToken, user.id], (updateErr) => {
      if (updateErr) return next(updateErr);
      
      return successResponse(res, "Login successful", { 
        accessToken, 
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  });
});

// Refresh token endpoint
router.post("/refresh", (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, "Refresh token required", 400);
  }

  // Verify refresh token
  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return errorResponse(res, "Invalid or expired refresh token", 403);
    }

    // Check if it's actually a refresh token
    if (decoded.type !== 'refresh') {
      return errorResponse(res, "Invalid token type", 403);
    }

    // Check if refresh token exists in database
    db.get("SELECT * FROM users WHERE id = ? AND refresh_token = ?", [decoded.id, refreshToken], (dbErr, user) => {
      if (dbErr) return next(dbErr);
      if (!user) {
        return errorResponse(res, "Invalid refresh token", 403);
      }

      // Issue new access token
      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
      
      // Optionally issue new refresh token (token rotation)
      const newRefreshToken = jwt.sign({ id: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, { expiresIn: "7d" });

      // Update refresh token in database
      const updateSql = `UPDATE users SET refresh_token = ? WHERE id = ?`;
      db.run(updateSql, [newRefreshToken, user.id], (updateErr) => {
        if (updateErr) return next(updateErr);
        
        return successResponse(res, "Token refreshed successfully", { 
          accessToken: newAccessToken, 
          refreshToken: newRefreshToken,
          user: { id: user.id, name: user.name, email: user.email }
        });
      });
    });
  });
});

// Logout endpoint (invalidate refresh token)
router.post("/logout", (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(res, "Refresh token required", 400);
  }

  // Verify and get user from refresh token
  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Even if token is invalid, we should still return success for logout
      return successResponse(res, "Logged out successfully");
    }

    // Remove refresh token from database
    const updateSql = `UPDATE users SET refresh_token = NULL WHERE id = ?`;
    db.run(updateSql, [decoded.id], (updateErr) => {
      if (updateErr) return next(updateErr);
      return successResponse(res, "Logged out successfully");
    });
  });
});

module.exports = router;
