const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const hintRoutes = require("./routes/hintRoutes")

dotenv.config();
connectDB();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    "https://chrome.google.com",
    "chrome-extension://*",
    "http://localhost:3000", // For development
    "https://localhost:3000" // For development
  ], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/api/hints", hintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server running at port", PORT);
    console.log("🔑 GEMINI_API_KEY configured:", !!process.env.GEMINI_API_KEY);
    console.log("🌍 Environment:", process.env.NODE_ENV || 'development');
});