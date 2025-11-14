import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PlusCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STAGES = [
  { key: "new", label: "New Applications" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview Scheduled" },
  { key: "offer", label: "Offer Extended" },
  { key: "hired", label: "Hired" },
];

export default function RecruitmentPage() {
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/recruitment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplicants(data.applicants || []);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  const updateStage = async (id, newStage) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/recruitment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: newStage }),
      });
      fetchApplicants();
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Group applicants by stage
  const columns = STAGES.reduce((acc, stage) => {
    acc[stage.key] = applicants.filter((a) => a.stage === stage.key);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    updateStage(draggableId, destination.droppableId);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recruitment Dashboard</h2>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
          <PlusCircle size={18} /> New Job Posting
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage) => (
            <Droppable key={stage.key} droppableId={stage.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-md font-semibold mb-3">{stage.label}</h3>
                  {columns[stage.key].map((a, index) => (
                    <Draggable key={a._id} draggableId={a._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 dark:bg-gray-700 p-3 mb-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          <p className="font-semibold">{a.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {a.skills?.join(", ")}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
