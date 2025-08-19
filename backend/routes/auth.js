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

    // Issue JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });

    return successResponse(res, "Login successful", { token });
  });
});

module.exports = router;
