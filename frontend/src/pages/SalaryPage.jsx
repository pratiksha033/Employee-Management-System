import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1";

const getAuthToken = () => localStorage.getItem("authToken");

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

// ------------------ ADMIN VIEW ------------------
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

  const fetchData = async () => {
    const token = getAuthToken();
    try {
      const deptRes = await fetch(`${API_BASE_URL}/department`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deptData = await deptRes.json();
      setDepartments(deptData.departments || []);

      const empRes = await fetch(`${API_BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const empData = await empRes.json();
      setEmployees(empData.employees || []);

      const salaryRes = await fetch(`${API_BASE_URL}/salary/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const salaryData = await salaryRes.json();
      setSalaries(salaryData.salaries || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setFilteredEmployees(
        employees.filter((emp) => emp.department?._id === selectedDepartment)
      );
    } else setFilteredEmployees([]);
    setSelectedEmployee("");
  }, [selectedDepartment, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();
    const token = getAuthToken();

    try {
      const res = await fetch(`${API_BASE_URL}/salary/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          departmentId: selectedDepartment,
          basicSalary: +formData.basicSalary,
          allowances: +formData.allowances || 0,
          deductions: +formData.deductions || 0,
          payDate: formData.payDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await fetchData();
      setSelectedDepartment("");
      setSelectedEmployee("");
      setFormData({ basicSalary: "", allowances: "", deductions: "", payDate: "" });

    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { name: "Employee", selector: (row) => row.employeeId?.name || "N/A" },
    { name: "Department", selector: (row) => row.departmentId?.name || "N/A" },
    { name: "Pay Date", selector: (row) => formatDate(row.payDate) },
    { name: "Basic", selector: (row) => formatCurrency(row.basicSalary) },
    { name: "Allowances", selector: (row) => formatCurrency(row.allowances) },
    { name: "Deductions", selector: (row) => formatCurrency(row.deductions) },
    {
      name: "Total Salary",
      selector: (row) => formatCurrency(row.totalSalary),
      style: { fontWeight: "bold" },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] p-6 text-white">
      <div className="max-w-3xl mx-auto bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-700 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-6 text-teal-400">Add Salary</h3>

        <form onSubmit={handleAddSalary} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
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

            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              placeholder="Basic Salary"
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleInputChange}
              placeholder="Allowances"
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
            />

            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleInputChange}
              placeholder="Deductions"
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
            />

            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleInputChange}
              className="bg-[#0d1117] border border-gray-700 p-3 rounded-lg"
              required
            />
          </div>

          <button className="w-full bg-teal-600 hover:bg-teal-700 p-3 rounded-lg text-white font-bold shadow-lg">
            Add Salary
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="max-w-4xl mx-auto mt-10 bg-[#161b22] p-6 rounded-xl border border-gray-700">
        <h3 className="text-2xl font-bold text-teal-400 mb-3">All Salaries</h3>
        <DataTable
          columns={columns}
          data={salaries}
          progressPending={isLoading}
          pagination
          highlightOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

// ---------------- EMPLOYEE VIEW ----------------
const EmployeeSalaryView = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const fetchMySalary = async () => {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/salary/my-salary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSalaries(data.salaries || []);
    };
    fetchMySalary();
  }, []);

  const columns = [
    { name: "Pay Date", selector: (row) => formatDate(row.payDate) },
    { name: "Basic", selector: (row) => formatCurrency(row.basicSalary) },
    { name: "Allowances", selector: (row) => formatCurrency(row.allowances) },
    { name: "Deductions", selector: (row) => formatCurrency(row.deductions) },
    {
      name: "Total",
      selector: (row) => formatCurrency(row.totalSalary),
      style: { fontWeight: "bold" },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] p-6 text-white">
      <div className="max-w-4xl mx-auto bg-[#161b22] p-6 rounded-xl border border-gray-700">
        <h2 className="text-3xl font-semibold text-teal-400 mb-4">My Salary History</h2>
        <DataTable columns={columns} data={salaries} pagination highlightOnHover />
      </div>
    </div>
  );
};

export default function SalaryPage({ user }) {
  if (!user) return <p>Loading...</p>;
  return user.role === "admin" ? <AdminSalaryView /> : <EmployeeSalaryView />;
}
