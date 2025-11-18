import { Reward } from "../models/rewardModel.js";
import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Employee } from "../models/employeeSchema.js";

/**
 * ADMIN — Give Reward
 */
export const giveReward = catchAsyncError(async (req, res, next) => {
  const { employeeName, rewardType } = req.body;

  if (!employeeName)
    return next(new ErrorHandler("Employee name is required", 400));

  if (!rewardType)
    return next(new ErrorHandler("Reward type is required", 400));

  const reward = await Reward.create({
    employeeName,
    rewardType,
    givenBy: req.user._id,
  });

  res.status(201).json({ success: true, reward });
});

/**
 * ADMIN — Get all rewards
 */
export const getAllRewards = catchAsyncError(async (req, res, next) => {
  const rewards = await Reward.find()
    .populate("givenBy", "name email")
    .sort({ dateGiven: -1 });

  res.status(200).json({ success: true, rewards });
});

/**
 * EMPLOYEE — My rewards (match by name)
 */
export const getMyRewards = catchAsyncError(async (req, res, next) => {
  const rewards = await Reward.find({ employeeName: req.user.name })
    .populate("givenBy", "name email")
    .sort({ dateGiven: -1 });

  res.status(200).json({ success: true, rewards });
});

/**
 * Leaderboard (based on employeeName)
 */
export const getLeaderboard = catchAsyncError(async (req, res, next) => {
  const leaderboard = await Reward.aggregate([
    {
      $group: {
        _id: "$employeeName",
        employeeName: { $first: "$employeeName" },
        totalRewards: { $sum: 1 },
      },
    },
    { $sort: { totalRewards: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({ success: true, leaderboard });
});
