import { Salary } from "../models/salaryModel.js";
import { User } from "../models/userSchema.js";
import { Department } from "../models/DepartmentSchema.js";
import { Employee } from "../models/employeeSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// =============================
//  Admin: Add a New Salary
// =============================
export const addSalary = catchAsyncError(async (req, res, next) => {
  const {
    employeeId,
    departmentId,
    basicSalary,
    allowances,
    deductions,
    payDate,
  } = req.body;

  if (!employeeId || !departmentId || !basicSalary || !payDate) {
    return next(
      new ErrorHandler(
        "Employee, Department, Basic Salary, and Pay Date are required.",
        400
      )
    );
  }

  // Verify employee and department exist
  const employee = await Employee.findById(employeeId);
  if (!employee) return next(new ErrorHandler("Employee not found.", 404));

  const department = await Department.findById(departmentId);
  if (!department) return next(new ErrorHandler("Department not found.", 404));

  // Create salary entry
  const salary = await Salary.create({
    employeeId,
    departmentId,
    basicSalary,
    allowances,
    deductions,
    payDate,
  });

  console.log("✅ Salary Saved:", salary);

  // Populate for frontend
  const populatedSalary = await Salary.findById(salary._id)
    .populate("employeeId", "name email")
    .populate("departmentId", "name");

  res.status(201).json({
    success: true,
    message: "Salary added successfully.",
    salary: populatedSalary,
  });
});

// =============================
//  Employee: Get My Salary Records
// =============================
export const getMySalary = catchAsyncError(async (req, res, next) => {
  const salaries = await Salary.find({ employeeId: req.user.id })
    .populate("employeeId", "name email")
    .populate("departmentId", "name")
    .sort({ payDate: -1 });

  res.status(200).json({
    success: true,
    salaries,
  });
});

// =============================
//  Admin: Get All Salaries
// =============================
export const getAllSalaries = catchAsyncError(async (req, res, next) => {
  const salaries = await Salary.find()
    .populate("employeeId", "name email")
    .populate("departmentId", "name")
    .sort({ payDate: -1 });

  res.status(200).json({
    success: true,
    salaries,
  });
});

// =============================
//  Admin: Get Salaries for a Specific Employee
// =============================
export const getEmployeeSalary = catchAsyncError(async (req, res, next) => {
  const { employeeId } = req.params;

  const salaries = await Salary.find({ employeeId })
    .populate("employeeId", "name email")
    .populate("departmentId", "name")
    .sort({ payDate: -1 });

  res.status(200).json({
    success: true,
    salaries,
  });
});
