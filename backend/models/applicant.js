import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  resume: String,

  skills: [String],

  stage: {
    type: String,
    enum: ["new", "shortlisted", "interview", "hired"],
    default: "new",
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

export const Applicant =
  mongoose.models.Applicant ||
  mongoose.model("Applicant", applicantSchema);
