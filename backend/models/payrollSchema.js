// models/payrollSchema.js
import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  baseSalary: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  overtimePay: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  leaveDeductions: { type: Number, default: 0 },
  netPay: { type: Number, default: 0 },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Payroll = mongoose.models.Payroll || mongoose.model("Payroll", payrollSchema);
