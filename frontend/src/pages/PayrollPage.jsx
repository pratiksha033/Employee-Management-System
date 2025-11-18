import React from "react";

const payrollData = [
  { period: "December Period", status: "85% Completed", payDate: "-", payout: "-", statusColor: "green" },
  { period: "November 2025", status: "85% Completed", payDate: "-", payout: "-", statusColor: "green" },
  { period: "Nov 20, 2025", status: "15% Completed", payDate: "-", payout: "-", statusColor: "yellow" },
  { period: "October 2025", status: "40% Completed", payDate: "-", payout: "-", statusColor: "yellow" },
  { period: "October 2025", status: "10% Completed", payDate: "-", payout: "-", statusColor: "red" },
  { period: "December 2025", status: "10% Completed", payDate: "-", payout: "-", statusColor: "red" },
];

export default function PayrollManagement() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Payroll Management</h1>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow">
          Run New Payroll
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="pb-3">Payroll Period</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Pay Date</th>
              <th className="pb-3">Total Net Payout</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3">{row.period}</td>
                <td className="py-3 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      row.statusColor === "green"
                        ? "bg-green-500"
                        : row.statusColor === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-gray-700">{row.status}</span>
                </td>
                <td className="py-3">{row.payDate}</td>
                <td className="py-3">{row.payout}</td>
                <td className="py-3 text-right">
                  <button className="text-emerald-600 hover:underline">View Summary</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
