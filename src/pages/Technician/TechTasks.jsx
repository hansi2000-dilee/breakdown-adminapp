import React, { useState, useEffect } from "react";
import { ref as dbRef, onValue, update, ref } from "firebase/database";
import { db } from "../../firebase";
import { Edit3 } from "lucide-react";
import "./TechDashboard.css";

export default function TechTasks({ items }) {
  const [reporterEmails, setReporterEmails] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedNote, setUpdatedNote] = useState("");

  // 🔹 Load reporter emails
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snap) => {
      const data = snap.val() || {};
      setReporterEmails(
        Object.keys(data).reduce((acc, uid) => {
          acc[uid] = data[uid].email;
          return acc;
        }, {})
      );
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Open modal with selected task
  function openEditModal(task) {
    setSelectedTask(task);
    setUpdatedStatus(task.status);
    setUpdatedNote(task.note || "");
  }

  // 🔹 Save updates to Firebase
  async function saveUpdates() {
    if (!selectedTask) return;
    await update(dbRef(db, `breakdowns/${selectedTask.id}`), {
      status: updatedStatus,
      note: updatedNote,
      noteUpdatedAt: Date.now(),
    });
    alert("Task updated successfully!");
    setSelectedTask(null);
  }

  if (!items || items.length === 0)
    return <div className="no-tasks">No tasks found</div>;

  return (
    <>
      <ul className="task-list">
        {items.map((it) => (
          <li key={it.id} className="task-card">
            <div className="task-header">
              <strong className="task-title">{it.title}</strong>
              <button
                className="edit-btn"
                title="Edit Task"
                onClick={() => openEditModal(it)}
              >
                <Edit3 size={18} />
              </button>
            </div>

            <p className="task-desc">{it.description}</p>
            <p className="task-status">
              <strong>Status:</strong>{" "}
              <span className={`status-badge status-${it.status}`}>
                {it.status}
              </span>
            </p>
            {it.reporterUid && (
              <p className="task-reporter">
                <strong>Reporter:</strong>{" "}
                {reporterEmails[it.reporterUid] || it.reporterUid}
              </p>
            )}
            {it.note && (
              <p className="task-note">
                <strong>Note:</strong> {it.note}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* 🔹 Edit Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>
            <p>
              <strong>Task:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedTask.description}
            </p>

            <label>Status</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
            >
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>

            <label>Technician Note</label>
            <textarea
              value={updatedNote}
              onChange={(e) => setUpdatedNote(e.target.value)}
              placeholder="Add or update technician note..."
            />

            <div className="modal-actions">
              <button className="btn btn-save" onClick={saveUpdates}>
                Save Changes
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
