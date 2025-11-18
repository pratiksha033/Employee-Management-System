import React from "react";

const payslipData = [
  { period: "November 2025", payDate: "Nov 30, 2025", payout: "$5,200.00", status: "Paid", statusColor: "green" },
  { period: "November 2025", payDate: "-", payout: "$5,200.00", status: "85% Completed", statusColor: "yellow" },
  { period: "October 2025", payDate: "-", payout: "$5,200.00", status: "Paid", statusColor: "green" },
  { period: "December 2025", payDate: "-", payout: "$5,200.00", status: "80% Completed", statusColor: "green" },
  { period: "September 2025", payDate: "-", payout: "$5,200.00", status: "50% Completed", statusColor: "yellow" },
];

export default function MyPayslips() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Payslips</h1>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow">
          Download PDF
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
            {payslipData.map((row, idx) => (
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
                <td className="py-3 font-medium">{row.payout}</td>
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
