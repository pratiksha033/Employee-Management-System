// controllers/payrollPayslip.js
import PDFDocument from "pdfkit";
import { Payroll } from "../models/payrollSchema.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

export const downloadPayslip = catchAsyncError(async (req, res, next) => {
  const payroll = await Payroll.findById(req.params.id).populate("employee", "name email");

  if (!payroll) {
    return next(new ErrorHandler("Payslip not found", 404));
  }

  // Authorization: employees can only download their own payslips
  if (req.user.role === "employee" && payroll.employee._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Access denied", 403));
  }

  // PDF generation
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=payslip-${payroll._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("Payslip", { underline: true, align: "center" });
  doc.moveDown(1.5);

  doc.fontSize(12).text(`Employee: ${payroll.employeeName || payroll.employee?.name || "N/A"}`);
  doc.text(`Email: ${payroll.employee?.email || "N/A"}`);
  doc.text(`Month: ${payroll.month}`);
  doc.text(`Generated At: ${payroll.generatedAt.toLocaleString()}`);
  doc.moveDown();

  doc.text(`Base Salary: ₹${Number(payroll.baseSalary || 0).toLocaleString()}`);
  doc.text(`Bonus: ₹${Number(payroll.bonus || 0).toLocaleString()}`);
  doc.text(`Overtime: ₹${Number(payroll.overtimePay || 0).toLocaleString()}`);
  doc.text(`Tax: ₹${Number(payroll.tax || 0).toLocaleString()}`);
  doc.text(`Leave Deductions: ₹${Number(payroll.leaveDeductions || 0).toLocaleString()}`);

  doc.moveDown();
  doc.fontSize(14).text(`Net Pay: ₹${Number(payroll.netPay || 0).toLocaleString()}`, { bold: true });

  doc.end();
});
