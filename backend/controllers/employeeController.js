import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import bcrypt from "bcrypt";

// --- Admin: Add a new Employee ---
export const addEmployee = catchAsyncError(async (req, res, next) => {
  const { name, email, password, dob, department } = req.body;

  if (!name || !email || !password || !dob || !department) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await User.create({
    name,
    email,
    password: hashedPassword,
    dob,
    department,
    role: "employee", // Hardcode role as 'employee'
  });

  res.status(201).json({
    success: true,
    message: "Employee added successfully.",
    employee,
  });
});

// --- Admin: Get All Employees ---
export const getAllEmployees = catchAsyncError(async (req, res, next) => {
  const employees = await User.find({ role: "employee" }).populate(
    "department",
    "name"
  ); // Populate department name

  res.status(200).json({
    success: true,
    employees,
  });
});

// --- Admin: Get Single Employee ---
export const getEmployeeById = catchAsyncError(async (req, res, next) => {
  const employee = await User.findById(req.params.id).populate(
    "department",
    "name"
  );

  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }
  if (employee.role !== "employee") {
    return next(new ErrorHandler("User is not an employee", 404));
  }

  res.status(200).json({
    success: true,
    employee,
  });
});

// --- Admin: Update Employee ---
export const updateEmployee = catchAsyncError(async (req, res, next) => {
  const { name, email, dob, department, password } = req.body;

  let employee = await User.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Check if email is being updated and if it already exists
  if (email && email !== employee.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already in use", 400));
    }
    employee.email = email;
  }

  if (name) employee.name = name;
  if (dob) employee.dob = dob;
  if (department) employee.department = department;

  // If a new password is provided, hash it
  if (password) {
    employee.password = await bcrypt.hash(password, 10);
  }
  
  await employee.save();

  // Re-populate department after saving
  employee = await User.findById(employee._id).populate("department", "name");

  res.status(200).json({
    success: true,
    message: "Employee updated successfully.",
    employee,
  });
});

// --- Admin: Delete Employee ---
export const deleteEmployee = catchAsyncError(async (req, res, next) => {
  const employee = await User.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  if (employee.role !== "employee") {
    return next(new ErrorHandler("This user cannot be deleted from here", 400));
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully.",
  });
});