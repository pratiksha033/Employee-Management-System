import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
