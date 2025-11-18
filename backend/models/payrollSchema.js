import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Employee is stored in User model
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  overtimePay: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  leaveDeductions: {
    type: Number,
    default: 0,
  },
  netPay: {
    type: Number,
    default: 0,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

payrollSchema.pre("save", function (next) {
  this.netPay =
    (this.baseSalary || 0) +
    (this.bonus || 0) +
    (this.overtimePay || 0) -
    (this.tax || 0) -
    (this.leaveDeductions || 0);
  next();
});

export const Payroll =
  mongoose.models.Payroll || mongoose.model("Payroll", payrollSchema);
