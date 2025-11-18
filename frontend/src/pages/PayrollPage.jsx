import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

// Auth config helper
const getAuthConfig = () => {
  const token = localStorage.getItem("token") || "";
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    withCredentials: true,
  };
};

const PayrollPage = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [payrolls, setPayrolls] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    baseSalary: "",
    bonus: "",
    overtimePay: "",
    tax: "",
    leaveDeductions: "",
  });

  // Fetch payrolls
  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/payroll/all`, getAuthConfig());
      setPayrolls(res.data.payrolls || []);
    } catch (err) {
      console.error("Error fetching payrolls:", err.response?.data || err);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/department`, getAuthConfig());
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err);
    }
  };

  // Fetch employees for selected department
  const fetchEmployeesByDepartment = async (deptId) => {
    if (!deptId) return setEmployees([]);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/department/${deptId}/employees` , // <- adjusted route
        getAuthConfig()
      );
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees by department:", err.response?.data || err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPayrolls();
  }, []);
  // 1️⃣ Add employees fetching function
const fetchEmployees = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/employee/all`, getAuthConfig());
    setEmployees(res.data.employees || []);
  } catch (err) {
    console.error("Error fetching employees:", err.response?.data || err);
    setEmployees([]);
  }
};

// 2️⃣ Call it in useEffect along with departments
useEffect(() => {
  fetchDepartments();
  fetchEmployees(); // ✅ fetch all employees
  fetchPayrolls();
}, []);

// 3️⃣ Filter employees when a department is selected
const filteredEmployees = selectedDepartment
  ? employees.filter((emp) => emp.department?._id === selectedDepartment)
  : [];


  // Handle department change
  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    setForm({ ...form, employeeId: "" });
    fetchEmployeesByDepartment(deptId);
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit payroll
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/payroll/generate`, form, getAuthConfig());
      alert("Payroll generated successfully!");
      setForm({
        employeeId: "",
        month: "",
        baseSalary: "",
        bonus: "",
        overtimePay: "",
        tax: "",
        leaveDeductions: "",
      });
      setSelectedDepartment("");
      setEmployees([]);
      fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate payroll");
      console.error(err);
    }
  };

  // Download Payslip
  const downloadPayslip = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/payroll/payslip/${id}`, {
        ...getAuthConfig(),
        responseType: "blob",
      });
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `payslip-${id}.pdf`;
      link.click();
    } catch (err) {
      console.error("Error downloading payslip:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] p-6 text-white">
      <div className="max-w-4xl mx-auto bg-[#161b22] p-6 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-teal-400 mb-6">Generate Payroll</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block mb-2 font-medium">Select Department</label>
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div>
            <label className="block mb-2 font-medium">Select Employee</label>
            <select
  name="employeeId"
  value={form.employeeId}
  onChange={handleChange}
  disabled={!selectedDepartment}
  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">-- Select Employee --</option>
  {filteredEmployees.map((emp) => (
    <option key={emp._id} value={emp._id}>
      {emp.name} ({emp.email})
    </option>
  ))}
</select>

          </div>

          {/* Month */}
          <div>
            <label className="block mb-2 font-medium">Month</label>
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
              required
            />
          </div>

          {/* Base Salary */}
          <div>
            <label className="block mb-2 font-medium">Base Salary</label>
            <input
              type="number"
              name="baseSalary"
              value={form.baseSalary}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
              required
            />
          </div>

          {/* Bonus */}
          <div>
            <label className="block mb-2 font-medium">Bonus</label>
            <input
              type="number"
              name="bonus"
              value={form.bonus}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>

          {/* Overtime Pay */}
          <div>
            <label className="block mb-2 font-medium">Overtime Pay</label>
            <input
              type="number"
              name="overtimePay"
              value={form.overtimePay}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>

          {/* Tax */}
          <div>
            <label className="block mb-2 font-medium">Tax</label>
            <input
              type="number"
              name="tax"
              value={form.tax}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>

          {/* Leave Deductions */}
          <div>
            <label className="block mb-2 font-medium">Leave Deductions</label>
            <input
              type="number"
              name="leaveDeductions"
              value={form.leaveDeductions}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 p-3 rounded-lg font-bold shadow-md"
            >
              Generate Payroll
            </button>
          </div>
        </form>
      </div>

      {/* Payroll Table */}
      <div className="max-w-5xl mx-auto mt-10 bg-[#161b22] p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">All Payrolls</h2>
        {payrolls.length === 0 ? (
          <p>No payrolls generated yet</p>
        ) : (
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800 text-gray-200">
                <th className="p-3 border border-gray-600">Employee</th>
                <th className="p-3 border border-gray-600">Month</th>
                <th className="p-3 border border-gray-600">Net Pay</th>
                <th className="p-3 border border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id} className="border border-gray-600">
                  <td className="p-2 border">{p.employeeName}</td>
                  <td className="p-2 border">{p.month}</td>
                  <td className="p-2 border">₹{p.netPay}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => downloadPayslip(p._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                    >
                      Download Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
