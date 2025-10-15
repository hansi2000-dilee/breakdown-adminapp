import React, { useState, useEffect } from 'react';
import { update, ref as dbRef, onValue, ref } from 'firebase/database';
import { db } from '../../firebase';
import AssignModal from './AssignModal';
import './PendingList.css';

export default function PendingList({ items }) {
  const [assigning, setAssigning] = useState(null);
  const [users, setUsers] = useState({});

  // Load all users once
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snap) => {
      setUsers(snap.val() || {});
    });
    return () => unsubscribe();
  }, []);

  async function markAsClosed(id) {
    await update(dbRef(db, `breakdowns/${id}`), {
      status: 'closed',
      updatedAt: Date.now(),
    });
  }

  if (!items || items.length === 0) return <div className="empty-message">No pending reports</div>;

  return (
    <div className="pending-list">
      {items.map((it) => {
        const reporter = users[it.reporterUid]; // look up user info
        return (
          <div key={it.id} className="pending-card">
            <div className="pending-header">
              <strong>{it.title}</strong> <em>({it.status})</em>
            </div>
            <div className="pending-body">
              <p className="description">{it.description}</p>
              <p className="muted">
                Reporter: <span>{reporter ? reporter.email : it.reporterUid}</span>
              </p>
            </div>
            <div className="actions">
              <button className="btn assign-btn" onClick={() => setAssigning(it)}>Assign</button>
              <button className="btn close-btn" onClick={() => markAsClosed(it.id)}>Close</button>
            </div>
          </div>
        );
      })}

      {assigning && <AssignModal item={assigning} onClose={() => setAssigning(null)} />}
    </div>
  );
}
