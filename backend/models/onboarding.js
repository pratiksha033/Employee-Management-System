import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
  name: String,
  department: String,
  joinDate: Date,
  progress: { type: Number, default: 0 },
});

export const Onboarding = mongoose.model("Onboarding", onboardingSchema);
