import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  totalSalary: {
    type: Number,
    default: 0,
  },
  payDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

salarySchema.pre("save", function (next) {
  this.totalSalary =
    (this.basicSalary || 0) +
    (this.allowances || 0) -
    (this.deductions || 0);
  next();
});

export const Salary =
  mongoose.models.Salary || mongoose.model("Salary", salarySchema);
