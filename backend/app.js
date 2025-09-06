import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRouter.js";
import connectToDatabase from "./db/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // fallback to * if FRONTEND_URL not set
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);

// Error handling middleware
app.use(errorMiddleware);

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectToDatabase();

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server due to DB connection error");
    process.exit(1);
  }
};

startServer();
