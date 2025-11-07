import { Leave } from "../models/leaveSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// 🟢 Employee applies for leave
export const applyLeave = catchAsyncError(async (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // ✅ Ensure user is fetched from token
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return next(new ErrorHandler("End date cannot be before start date", 400));
  }

  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // ✅ Proper creation with valid ObjectId reference
  const leave = await Leave.create({
    employeeId: user._id, // make sure this is ObjectId
    leaveType,
    department: user.department || "Unknown",
    startDate: start,
    endDate: end,
    totalDays,
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Leave applied successfully",
    leave,
  });
});

// 🟢 Employee views own leaves
export const getMyLeaves = catchAsyncError(async (req, res, next) => {
  const leaves = await Leave.find({ employeeId: req.user._id })
    .populate("employeeId", "name email empId department")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, leaves });
});

// 🟢 Admin views all leaves
export const getAllLeaves = catchAsyncError(async (req, res, next) => {
  const leaves = await Leave.find()
    .populate({
      path: "employeeId",
      select: "name email empId department role",
      
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, leaves });
});

// 🟢 Admin updates leave status
export const updateLeaveStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const leave = await Leave.findById(id);
  if (!leave) return next(new ErrorHandler("Leave not found", 404));

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return next(new ErrorHandler("Invalid status value", 400));
  }

  leave.status = status;
  await leave.save();

  res.status(200).json({
    success: true,
    message: `Leave status updated to ${status}`,
    leave,
  });
});
