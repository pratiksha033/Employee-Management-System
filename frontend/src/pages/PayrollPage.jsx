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

  /* ================= FETCH DATA ================= */
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
      setPayrolls([]);
    }
  };

  const fetchDepartments = async () => {
    if (user?.role !== "admin") return;
    const res = await axios.get(`${API_BASE_URL}/department`, getAuthConfig());
    setDepartments(res.data.departments || []);
  };

  const fetchEmployees = async () => {
    if (user?.role !== "admin") return;
    const res = await axios.get(`${API_BASE_URL}/employee/all`, getAuthConfig());
    setEmployees(res.data.employees || []);
  };

  useEffect(() => {
    if (!user) return;
    fetchPayrolls();
    fetchDepartments();
    fetchEmployees();
  }, [user]);

  const filteredEmployees =
    selectedDepartment && user?.role === "admin"
      ? employees.filter((e) => e.department?._id === selectedDepartment)
      : [];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setForm({ ...form, employeeId: "" });
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
      alert("Failed to generate payroll");
    }
  };

  const downloadPayslip = async (id) => {
    const res = await axios.get(
      `${API_BASE_URL}/payroll/payslip/${id}`,
      { ...getAuthConfig(), responseType: "blob" }
    );
    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `payslip-${id}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#0f172a] to-[#020617] p-6 text-white">

      {/* ================= ADMIN PAYROLL ================= */}
      {user?.role === "admin" && (
        <div className="max-w-5xl mx-auto mb-10 bg-[#161b22]/80 backdrop-blur rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-extrabold text-teal-400 mb-8">
            Generate Payroll
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              required
              className="input-dark"
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
              className="input-dark"
            >
              <option value="">Select Employee</option>
              {filteredEmployees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>

            <input type="month" name="month" required onChange={handleChange} className="input-dark" />
            <input type="number" name="baseSalary" placeholder="Base Salary" required onChange={handleChange} className="input-dark" />
            <input type="number" name="bonus" placeholder="Bonus" onChange={handleChange} className="input-dark" />
            <input type="number" name="overtimePay" placeholder="Overtime Pay" onChange={handleChange} className="input-dark" />
            <input type="number" name="tax" placeholder="Tax" onChange={handleChange} className="input-dark" />
            <input type="number" name="leaveDeductions" placeholder="Leave Deductions" onChange={handleChange} className="input-dark" />

            <button className="col-span-2 bg-gradient-to-r from-teal-500 to-emerald-600 py-3 rounded-xl font-bold text-lg hover:scale-[1.02] transition">
              Generate Payroll
            </button>
          </form>
        </div>
      )}

      {/* ================= PAYROLL LIST ================= */}
      <div className="max-w-6xl mx-auto bg-[#161b22]/80 backdrop-blur rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-extrabold text-teal-400 mb-6">
          {user?.role === "admin" ? "All Payrolls" : "My Payrolls"}
        </h2>

        {payrolls.length === 0 ? (
          <p className="text-gray-400 text-center">No payrolls found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0f172a] text-teal-300">
                  {user?.role === "admin" && <th className="th">Employee</th>}
                  <th className="th">Month</th>
                  <th className="th">Net Pay</th>
                  <th className="th">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-700 hover:bg-[#0f172a]/60 transition"
                  >
                    {user?.role === "admin" && (
                      <td className="td">{p.employee?.name || p.employeeName}</td>
                    )}
                    <td className="td">{p.month}</td>
                    <td className="td font-bold text-green-400">₹{p.netPay}</td>
                    <td className="td">
                      <button
                        onClick={() => downloadPayslip(p._id)}
                        className="bg-green-600 px-4 py-1 rounded-lg hover:bg-green-700 transition"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Tailwind helpers ===== */}
      <style>{`
        .input-dark {
          background: #0f172a;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #334155;
          outline: none;
          transition: all 0.2s;
        }
        .input-dark:focus {
          border-color: #2dd4bf;
          box-shadow: 0 0 0 2px rgba(45,212,191,0.3);
        }
        .th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .td {
          padding: 12px;
        }
      `}</style>
    </div>
  );
};

export default PayrollPage;