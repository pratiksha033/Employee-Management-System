import { User } from "../models/userSchema.js";
import { Leave } from "../models/leaveSchema.js";
import { Department } from "../models/DepartmentSchema.js";
import { Reward } from "../models/rewardModel.js";

export const getDashboard = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });
    const approvedLeaves = await Leave.countDocuments({ status: "Approved" });
    const rejectedLeaves = await Leave.countDocuments({ status: "Rejected" });

    const rewards = await Reward.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalEmployees,
      totalDepartments,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      rewards,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
