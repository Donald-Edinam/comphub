require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/database");
const authRoutes = require("./routes/auth");
const componentRoutes = require("./routes/components");

const app = express();
const PORT = 5000;

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Vite default
  "http://localhost:5174", // Vite alt
  "https://comphub.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you’re sending cookies/auth headers
  })
);

// Preflight request
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/components", componentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Component Tracker API is running 🚀");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
