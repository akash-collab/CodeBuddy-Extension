const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is configured
        if (!process.env.MONGODB_URI) {
            console.warn("⚠️  MONGODB_URI not configured. Database logging will be disabled.");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.warn("⚠️  MongoDB connection failed:", err.message);
        console.log("📝 Database logging will be disabled. The extension will still work without logging.");
    }
};

module.exports = connectDB;