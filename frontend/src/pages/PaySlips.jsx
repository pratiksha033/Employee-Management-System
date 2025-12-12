// src/pages/MyPayslips.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyPayslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMy = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/payroll/my", { withCredentials: true });
      setPayslips(res.data.payrolls || []);
    } catch (err) {
      console.error("Failed to fetch payslips", err);
    } finally {
      setLoading(false);
    }
  };

  const download = async (id, name) => {
    try {
      const r = await axios.get(`http://localhost:4000/api/payroll/payslip/${id}`, {
        responseType: "blob",
        withCredentials: true
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || `payslip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Download failed");
    }
  };

  useEffect(() => { fetchMy(); }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Payslips</h1>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="pb-3">Payroll Period</th>
              <th className="pb-3">Total Net Payout</th>
              <th className="pb-3">Generated</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, idx) => (
              <tr key={p._id || idx} className="border-b hover:bg-gray-50">
                <td className="py-3">{p.month}</td>
                <td className="py-3 font-medium">₹{Number(p.netPay || 0).toLocaleString()}</td>
                <td className="py-3">{new Date(p.generatedAt).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <button className="text-emerald-600 hover:underline mr-4" onClick={() => download(p._id, `payslip-${p.month}.pdf`)}>Download</button>
                </td>
              </tr>
            ))}
            {payslips.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">No payslips yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}