import React, { useEffect, useState } from "react";
import { PlusCircle, X, Edit } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const tokenHeader = () => {
  const t = localStorage.getItem("authToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export default function RecruitmentPage({ user, darkMode }) {
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
    <div className="p-6">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruitment Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage active job postings and applicants.</p>
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-teal-500/20"
        >
          <PlusCircle size={18} /> Post Job
        </button>
      </header>

      {/* JOB CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => openJobEditor(job)}
            className="group bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md p-6 rounded-2xl cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{job.title}</h2>
                <span className="inline-block mt-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-md">
                  {job.department}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-teal-500 bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors">
                <Edit size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {job.location}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center">
                 <span className="text-blue-500 dark:text-blue-400 font-bold text-lg">{job.applications}</span>
                 <span className="text-blue-600 dark:text-blue-300 text-xs uppercase tracking-wider font-semibold">Applied</span>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex flex-col items-center justify-center">
                 <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">{job.shortlisted}</span>
                 <span className="text-yellow-700 dark:text-yellow-300 text-xs uppercase tracking-wider font-semibold">Shortlist</span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30 flex flex-col items-center justify-center">
                 <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">{job.interviewScheduled}</span>
                 <span className="text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wider font-semibold">Interview</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30 flex flex-col items-center justify-center">
                 <span className="text-green-600 dark:text-green-400 font-bold text-lg">{job.hired}</span>
                 <span className="text-green-700 dark:text-green-300 text-xs uppercase tracking-wider font-semibold">Hired</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* JOB EDITOR DRAWER */}
      {jobEditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setJobEditOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl p-8 overflow-y-auto animate-slideIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Job Stats</h2>
              <button onClick={() => setJobEditOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {Object.keys(jobEditForm).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">{key}</label>
                  <input
                    type="number"
                    value={jobEditForm[key]}
                    onChange={(e) =>
                      setJobEditForm({ ...jobEditForm, [key]: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-medium"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={saveJobEdit}
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* JOB CREATION DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl p-8 overflow-y-auto animate-slideIn flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Job Listing</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto flex-1 pr-2 pb-6 custom-scrollbar">
              {["title", "department", "skills", "location", "experience"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">{field}</label>
                    <input
                      value={jobForm[field]}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, [field]: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-medium"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                )
              )}

              <div>
                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                 <textarea
                   rows={4}
                   value={jobForm.description}
                   onChange={(e) =>
                     setJobForm({ ...jobForm, description: e.target.value })
                   }
                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-medium resize-none"
                   placeholder="Job responsibilities..."
                 />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                <button
                  onClick={createJob}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
                >
                  Publish Job
                </button>
            </div>
          </div>
          
          <style>{`
             .animate-slideIn {
                 animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
             }
             @keyframes slideIn {
                 from { transform: translateX(100%); }
                 to { transform: translateX(0); }
             }
             .custom-scrollbar::-webkit-scrollbar {
                 width: 6px;
             }
             .custom-scrollbar::-webkit-scrollbar-track {
                 background: transparent;
             }
             .custom-scrollbar::-webkit-scrollbar-thumb {
                 background-color: rgba(156, 163, 175, 0.5);
                 border-radius: 20px;
             }
          `}</style>
        </div>
      )}
    </div>
  );
}