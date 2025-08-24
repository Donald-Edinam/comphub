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
      // Debug logging
      console.log('CORS Origin Request:', origin);

      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        console.log('No origin - allowing');
        return callback(null, true);
      }

      // Allow localhost for development
      if (allowedOrigins.includes(origin)) {
        console.log('Origin in allowed list - allowing');
        return callback(null, true);
      }

      // Allow all HTTPS origins in production
      if (origin.startsWith('https://')) {
        console.log('HTTPS origin - allowing');
        return callback(null, true);
      }

      // Reject HTTP origins that aren't localhost
      console.log('Origin rejected:', origin);
      callback(new Error("Not allowed by CORS"));
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
