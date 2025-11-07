import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // <-- Hides password from default queries
  },
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  // --- NEW FIELDS for Employee Page ---
  dob: {
    type: Date,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department", // This links to your Department model
  },
  // --- END NEW FIELDS ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
