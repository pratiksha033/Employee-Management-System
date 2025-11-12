import { Attendance } from "../models/attendanceSchema.js";
import { User } from "../models/userSchema.js";

// ✅ Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status)
      return res.status(400).json({ success: false, message: "Missing fields" });

    // Check if already marked
    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json({ success: true, message: "Attendance updated" });
    }

    await Attendance.create({ employeeId, date, status });
    res.json({ success: true, message: "Attendance marked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Attendance for date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const records = await Attendance.find({ date });

    const attendanceMap = {};
    records.forEach((r) => {
      attendanceMap[r.employeeId] = r.status;
    });

    res.json({ success: true, attendance: attendanceMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
