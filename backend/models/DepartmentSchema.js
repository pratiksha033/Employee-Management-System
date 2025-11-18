import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Department name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🟢 FIX to avoid Overwrite Model Error
export const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
