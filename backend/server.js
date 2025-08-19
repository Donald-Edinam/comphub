const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/database");
const authRoutes = require("./routes/auth")
const componentRoutes = require("./routes/components");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/components", componentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Something went wrong!"
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Component Tracker API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
