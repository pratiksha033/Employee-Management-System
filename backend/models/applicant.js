import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  name: String,
  skills: [String],
  stage: {
    type: String,
    enum: ["new", "shortlisted", "interview", "offer", "hired"],
    default: "new",
  },
});

export const Applicant = mongoose.model("Applicant", applicantSchema);
