import React, { useEffect, useState } from "react";
import { PlusCircle, X, Edit } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const tokenHeader = () => {
  const t = localStorage.getItem("authToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [jobEditOpen, setJobEditOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    skills: "",
    location: "",
    experience: "",
    description: "",
  });

  const [jobEditForm, setJobEditForm] = useState({
    applications: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    hired: 0,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const jRes = await fetch(`${API}/recruitment/jobs`, { headers: tokenHeader() });
    const jData = await jRes.json();
    setJobs(jData.jobs || []);
  };

  const openJobEditor = (job) => {
    setSelectedJob(job);
    setJobEditForm({
      applications: job.applications,
      shortlisted: job.shortlisted,
      interviewScheduled: job.interviewScheduled,
      hired: job.hired,
    });
    setJobEditOpen(true);
  };

  const createJob = async () => {
    const res = await fetch(`${API}/recruitment/job`, {
      method: "POST",
      headers: { ...tokenHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        ...jobForm,
        skills: jobForm.skills.split(",").map((s) => s.trim()),
      }),
    });

    const data = await res.json();
    if (data.success) {
      setJobs([data.job, ...jobs]);
      setDrawerOpen(false);
      setJobForm({
        title: "",
        department: "",
        skills: "",
        location: "",
        experience: "",
        description: "",
      });
    }
  };

  const saveJobEdit = async () => {
    const res = await fetch(`${API}/recruitment/job/${selectedJob._id}`, {
      method: "PUT",
      headers: { ...tokenHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(jobEditForm),
    });

    const data = await res.json();
    if (data.success) {
      setJobs((prev) =>
        prev.map((j) => (j._id === selectedJob._id ? data.job : j))
      );
      setJobEditOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-gray-100">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Recruitment Dashboard</h1>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-teal-600 px-4 py-2 rounded-lg"
        >
          <PlusCircle size={16} /> Post Job
        </button>
      </header>

      {/* JOB CARDS — clean & compact */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => openJobEditor(job)}
            className="bg-[#071021] hover:bg-[#0f1628] transition border border-gray-700 p-4 rounded-lg cursor-pointer"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <Edit size={18} className="text-teal-400" />
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {job.department} • {job.location}
            </p>

            <div className="mt-3 text-xs space-y-1">
              <div>Applications: {job.applications}</div>
              <div>Shortlisted: {job.shortlisted}</div>
              <div>Interview: {job.interviewScheduled}</div>
              <div>Hired: {job.hired}</div>
            </div>
          </div>
        ))}
      </section>

      {/* JOB EDITOR DRAWER */}
      {jobEditOpen && (
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0b1120] border-l border-gray-700 p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Edit Job Stats</h2>
            <X className="cursor-pointer" onClick={() => setJobEditOpen(false)} />
          </div>

          {Object.keys(jobEditForm).map((key) => (
            <div className="mt-4" key={key}>
              <label className="text-sm text-gray-400 capitalize">{key}</label>
              <input
                type="number"
                value={jobEditForm[key]}
                onChange={(e) =>
                  setJobEditForm({ ...jobEditForm, [key]: Number(e.target.value) })
                }
                className="w-full p-3 rounded bg-[#0f1724] border border-gray-700"
              />
            </div>
          ))}

          <button
            onClick={saveJobEdit}
            className="w-full mt-5 bg-teal-600 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* JOB CREATION DRAWER */}
      {drawerOpen && (
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#071021] p-6 border-l border-gray-700">
          <div className="flex justify-between">
            <h2 className="text-xl">Create Job</h2>
            <X className="cursor-pointer" onClick={() => setDrawerOpen(false)} />
          </div>

          {["title", "department", "skills", "location", "experience"].map(
            (field) => (
              <div className="mt-3" key={field}>
                <label className="text-sm text-gray-400 capitalize">{field}</label>
                <input
                  value={jobForm[field]}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, [field]: e.target.value })
                  }
                  className="w-full p-3 rounded bg-[#0f1724] border border-gray-700"
                />
              </div>
            )
          )}

          <label className="text-sm text-gray-400 mt-3">Description</label>
          <textarea
            rows={4}
            value={jobForm.description}
            onChange={(e) =>
              setJobForm({ ...jobForm, description: e.target.value })
            }
            className="w-full p-3 rounded bg-[#0f1724] border border-gray-700"
          />

          <button
            onClick={createJob}
            className="w-full mt-5 bg-teal-600 py-2 rounded-lg"
          >
            Create Job
          </button>
        </div>
      )}
    </div>
  );
}
