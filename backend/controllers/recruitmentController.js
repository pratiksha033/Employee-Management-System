import { Applicant } from "../models/Applicant.js";

export const getApplicants = async (req, res) => {
  const applicants = await Applicant.find();
  res.json({ applicants });
};

export const updateStage = async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  await Applicant.findByIdAndUpdate(id, { stage });
  res.json({ message: "Stage updated" });
};

export const deleteApplicant = async (req, res) => {
  const { id } = req.params;
  await Applicant.findByIdAndDelete(id);
  res.json({ message: "Applicant deleted" });
};
