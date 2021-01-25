const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Routes
const userRoutes = require("./routes/user");

// Connect databse
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable cors
app.use(cors());

// Mount routes
app.use("/api/v1", userRoutes);

app.get("/api/v1/", (req, res) => {
  res.send("Hello from express");
});

// Routes above errorhandler
app.use(errorHandler);

// set dev port (localhost:5000)
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandleRejection", (err, promise) => {
  try {
    console.log("Resovled");
  } catch (err) {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit
    server.close(() => process.exit());
  }
});
