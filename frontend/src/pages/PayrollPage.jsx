import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000";

// FIXED ENDPOINTS
const PAYROLL_API = `${API}/api/v1/payroll`;
const USERS_API = `${API}/api/v1/users`;   // ✅ FIXED (correct employees API)

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    baseSalary: "",
    bonus: "",
    overtimePay: "",
    tax: "",
    leaveDeductions: "",
  });

  // Fetch all payrolls (ADMIN)
  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${PAYROLL_API}/all`, {
        withCredentials: true,
      });
      setPayrolls(res.data.payrolls || []);
    } catch (error) {
      console.log("Error fetching payrolls:", error.response?.data || error);
    }
  };

  // Fetch employees list (FIXED)
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(USERS_API, {
        withCredentials: true,
      });

      // FIXED → filter only employees
      const employeesOnly = res.data.users?.filter(
        (user) => user.role === "employee"
      );

      setEmployees(employeesOnly || []);
    } catch (error) {
      console.log("Error fetching employees:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Payroll
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${PAYROLL_API}/generate`, form, {
        withCredentials: true,
      });

      alert("Payroll generated successfully!");
      fetchPayrolls();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate payroll");
      console.log(error);
    }
  };

  // Download Payslip
  const downloadPayslip = async (id) => {
    try {
      const res = await axios.get(`${PAYROLL_API}/payslip/${id}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `payslip-${id}.pdf`;
      link.click();
    } catch (error) {
      console.log("Error downloading payslip:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* Payroll Form */}
      <div className="p-4 border rounded shadow">
        <h2 className="font-bold text-xl mb-3">Generate Payroll</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* Employee Select */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Select Employee</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Employee --</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}

            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block mb-1 font-medium">Month</label>
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Base Salary */}
          <div>
            <label className="block mb-1 font-medium">Base Salary</label>
            <input
              type="number"
              name="baseSalary"
              value={form.baseSalary}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Bonus */}
          <div>
            <label className="block mb-1 font-medium">Bonus</label>
            <input
              type="number"
              name="bonus"
              value={form.bonus}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Overtime */}
          <div>
            <label className="block mb-1 font-medium">Overtime Pay</label>
            <input
              type="number"
              name="overtimePay"
              value={form.overtimePay}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Tax */}
          <div>
            <label className="block mb-1 font-medium">Tax</label>
            <input
              type="number"
              name="tax"
              value={form.tax}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Leave Deductions */}
          <div>
            <label className="block mb-1 font-medium">Leave Deductions</label>
            <input
              type="number"
              name="leaveDeductions"
              value={form.leaveDeductions}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Generate Payroll
            </button>
          </div>
        </form>
      </div>

      {/* Payroll List */}
      <div className="p-4 border rounded shadow">
        <h2 className="font-bold text-xl mb-4">All Payrolls</h2>

        {payrolls.length === 0 ? (
          <p>No payrolls generated yet</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 border">
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Net Pay</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id} className="border">
                  <td className="p-2 border">{p.employeeName}</td>
                  <td className="p-2 border">{p.month}</td>
                  <td className="p-2 border">₹{p.netPay}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => downloadPayslip(p._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
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
