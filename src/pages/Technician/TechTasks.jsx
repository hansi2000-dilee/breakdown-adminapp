import React, { useState, useEffect } from "react";
import { update, ref as dbRef, onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import './TechDashboard.css';

export default function TechTasks({ items, completed }) {
  const [note, setNote] = useState("");
  const [reporterEmails, setReporterEmails] = useState({});

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

  async function start(id) {
    await update(dbRef(db, `breakdowns/${id}`), {
      status: "in_progress",
      updatedAt: Date.now(),
    });
  }

  async function complete(id) {
    await update(dbRef(db, `breakdowns/${id}`), {
      status: "completed",
      updatedAt: Date.now(),
    });
  }

  async function addNote(id) {
    if (!note) return;
    await update(dbRef(db, `breakdowns/${id}`), {
      note,
      noteUpdatedAt: Date.now(),
    });
    setNote("");
  }

  if (!items || items.length === 0) return <div className="no-tasks">No tasks found</div>;

  return (
    <ul className="task-list">
      {items.map((it) => (
        <li key={it.id} className="task-card">
          <div className="task-info">
            <strong className="task-title">{it.title}</strong>
            <p className="task-desc">{it.description}</p>
            <p className="task-status">Status: <span>{it.status}</span></p>
            {it.reporterUid && (
              <p className="task-reporter">
                Reporter: {reporterEmails[it.reporterUid] || it.reporterUid}
              </p>
            )}
            {completed && it.note && <p className="task-note">📝 Note: {it.note}</p>}
          </div>

          {!completed && (
            <div className="task-actions">
              {it.status !== "in_progress" && it.status !== "completed" && (
                <button className="btn btn-start" onClick={() => start(it.id)}>Start</button>
              )}
              <input
                type="text"
                className="task-note-input"
                placeholder="Add note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="btn btn-save" onClick={() => addNote(it.id)}>Save</button>
              {it.status !== "completed" && (
                <button className="btn btn-complete" onClick={() => complete(it.id)}>Mark Completed</button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
