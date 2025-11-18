import { Applicant } from "../models/applicant.js";
import { Job } from "../models/Job.js";

// Helper function to update job counters


// GET all applicants + jobs
export const getRecruitment = async (req, res) => {
  const applicants = await Applicant.find();
  res.json({ success: true, applicants });
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json({ success: true, jobs });
};

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json({ success: true, job });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// UPDATE JOB FIELDS (pipeline counts)
export const updateJobStats = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, job });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// UPDATE APPLICANT STAGE
export const updateApplicantStage = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { stage: req.body.stage },
      { new: true }
    );

    res.json({ success: true, applicant });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
