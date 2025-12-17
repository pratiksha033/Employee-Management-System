import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url'; // Necessary for __dirname equivalent in ES Modules
import bcrypt from 'bcrypt';
// --- Path Resolution Block ---
const __filename = fileURLToPath(import.meta.url);
// __dirname is the directory containing seed.js (i.e., /backend/init)
const __dirname = path.dirname(__filename); 

// ENV_PATH points to the parent directory where .env is located (i.e., /backend/.env)
const ENV_PATH = path.resolve(__dirname, '..', '.env'); 

// Load .env before anything else
if (process.env.NODE_ENV !== "production") {
  // Use the calculated path
  dotenv.config({ path: ENV_PATH }); 
}
// --- End Path Resolution Block ---


// Check if MONGO_URI loaded successfully (uncomment to verify)
// console.log("Database URI loaded:", !!process.env.MONGO_URI);


// --- Adjust Imports Based on Relative Path ---

// dbConnection is in /backend/db
import dbConnection from "../db/dbConnection.js"; 
import { data } from "./init.js";

// Import models
import { Department } from "../models/DepartmentSchema.js";
import { Employee } from "../models/employeeSchema.js";
import { User } from "../models/userSchema.js";
import { Attendance } from "../models/attendanceSchema.js";
import { Task } from "../models/taskModel.js";
import { Leave } from "../models/leaveSchema.js";
import { Reward } from "../models/rewardModel.js";


const seed = async () => {
  try {
    console.log("🌱 Connecting to database...");
    await dbConnection();

    // DELETE OLD DATA
    console.log("🧹 Clearing old records...");
    await Department.deleteMany();
    await Employee.deleteMany();
    await User.deleteMany();
    await Attendance.deleteMany();
    await Task.deleteMany();
    await Leave.deleteMany();
    await Reward.deleteMany();

    // INSERT DEPARTMENTS
    console.log("🏢 Adding departments...");
    const deptDocs = await Department.insertMany(data.departments);

    const deptMap = {};
    deptDocs.forEach((d) => (deptMap[d.name] = d._id));

    // INSERT USERS
    console.log("👤 Adding users...");
    for (const user of data.users) {
    if (user.password) {
        // Check if the user has a password defined in init.js
        // Use the same salt rounds (e.g., 10) as your main registration logic
        user.password = await bcrypt.hash(user.password, 10);
    }
}

const userDocs = await User.insertMany(data.users);

// 2. Define userMap to map email to User ID
const userMap = {};
userDocs.forEach((u) => (userMap[u.email] = u._id));
    // INSERT EMPLOYEES
    console.log("🧑‍💼 Adding employees...");
    const empDocs = [];
    for (let emp of data.employees) {
      const doc = await Employee.create({
        ...emp,
        department: deptMap[emp.departmentName],
      });
      empDocs.push(doc);
    }

    const empMap = {};
    empDocs.forEach((e) => (empMap[e.email] = e._id));

    // INSERT ATTENDANCE
    console.log("📅 Adding attendance...");
    await Attendance.insertMany(
      data.attendance.map((a) => ({
        ...a,
        employeeId: empMap[a.employeeEmail],
      }))
    );

    // INSERT TASKS
    console.log("📝 Adding tasks...");
    await Task.insertMany(
      data.tasks.map((t) => ({
        ...t,
        assignee: userMap[t.employeeEmail],
      }))
    );

    // INSERT LEAVES
    console.log("📤 Adding leaves...");
    await Leave.insertMany(
      data.leaves.map((l) => ({
        ...l,
        employeeId: empMap[l.employeeEmail],
      }))
    );

    // INSERT REWARDS
    console.log("🏅 Adding rewards...");
    await Reward.insertMany(
      data.rewards.map((r) => ({
        ...r,
        employeeId: empMap[r.employeeEmail],
      }))
    );

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
