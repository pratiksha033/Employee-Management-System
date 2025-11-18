import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  skills: [String],
  location: String,
  experience: String,
  description: String,

  // RECRUITMENT PIPELINE COUNTERS
  applications: { type: Number, default: 0 },
  shortlisted: { type: Number, default: 0 },
  interviewScheduled: { type: Number, default: 0 },
  hired: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export const Job = mongoose.model("Job", jobSchema);
