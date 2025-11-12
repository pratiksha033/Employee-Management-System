import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  status: { type: String, enum: ["Present", "Absent"], required: true },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
