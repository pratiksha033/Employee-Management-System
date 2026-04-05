import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Absent",
  },
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
