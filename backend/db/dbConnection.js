import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "EMS",
    });

    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Error occurred while connecting to database:", err);
    throw err; // This will be caught in app.js
  }
};

export default dbConnection;
