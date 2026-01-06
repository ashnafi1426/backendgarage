// Import modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// Load environment variables
dotenv.config();
// Import router index file
const router = require("./routes");
// Create express app
const app = express();
// CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"]
}));
app.use(express.json()); // for JSON body parsing

// Routes
app.use(router);

// Start server
const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export
module.exports = app;
