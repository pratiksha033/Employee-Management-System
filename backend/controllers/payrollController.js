import { Payroll } from "../models/payrollSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// =============================
// Admin: Generate Payroll
// =============================
export const generatePayroll = catchAsyncError(async (req, res, next) => {
  const { employeeId, month, baseSalary, bonus, overtimePay, tax, leaveDeductions } =
    req.body;

  if (!employeeId || !month || !baseSalary) {
    return next(new ErrorHandler("Employee, Month, and Base Salary are required", 400));
  }

  const employee = await User.findById(employeeId);
  if (!employee) return next(new ErrorHandler("Employee not found", 404));

  const payroll = await Payroll.create({
    employee: employee._id,
    employeeName: employee.name,
    month,
    baseSalary,
    bonus,
    overtimePay,
    tax,
    leaveDeductions,
  });

  res.status(201).json({
    success: true,
    message: "Payroll generated successfully",
    payroll,
  });
});

// =============================
// Admin: Get All Payrolls
// =============================
export const getAllPayrolls = catchAsyncError(async (req, res, next) => {
  const payrolls = await Payroll.find().sort({ generatedAt: -1 });
  res.status(200).json({ success: true, payrolls });
});

// =============================
// Employee: Get My Payrolls
// =============================
export const getMyPayrolls = catchAsyncError(async (req, res, next) => {
  const payrolls = await Payroll.find({ employee: req.user.id }).sort({ generatedAt: -1 });
  res.status(200).json({ success: true, payrolls });
});

// =============================
// Admin: Get Employees by Department
// =============================
export const getEmployeesByDepartment = catchAsyncError(async (req, res, next) => {
  const { departmentId } = req.params;
  if (!departmentId) return next(new ErrorHandler("Department ID required", 400));

  const employees = await User.find({ department: departmentId, role: "employee" }).select(
    "_id name email"
  );

  res.status(200).json({ success: true, employees });
});
