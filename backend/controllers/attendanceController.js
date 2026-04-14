import { Attendance } from "../models/attendanceSchema.js";
import { User } from "../models/userSchema.js";

// ✅ Helper: get today's date string "YYYY-MM-DD" in IST
const getTodayIST = () => {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split("T")[0];
};

// ✅ EMPLOYEE: Check In
export const checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const date = getTodayIST();
    const now = new Date();

    // Office grace window: 9:00 AM – 10:00 AM IST
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const hours = istNow.getUTCHours();
    const minutes = istNow.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;

    // 9:00 AM = 540 min, 3:00 PM = 900 min (testing) | production: change back to 600
    const isLate = totalMinutes > 900;
    const status = isLate ? "Late" : "Present";

    // Check if already checked in today
    const existing = await Attendance.findOne({ employeeId, date });
    if (existing && existing.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked in for today",
      });
    }

    if (existing) {
      existing.checkInTime = now;
      existing.status = status;
      await existing.save();
    } else {
      await Attendance.create({ employeeId, date, status, checkInTime: now });
    }

    res.json({
      success: true,
      message: isLate
        ? `Checked in (Late) at ${istNow.toUTCString()}`
        : `Checked in (Present) at ${istNow.toUTCString()}`,
      status,
      checkInTime: now,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ EMPLOYEE: Check Out
export const checkOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const date = getTodayIST();
    const now = new Date();

    const record = await Attendance.findOne({ employeeId, date });

    if (!record || !record.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "You haven't checked in today yet",
      });
    }

    if (record.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out for today",
      });
    }

    record.checkOutTime = now;
    await record.save();

    res.json({
      success: true,
      message: "Checked out successfully",
      checkOutTime: now,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ EMPLOYEE: Get today's attendance status
export const getMyTodayStatus = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const date = getTodayIST();

    const record = await Attendance.findOne({ employeeId, date });

    res.json({
      success: true,
      date,
      status: record?.status || "Not Marked",
      checkInTime: record?.checkInTime || null,
      checkOutTime: record?.checkOutTime || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ EMPLOYEE: Get my attendance history
export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.json({ success: true, attendance: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADMIN: Mark Attendance manually
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status)
      return res.status(400).json({ success: false, message: "Missing fields" });

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

// ✅ ADMIN: Get Attendance for a date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const records = await Attendance.find({ date }).populate("employeeId", "name email");

    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};