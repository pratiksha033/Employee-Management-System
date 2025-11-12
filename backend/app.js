import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRouter.js";
import departmentRouter from "./routes/departmentRouter.js";
import employeeRouter from "./routes/employeeRouter.js";
import salaryRouter from "./routes/salaryRouter.js"; // <-- ADDED
import leaveRouter from "./routes/leaveRoutes.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import connectToDatabase from "./db/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";
import attendanceRouter from "./routes/attendanceRouter.js";
import recruitmentRoutes from "./routes/recruitmentRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] // Ensure Authorization is allowed
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/salary", salaryRouter); // <-- ADDED
app.use("/api/v1/leave", leaveRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/recruitment", recruitmentRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);

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
