import { User } from "../models/userSchema.js";
import { Department } from "../models/DepartmentSchema.js";
import { Leave } from "../models/leaveSchema.js";
import { Salary } from "../models/salaryModel.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

export const getDashboardStats = catchAsyncError(async (req, res, next) => {

  // 1️⃣ Basic counts
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const totalDepartments = await Department.countDocuments();

  // 2️⃣ Leave counts
  const pendingLeaves = await Leave.countDocuments({ status: "Pending" });
  const approvedLeaves = await Leave.countDocuments({ status: "Approved" });
  const rejectedLeaves = await Leave.countDocuments({ status: "Rejected" });

  // 3️⃣ Calculate total salary for this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const salaries = await Salary.find({
    payDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Clean + sum safely
  const totalSalaryThisMonth = salaries.reduce((acc, salary) => {
    const clean = (val) => {
      if (typeof val === "number") return val;
      if (!val) return 0;
      return Number(
        String(val)
          .replace(/[₹,\s]/g, "") // remove ₹ and commas
          .trim()
      ) || 0;
    };

    const basic = clean(salary.basicSalary);
    const allowance = clean(salary.allowance);
    const deduction = clean(salary.deduction);

    const total = basic + allowance - deduction;
    return acc + total;
  }, 0);

  // 4️⃣ Employee count per department
  const departmentCounts = await User.aggregate([
    { $match: { role: "employee", department: { $ne: null } } },
    { $group: { _id: "$department", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "departments",
        localField: "_id",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    { $unwind: "$departmentDetails" },
    { $project: { _id: 0, departmentName: "$departmentDetails.name", count: 1 } },
    { $sort: { departmentName: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalEmployees,
      totalDepartments,
      totalSalaryThisMonth,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      departmentCounts,
    },
  });
});
