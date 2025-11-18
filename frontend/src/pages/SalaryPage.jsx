import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1";

// Helper function to get the auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ✅ Helper to format currency in INR
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- Admin View ---
const AdminSalaryView = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [formData, setFormData] = useState({
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = getAuthToken();

  // ✅ Define fetchData outside useEffect so it can be reused
  const fetchData = async () => {
    const token = getAuthToken();
    try {
      // ✅ Fetch Departments
      const deptResponse = await fetch(`${API_BASE_URL}/department`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deptData = await deptResponse.json();
      if (deptResponse.ok) setDepartments(deptData.departments || []);
      else console.error("Failed to fetch departments:", deptData.message);

      // ✅ Fetch Employees
      const empResponse = await fetch(`${API_BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const empData = await empResponse.json();
      if (empResponse.ok) setEmployees(empData.employees || []);
      else console.error("Failed to fetch employees:", empData.message);

      // ✅ Fetch All Salaries (for admin view)
      const salaryResponse = await fetch(`${API_BASE_URL}/salary/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const salaryData = await salaryResponse.json();
      console.log("✅ Salary data fetched:", salaryData);
      if (salaryResponse.ok) setSalaries(salaryData.salaries || []);
      else console.error("Failed to fetch salaries:", salaryData.message);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // ✅ Fetch data when page first loads
  useEffect(() => {
    fetchData();
  }, []);

  // Filter employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredEmployees(
        employees.filter((emp) => emp.department?._id === selectedDepartment)
      );
    } else {
      setFilteredEmployees([]);
    }
    setSelectedEmployee(""); // Reset employee selection
  }, [selectedDepartment, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();
    const { basicSalary, allowances, deductions, payDate } = formData;

    if (!selectedEmployee || !basicSalary || !payDate) {
      console.error("Employee, Basic Salary, and Pay Date are required.");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/salary/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          departmentId: selectedDepartment,
          basicSalary: parseFloat(basicSalary),
          allowances: parseFloat(allowances) || 0,
          deductions: parseFloat(deductions) || 0,
          payDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add salary");
      }

      console.log("✅ Salary added successfully!");

      // 👇 Immediately update salary list without reloading
      setSalaries((prev) => [...prev, data.salary]);
      await fetchData(); // Re-fetch data to update UI

      // Reset form
      setFormData({
        basicSalary: "",
        allowances: "",
        deductions: "",
        payDate: "",
      });
      setSelectedEmployee("");
      setSelectedDepartment("");
    } catch (error) {
      console.error("Add Salary Error:", error.message);
    }
  };

  // 👇 Columns for admin salary list
  const columns = [
    {
      name: "Employee",
      selector: (row) => row.employeeId?.name || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.departmentId?.name || "N/A",
      sortable: true,
    },
    {
      name: "Pay Date",
      selector: (row) => formatDate(row.payDate),
      sortable: true,
    },
    {
      name: "Basic Salary",
      selector: (row) => formatCurrency(row.basicSalary),
      sortable: true,
    },
    {
      name: "Allowances",
      selector: (row) => formatCurrency(row.allowances),
      sortable: true,
    },
    {
      name: "Deductions",
      selector: (row) => formatCurrency(row.deductions),
      sortable: true,
    },
    {
      name: "Total Salary",
      selector: (row) => formatCurrency(row.totalSalary),
      sortable: true,
      right: true,
    },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Salary</h3>
      <form onSubmit={handleAddSalary} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
              disabled={!selectedDepartment}
            >
              <option value="">Select Employee</option>
              {filteredEmployees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              placeholder="e.g., 50000"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowances
            </label>
            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deductions
            </label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleInputChange}
              placeholder="e.g., 2000"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Date
            </label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg"
        >
          Add Salary
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
        <h3 className="text-xl font-semibold p-4 border-b">All Salaries</h3>
        <DataTable
          columns={columns}
          data={salaries}
          progressPending={isLoading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

// --- Employee View ---
const EmployeeSalaryView = () => {
  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMySalary = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/salary/my-salary`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch salary records");
        }
        const data = await response.json();
        setSalaries(data.salaries || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMySalary();
  }, []);

  const columns = [
    {
      name: "Pay Date",
      selector: (row) => formatDate(row.payDate),
      sortable: true,
    },
    {
      name: "Basic Salary",
      selector: (row) => formatCurrency(row.basicSalary),
      sortable: true,
    },
    {
      name: "Allowances",
      selector: (row) => formatCurrency(row.allowances),
      sortable: true,
    },
    {
      name: "Deductions",
      selector: (row) => formatCurrency(row.deductions),
      sortable: true,
    },
    {
      name: "Total Salary",
      selector: (row) => formatCurrency(row.totalSalary),
      sortable: true,
      right: true,
      style: { fontWeight: "bold" },
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Salary History</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={salaries}
          progressPending={isLoading}
          pagination
          responsive
          highlightOnHover
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function SalaryPage({ user }) {
  if (!user) return <p>Loading...</p>;

  return user.role === "admin" ? <AdminSalaryView /> : <EmployeeSalaryView />;
}
