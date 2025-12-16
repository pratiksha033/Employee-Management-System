import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const getAuthConfig = () => {
  const token = localStorage.getItem("authToken") || "";
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    withCredentials: true,
  };
};

const PayrollPage = ({ user }) => {
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

  // ✅ Fetch payrolls ONLY after user is available
  const fetchPayrolls = async () => {
    if (!user?.role) return;

    try {
      const url =
        user.role === "admin"
          ? `${API_BASE_URL}/payroll/all`
          : `${API_BASE_URL}/payroll/my`;

      const res = await axios.get(url, getAuthConfig());
      setPayrolls(res.data.payrolls || []);
    } catch (err) {
      console.error("Error fetching payrolls:", err.response?.data || err);
      setPayrolls([]);
    }
  };

  const fetchDepartments = async () => {
    if (user?.role !== "admin") return;
    try {
      const res = await axios.get(`${API_BASE_URL}/department`, getAuthConfig());
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    if (user?.role !== "admin") return;
    try {
      const res = await axios.get(`${API_BASE_URL}/employee/all`, getAuthConfig());
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  };

  // ✅ VERY IMPORTANT FIX
  useEffect(() => {
    if (!user) return;
    fetchPayrolls();
    fetchDepartments();
    fetchEmployees();
  }, [user]);

  const filteredEmployees =
    selectedDepartment && user?.role === "admin"
      ? employees.filter((emp) => emp.department?._id === selectedDepartment)
      : [];

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setForm({ ...form, employeeId: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/payroll/generate`,
        form,
        getAuthConfig()
      );
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
      fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate payroll");
    }
  };

  const downloadPayslip = async (id) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/payslip/${id}`,
        {
          ...getAuthConfig(),
          responseType: "blob",
        }
      );
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `payslip-${id}.pdf`;
      link.click();
    } catch (err) {
      console.error("Payslip error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] p-6 text-white">

      {/* ================= ADMIN PAYROLL GENERATE ================= */}
      {user?.role === "admin" && (
        <div className="max-w-4xl mx-auto bg-[#161b22] p-6 rounded-xl mb-10">
          <h2 className="text-3xl font-bold text-teal-400 mb-6">
            Generate Payroll
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              required
              className="p-3 bg-gray-700 rounded"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              disabled={!selectedDepartment}
              required
              className="p-3 bg-gray-700 rounded"
            >
              <option value="">Select Employee</option>
              {filteredEmployees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>

            <input type="month" name="month" required onChange={handleChange} />
            <input type="number" name="baseSalary" required onChange={handleChange} />
            <input type="number" name="bonus" onChange={handleChange} />
            <input type="number" name="overtimePay" onChange={handleChange} />
            <input type="number" name="tax" onChange={handleChange} />
            <input type="number" name="leaveDeductions" onChange={handleChange} />

            <button className="col-span-2 bg-teal-600 p-3 rounded">
              Generate Payroll
            </button>
          </form>
        </div>
      )}

      {/* ================= PAYROLL LIST ================= */}
      <div className="max-w-5xl mx-auto bg-[#161b22] p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">
          {user?.role === "admin" ? "All Payrolls" : "My Payrolls"}
        </h2>

        {payrolls.length === 0 ? (
          <p className="text-gray-400">No payrolls found</p>
        ) : (
          <table className="w-full border border-gray-600">
            <thead>
              <tr>
                {user?.role === "admin" && <th>Employee</th>}
                <th>Month</th>
                <th>Net Pay</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id}>
                  {user?.role === "admin" && (
                    <td>{p.employee?.name || p.employeeName}</td>
                  )}
                  <td>{p.month}</td>
                  <td>₹{p.netPay}</td>
                  <td>
                    <button
                      onClick={() => downloadPayslip(p._id)}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Download
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
