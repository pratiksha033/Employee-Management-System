// dbConnection.js
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    console.log("🌐 Connecting to Local MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "EMS",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to Local MongoDB");
  } catch (err) {
    console.error("❌ Error occurred while connecting to local database:", err.message);
    process.exit(1); // Stop the app if local DB is unreachable
  }
};

export default dbConnection;
