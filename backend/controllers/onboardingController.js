import { Onboarding } from "../models/Onboarding.js";

export const getOnboard = async (req, res) => {
  const records = await Onboarding.find();
  res.json({ records });
};

export const markComplete = async (req, res) => {
  const { id } = req.params;
  await Onboarding.findByIdAndUpdate(id, { progress: 100 });
  res.json({ message: "Marked complete" });
};
