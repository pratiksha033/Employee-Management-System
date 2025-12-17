const data = {
  departments: [
    { name: "Engineering", description: "Handles technical development." },
    { name: "HR", description: "Manages employee relations." },
    { name: "Finance", description: "Handles accounts & payroll." },
  ],

  users: [
    {
      name: "Admin",
      email: "admin@ems.com",
      password: "Admin@123987",
      role: "admin",
    },
    {
      name: "Mrunali",
      email: "mrunali@gmail.com.com",
      password: "Mrunali17",
      role: "admin",
    },
    // Add the employees as users so they have IDs for the Task/Reward assignment
    {
      name: "Yash Patel",
      email: "yash@example.com",
      password: "Employee@123", // Example password
      role: "employee",
    },
    {
      name: "Priya Sharma",
      email: "priya@example.com",
      password: "Employee@123", // Example password
      role: "employee",
    },
  ],

  employees: [
    {
      name: "Yash Patel",
      email: "yash@example.com",
      position: "Software Engineer",
      baseSalary: 45000,
      departmentName: "Engineering",
    },
    {
      name: "Priya Sharma",
      email: "priya@example.com",
      position: "HR Manager",
      baseSalary: 40000,
      departmentName: "HR",
    },
  ],

  attendance: [
    {
      employeeEmail: "yash@example.com",
      status: "Present",
      date: new Date(),
    },
    {
      employeeEmail: "priya@example.com",
      status: "Absent",
      date: new Date(),
    },
  ],

  tasks: [
    {
      title: "Develop API for dashboard",
      description: "Implement all backend API endpoints for the main dashboard.",
      status: "In Progress",
      employeeEmail: "yash@example.com", // Used for mapping to assignee ID
    },
    {
      title: "Conduct new hire interview",
      description: "Interviewing 5 candidates for the new developer role.",
      status: "Done",
      employeeEmail: "priya@example.com",
    },
  ],

  leaves: [
    {
      employeeEmail: "yash@example.com",
      leaveType: "Sick Leave",
      status: "Approved",
      department: "Engineering", 
      startDate: "2025-11-10",
      endDate: "2025-11-11",
      totalDays: 2, 
      reason: "Feeling unwell, need two days rest.", 
    },
  ],

  rewards: [
    {
      employeeEmail: "yash@example.com", // Used for mapping to givenBy ID
      employeeName: "Yash Patel",
      rewardType: "Outstanding Performer",
    },
  ],
};

export { data };