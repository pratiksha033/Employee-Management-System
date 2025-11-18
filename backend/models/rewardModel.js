import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  rewardType: { type: String, required: true },
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateGiven: { type: Date, default: Date.now },
});

export const Reward =
  mongoose.models.Reward || mongoose.model("Reward", rewardSchema);
