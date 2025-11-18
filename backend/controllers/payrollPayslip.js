// controllers/payrollPayslip.js
import PDFDocument from "pdfkit";
import { Payroll } from "../models/payrollSchema.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Employee } from "../models/employeeSchema.js";
export const downloadPayslip = catchAsyncError(async (req, res, next) => {
  const payroll = await Payroll.findById(req.params.id).populate(
    "employee",
    "name email"
  );

  if (!payroll) {
    return next(new ErrorHandler("Payslip not found", 404));
  }
  try {const empdata = Employee.findById(payroll.employee);}
  catch(err){
    return res.status(500).json({ message : e });
  }
  // Authorization: employees can only download their own payslips
  if (
    req.user.role === "employee" &&
    payroll.employee._id.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Access denied", 403));
  }

  // ------------ PDF GENERATION ------------
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payslip-${payroll._id}.pdf`
  );

  doc.pipe(res);

  // Helper values
  const employeeName = empData.name || "N/A";
  const employeeEmail = empData.email || "N/A";
  const month = payroll.month || "N/A";
  const generatedAt = payroll.generatedAt
    ? new Date(payroll.generatedAt).toLocaleString("en-IN")
    : "N/A";

  const baseSalary = Number(payroll.baseSalary || 0);
  const bonus = Number(payroll.bonus || 0);
  const overtimePay = Number(payroll.overtimePay || 0);
  const tax = Number(payroll.tax || 0);
  const leaveDeductions = Number(payroll.leaveDeductions || 0);
  const netPay = Number(payroll.netPay || 0);

  // ---------- HEADER ----------
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Company Name Pvt. Ltd.", { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Address Line 1, Address Line 2, City, State - Pincode", {
      align: "center",
    })
    .moveDown(0.5);

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("PAYSLIP", { align: "center" });

  doc.moveDown(1);

  // Draw a line under header
  const pageWidth = doc.page.width;
  const { left, right } = doc.page.margins;
  doc
    .moveTo(left, doc.y)
    .lineTo(pageWidth - right, doc.y)
    .stroke();

  doc.moveDown(0.8);

  // ---------- EMPLOYEE & PAYSLIP INFO TABLE ----------
  const tableTop = doc.y;
  const tableLeft = left;
  const tableWidth = pageWidth - left - right;
  const rowHeight = 20;
  const colSplit = tableLeft + tableWidth / 2; // two-column layout

  const drawRow = (labelLeft, valueLeft, labelRight, valueRight, y) => {
    const padding = 5;
    const labelWidth = 80;

    // Left label
    doc.font("Helvetica-Bold").fontSize(11).text(labelLeft, tableLeft + padding, y + padding, {
      width: labelWidth,
    });
    // Left value
    doc.font("Helvetica").fontSize(11).text(valueLeft, tableLeft + padding + labelWidth, y + padding, {
      width: colSplit - tableLeft - labelWidth - padding * 2,
    });

    // Right label
    if (labelRight) {
      doc.font("Helvetica-Bold").fontSize(11).text(labelRight, colSplit + padding, y + padding, {
        width: labelWidth,
      });
    }

    // Right value
    if (valueRight) {
      doc.font("Helvetica").fontSize(11).text(valueRight, colSplit + padding + labelWidth, y + padding, {
        width: tableLeft + tableWidth - (colSplit + labelWidth + padding * 2),
      });
    }

    // Horizontal line for row bottom
    doc
      .moveTo(tableLeft, y + rowHeight)
      .lineTo(tableLeft + tableWidth, y + rowHeight)
      .stroke();
  };

  // Outer border of info table
  const infoRows = 3;
  const infoTableHeight = rowHeight * infoRows;
  doc
    .rect(tableLeft, tableTop, tableWidth, infoTableHeight)
    .stroke();

  let currentY = tableTop;

  drawRow(
    "Employee",
    employeeName,
    "Email",
    employeeEmail,
    currentY
  );
  currentY += rowHeight;

  drawRow(
    "Month",
    month,
    "Generated At",
    generatedAt,
    currentY
  );
  currentY += rowHeight;

  drawRow(
    "Employee ID",
    empdata._id.toString() || "N/A",
    "Payslip ID",
    payroll._id.toString(),
    currentY
  );
  currentY += rowHeight;

  doc.moveDown(2);

  // ---------- EARNINGS & DEDUCTIONS TABLE ----------
  const sectionTitleY = currentY + 20;
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Earnings & Deductions", left, sectionTitleY);

  let earnDedTop = sectionTitleY + 20;
  const colWidth = tableWidth / 2;

  // Draw outer box for earnings (left) and deductions (right)
  const earningBoxHeight = rowHeight * 4;
  const deductionBoxHeight = rowHeight * 3;
  const boxHeight = Math.max(earningBoxHeight, deductionBoxHeight);

  // Earnings box
  doc
    .rect(tableLeft, earnDedTop, colWidth, boxHeight)
    .stroke();
  // Deductions box
  doc
    .rect(tableLeft + colWidth, earnDedTop, colWidth, boxHeight)
    .stroke();

  // Titles
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Earnings", tableLeft + 5, earnDedTop + 5);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Deductions", tableLeft + colWidth + 5, earnDedTop + 5);

  const drawAmountRow = (label, amount, x, y) => {
    doc.font("Helvetica").fontSize(11).text(label, x + 5, y + 5);
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`₹${Number(amount || 0).toLocaleString("en-IN")}`, x + colWidth - 5 - 100, y + 5, {
        width: 100,
        align: "right",
      });
    // row line
    doc
      .moveTo(x, y + rowHeight)
      .lineTo(x + colWidth, y + rowHeight)
      .stroke();
  };

  let earnRowY = earnDedTop + rowHeight; // first row after title row
  let dedRowY = earnDedTop + rowHeight;

  // Earnings
  drawAmountRow("Base Salary", baseSalary, tableLeft, earnRowY);
  earnRowY += rowHeight;
  drawAmountRow("Bonus", bonus, tableLeft, earnRowY);
  earnRowY += rowHeight;
  drawAmountRow("Overtime", overtimePay, tableLeft, earnRowY);

  // Deductions
  drawAmountRow("Tax", tax, tableLeft + colWidth, dedRowY);
  dedRowY += rowHeight;
  drawAmountRow("Leave Deductions", leaveDeductions, tableLeft + colWidth, dedRowY);

  // ---------- NET PAY BOX ----------
  const netPayTop = earnDedTop + boxHeight + 30;

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Net Pay", left, netPayTop);

  const netBoxTop = netPayTop + 10;
  const netBoxHeight = 40;

  doc
    .rect(tableLeft, netBoxTop, tableWidth, netBoxHeight)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Net Amount Payable", tableLeft + 10, netBoxTop + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(
      `₹${netPay.toLocaleString("en-IN")}`,
      tableLeft + tableWidth - 10 - 150,
      netBoxTop + 10,
      { width: 150, align: "right" }
    );

  // Optional: amount in words (simple version)
  // You can plug a proper "number to words" helper here
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      `This is a system-generated payslip and does not require a signature.`,
      left,
      netBoxTop + netBoxHeight + 20
    );

  doc.end();
});