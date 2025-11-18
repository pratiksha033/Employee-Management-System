import { Department} from "../models/DepartmentSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// --- Create Department ---
export const addDepartment = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) return next(new ErrorHandler("Department name is required", 400));

  const existingDepartment = await Department.findOne({ name: name.trim() });

  if (existingDepartment)
    return next(new ErrorHandler("Department already exists", 400));

  const department = await Department.create({
    name: name.trim(),
    description: description?.trim() || "",
  });

  res.status(201).json({
    success: true,
    message: "Department added successfully",
    department,
  });
});

// --- Get All Departments ---
export const getAllDepartments = catchAsyncError(async (req, res) => {
  const departments = await Department.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    departments,
  });
});

// --- Update Department ---
export const updateDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const department = await Department.findById(id);
  if (!department) return next(new ErrorHandler("Department not found", 404));

  if (name && name.trim() !== department.name) {
    const exists = await Department.findOne({ name: name.trim() });
    if (exists) return next(new ErrorHandler("Department name already in use", 400));
    department.name = name.trim();
  }

  if (description !== undefined) {
    department.description = description.trim();
  }

  await department.save();

  res.status(200).json({
    success: true,
    message: "Department updated",
    department,
  });
});

// --- Delete Department ---
export const deleteDepartment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const department = await Department.findById(id);
  if (!department) return next(new ErrorHandler("Department not found", 404));

  await department.deleteOne();

  res.status(200).json({
    success: true,
    message: "Department deleted",
  });
});