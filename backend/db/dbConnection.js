import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/employeeSystem";

    await mongoose.connect(mongoURI);

    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDatabase;
