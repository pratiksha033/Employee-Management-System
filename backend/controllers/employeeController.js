import { Employee } from "../models/employeeSchema.js";
import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";

// ➕ Add Employee (Admin Only)
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, department, position, salary } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if employee/user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create login user account
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
    });

    // 2️⃣ Create employee profile
    const employee = await Employee.create({
      name,
      email,
      department,
      position,
      salary,
      user: user._id, // link employee to user account
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully and can now log in",
      employee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("user", "name email role");
    res.status(200).json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get Employee By ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("user", "name email role");
    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    // Optional: if email or name changed, sync with User model too
    await User.findByIdAndUpdate(employee.user, {
      name: employee.name,
      email: employee.email,
    });

    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee)
      return res.status(404).json({ success: false, message: "Employee not found" });

    // Delete linked user account too
    await User.findByIdAndDelete(employee.user);

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee and associated user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
