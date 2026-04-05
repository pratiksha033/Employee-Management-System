import cron from "node-cron";
import { Attendance } from "./models/attendanceSchema.js";
import { User } from "./models/userSchema.js";

/**
 * 🕛 Runs every night at 11:59 PM IST
 * Auto-marks Absent for employees who didn't check in today
 */
export const startAttendanceCron = () => {
  // Cron: "59 18 * * *" = 11:59 PM IST (IST = UTC+5:30, so 18:29 UTC)
  // 23:59 IST = 18:29 UTC → "29 18 * * *"
  cron.schedule("29 18 * * *", async () => {
    try {
      const now = new Date();
      const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const today = ist.toISOString().split("T")[0]; // "YYYY-MM-DD"

      console.log(`🕛 [Cron] Auto-marking absent for date: ${today}`);

      // Get all employees (non-admin)
      const employees = await User.find({ role: "employee" });

      let absentCount = 0;

      for (const emp of employees) {
        const existing = await Attendance.findOne({
          employeeId: emp._id,
          date: today,
        });

        if (!existing) {
          // No record at all → Absent
          await Attendance.create({
            employeeId: emp._id,
            date: today,
            status: "Absent",
          });
          absentCount++;
        }
        // If record exists but no checkIn → also Absent
        else if (!existing.checkInTime) {
          existing.status = "Absent";
          await existing.save();
          absentCount++;
        }
      }

      console.log(`✅ [Cron] Auto-absent done. ${absentCount} employees marked Absent.`);
    } catch (err) {
      console.error("❌ [Cron] Auto-absent failed:", err.message);
    }
  });

  console.log("📅 Attendance cron job scheduled (runs at 11:59 PM IST daily)");
};
