import { Leave } from "../models/leaveSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

export const applyLeave = catchAsyncError(async (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.departmentId) {
    return next(new ErrorHandler("User or department not found", 404));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return next(new ErrorHandler("End date cannot be before start date", 400));
  }

  const totalDays =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const leave = await Leave.create({
    employeeId: user._id,
    departmentId: user.departmentId,
    leaveType,
    startDate: start,
    endDate: end,
    totalDays,
    reason,
  });

  res.status(201).json({ success: true, leave });
});

export const getMyLeaves = catchAsyncError(async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.user._id })
    .populate("employeeId", "name empId")
    
    .sort({ createdAt: -1 });

  res.json({ success: true, leaves });
});

export const getAllLeaves = catchAsyncError(async (req, res) => {
  const leaves = await Leave.find()
    .populate("employeeId", "name empId role")
    
    .sort({ createdAt: -1 });

  res.json({ success: true, leaves });
});

export const updateLeaveStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);

  if (!leave) return next(new ErrorHandler("Leave not found", 404));
  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  leave.status = status;
  await leave.save();

  res.json({ success: true, leave });
});
