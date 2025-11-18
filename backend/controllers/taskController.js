import { Task } from "../models/taskModel.js";

export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignee: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, tasks });
};

export const addTask = async (req, res) => {
  const { title, description, status } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    assignee: req.user._id,
  });

  res.status(201).json({ success: true, task });
};
