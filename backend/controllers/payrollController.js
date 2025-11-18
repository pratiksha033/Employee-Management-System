import { Payroll } from "../models/payrollSchema.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

// ADMIN: Create payroll for an employee
export const generatePayroll = catchAsyncError(async (req, res, next) => {
  const {
    employeeId,
    month,
    baseSalary,
    bonus,
    overtimePay,
    tax,
    leaveDeductions,
  } = req.body;

  if (!employeeId || !month || !baseSalary) {
    return next(new ErrorHandler("Missing required payroll fields", 400));
  }

  // Validate employee exists
  const employee = await User.findById(employeeId);
  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  const netPay =
    Number(baseSalary) +
    Number(bonus || 0) +
    Number(overtimePay || 0) -
    Number(tax || 0) -
    Number(leaveDeductions || 0);

  const payroll = await Payroll.create({
    employee: employee._id,
    employeeName: employee.name,
    month,
    baseSalary: Number(baseSalary),
    bonus: Number(bonus || 0),
    overtimePay: Number(overtimePay || 0),
    tax: Number(tax || 0),
    leaveDeductions: Number(leaveDeductions || 0),
    netPay,
    generatedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: "Payroll generated successfully",
    payroll,
  });
});

// ADMIN: Get all payrolls
export const getAllPayrolls = catchAsyncError(async (req, res) => {
  const payrolls = await Payroll.find()
    .populate("employee", "name email")
    .sort({ generatedAt: -1 });

  res.status(200).json({ success: true, payrolls });
});

// EMPLOYEE: Get their payrolls
export const getMyPayrolls = catchAsyncError(async (req, res) => {
  const payrolls = await Payroll.find({ employee: req.user._id }).sort({
    generatedAt: -1,
  });

  res.status(200).json({ success: true, payrolls });
});
