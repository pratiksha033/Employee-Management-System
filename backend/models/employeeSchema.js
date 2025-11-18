import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  position: { type: String, default: "" },

  salary: { type: Number, default: 0 },

  dob: { type: Date },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Prevent overwrite error
export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
