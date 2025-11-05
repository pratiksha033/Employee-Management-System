import React from "react";
import { Users, Building2, DollarSign, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Overview */}
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Employees */}
        <div className="rounded-2xl bg-teal-600 text-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Total Employees</p>
            <h3 className="text-2xl font-bold">13</h3>
          </div>
          <Users size={36} />
        </div>

        {/* Total Departments */}
        <div className="rounded-2xl bg-yellow-600 text-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Total Departments</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
          <Building2 size={36} />
        </div>

        {/* Monthly Salary */}
        <div className="rounded-2xl bg-red-600 text-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Monthly Salary</p>
            <h3 className="text-2xl font-bold">$654</h3>
          </div>
          <DollarSign size={36} />
        </div>
      </div>

      {/* Leave Details */}
      <h2 className="text-xl font-semibold">Leave Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leave Applied */}
        <div className="rounded-2xl bg-gray-100 shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Leave Applied</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
          <FileText size={32} className="text-teal-600" />
        </div>

        {/* Leave Approved */}
        <div className="rounded-2xl bg-gray-100 shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Leave Approved</p>
            <h3 className="text-2xl font-bold">2</h3>
          </div>
          <CheckCircle size={32} className="text-green-600" />
        </div>

        {/* Leave Pending */}
        <div className="rounded-2xl bg-gray-100 shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Leave Pending</p>
            <h3 className="text-2xl font-bold">4</h3>
          </div>
          <Clock size={32} className="text-yellow-600" />
        </div>

        {/* Leave Rejected */}
        <div className="rounded-2xl bg-gray-100 shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Leave Rejected</p>
            <h3 className="text-2xl font-bold">1</h3>
          </div>
          <XCircle size={32} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}
