// controllers/payrollPayslip.js
import PDFDocument from "pdfkit";
import { Payroll } from "../models/payrollSchema.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Employee } from "../models/employeeSchema.js";

export const downloadPayslip = catchAsyncError(async (req, res, next) => {
	const payroll = await Payroll.findById(req.params.id).populate("employee"); // Employee object

	if (!payroll) {
		return next(new ErrorHandler("Payslip not found", 404));
	}

	const empData = payroll.employee;

	if (!empData) {
		return next(new ErrorHandler("Employee data not found", 404));
	}

	// Authorization: employee can only download their own payslip
	if (req.user.role === "employee" && empData.user.toString() !== req.user._id.toString()) {
		return next(new ErrorHandler("Access denied", 403));
	}

	// ------------ PDF GENERATION ------------
	const doc = new PDFDocument({ size: "A4", margin: 40 });

	res.setHeader("Content-Type", "application/pdf");
	res.setHeader("Content-Disposition", `attachment; filename=payslip-${payroll._id}.pdf`);

	doc.pipe(res);

	// Helper values
	const employeeName = empData.name || "N/A";
	const employeeEmail = empData.email || "N/A";
	const month = payroll.month || "N/A";
	const generatedAt = payroll.generatedAt ? new Date(payroll.generatedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";

	const baseSalary = Number(payroll.baseSalary || 0);
	const bonus = Number(payroll.bonus || 0);
	const overtimePay = Number(payroll.overtimePay || 0);
	const tax = Number(payroll.tax || 0);
	const leaveDeductions = Number(payroll.leaveDeductions || 0);

	const grossEarnings = baseSalary + bonus + overtimePay;
	const grossDeductions = tax + leaveDeductions;
	const netPay = grossEarnings - grossDeductions;

	const fAmt = (amt) => "Rs. " + Number(amt).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	// ---------- HEADER ----------
	doc.rect(0, 0, doc.page.width, 100).fill("#1A202C");

	doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(24).text("COMPANY NAME PVT LTD", 40, 30);
	doc.fillColor("#A0AEC0").font("Helvetica").fontSize(10).text("Tech Park, Sector 4, City, State 100000", 40, 58);
	doc.fillColor("#A0AEC0").text("contact@company.com  |  +91 98765 43210", 40, 72);

	doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(26).text("PAYSLIP", doc.page.width - 200, 35, { align: "right", width: 160 });

	// Reset fill for body
	doc.fillColor("#333333");
	doc.moveDown(4);

	let currentY = 130;

	// ---------- EMPLOYEE DETAILS BOX ----------
	doc.roundedRect(40, currentY, doc.page.width - 80, 85, 5).lineWidth(1).strokeColor("#E2E8F0").stroke();

	doc.font("Helvetica-Bold").fontSize(10).fillColor("#718096").text("EMPLOYEE SUMMARY", 55, currentY + 12);
	doc.moveTo(40, currentY + 30).lineTo(doc.page.width - 40, currentY + 30).strokeColor("#E2E8F0").stroke();

	doc.fillColor("#2D3748");

	// Row 1
	doc.font("Helvetica-Bold").fontSize(10).text("Employee Name:", 55, currentY + 45);
	doc.font("Helvetica").text(employeeName, 150, currentY + 45);

	doc.font("Helvetica-Bold").text("Payslip For:", 350, currentY + 45);
	doc.font("Helvetica").text(month, 430, currentY + 45);

	// Row 2
	doc.font("Helvetica-Bold").text("Employee ID:", 55, currentY + 65);
	doc.font("Helvetica").text(empData._id.toString().substring(0, 8).toUpperCase(), 150, currentY + 65);

	doc.font("Helvetica-Bold").text("Generated Date:", 350, currentY + 65);
	doc.font("Helvetica").text(generatedAt, 430, currentY + 65);

	currentY += 115;

	// ---------- SALARY DETAILS TABLE ----------
	const tableLeft = 40;
	const tableWidth = doc.page.width - 80;
	const colSplit = doc.page.width / 2;

	// Headers
	doc.rect(tableLeft, currentY, tableWidth, 25).fill("#EDF2F7");
	doc.fillColor("#4A5568").font("Helvetica-Bold").fontSize(10);
	doc.text("EARNINGS", tableLeft + 15, currentY + 7);
	doc.text("AMOUNT", colSplit - 75, currentY + 7, { align: "right", width: 60 });
	doc.text("DEDUCTIONS", colSplit + 15, currentY + 7);
	doc.text("AMOUNT", tableLeft + tableWidth - 75, currentY + 7, { align: "right", width: 60 });

	// Vertical Divider for header
	doc.moveTo(colSplit, currentY).lineTo(colSplit, currentY + 25).strokeColor("#CBD5E0").stroke();

	currentY += 25;

	const itemsY = currentY;
	doc.fillColor("#2D3748").font("Helvetica").fontSize(10);

	// Earning Row 1
	doc.text("Basic Salary", tableLeft + 15, currentY + 12);
	doc.text(fAmt(baseSalary), colSplit - 105, currentY + 12, { align: "right", width: 90 });
	// Deduction Row 1
	doc.text("Income Tax (TDS)", colSplit + 15, currentY + 12);
	doc.text(fAmt(tax), tableLeft + tableWidth - 105, currentY + 12, { align: "right", width: 90 });
	currentY += 25;

	// Earning Row 2
	doc.text("Performance Bonus", tableLeft + 15, currentY + 12);
	doc.text(fAmt(bonus), colSplit - 105, currentY + 12, { align: "right", width: 90 });
	// Deduction Row 2
	doc.text("Leave Deductions", colSplit + 15, currentY + 12);
	doc.text(fAmt(leaveDeductions), tableLeft + tableWidth - 105, currentY + 12, { align: "right", width: 90 });
	currentY += 25;

	// Earning Row 3
	doc.text("Overtime Allowance", tableLeft + 15, currentY + 12);
	doc.text(fAmt(overtimePay), colSplit - 105, currentY + 12, { align: "right", width: 90 });
	currentY += 25;

	// Draw outline for items
	doc.rect(tableLeft, itemsY, tableWidth, currentY - itemsY).lineWidth(1).strokeColor("#E2E8F0").stroke();
	// Vertical Divider for items
	doc.moveTo(colSplit, itemsY).lineTo(colSplit, currentY).strokeColor("#E2E8F0").stroke();

	// ---------- GROSS TOTALS ----------
	doc.rect(tableLeft, currentY, tableWidth, 30).fill("#F7FAFC");
	doc.moveTo(tableLeft, currentY).lineTo(tableLeft + tableWidth, currentY).strokeColor("#E2E8F0").stroke(); // top line
	doc.moveTo(tableLeft, currentY + 30).lineTo(tableLeft + tableWidth, currentY + 30).strokeColor("#CBD5E0").stroke(); // bottom heavier line
	doc.moveTo(colSplit, currentY).lineTo(colSplit, currentY + 30).strokeColor("#E2E8F0").stroke(); // middle line

	doc.fillColor("#2D3748").font("Helvetica-Bold").fontSize(10);
	doc.text("Gross Earnings:", tableLeft + 15, currentY + 10);
	doc.text(fAmt(grossEarnings), colSplit - 105, currentY + 10, { align: "right", width: 90 });

	doc.text("Gross Deductions:", colSplit + 15, currentY + 10);
	doc.text(fAmt(grossDeductions), tableLeft + tableWidth - 105, currentY + 10, { align: "right", width: 90 });

	currentY += 50;

	// ---------- NET PAY AMOUNT ----------
	// Nice solid box for net pay
	doc.roundedRect(doc.page.width - 280, currentY, 240, 60, 5).fill("#E6FFFA");
	doc.roundedRect(doc.page.width - 280, currentY, 240, 60, 5).lineWidth(1).strokeColor("#38B2AC").stroke();

	doc.fillColor("#234E52").font("Helvetica-Bold").fontSize(12).text("NET PAY", doc.page.width - 260, currentY + 15);
	doc.fillColor("#234E52").font("Helvetica-Bold").fontSize(20).text(fAmt(netPay), doc.page.width - 260, currentY + 32, { align: "right", width: 220 });

	currentY += 100;

	// ---------- FOOTER NOTICE ----------
	doc.fillColor("#A0AEC0").font("Helvetica-Oblique").fontSize(9)
		.text("This is a system-generated document. No signature is required. All amounts are displayed in Indian Rupees (INR).", 40, currentY, { align: "center", width: doc.page.width - 80 });

	doc.end();
});