import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import './ApprovedList.css';

export default function ApprovedList({ items }) {
  const [histories, setHistories] = useState({}); // store history per reportId

  useEffect(() => {
    const unsubscribers = [];

    // Load histories for each completed/closed report
    items.forEach((it) => {
      if (!it.reportId) return;

      const historyRef = ref(db, `breakdowns/${it.reportId}/history`);
      const unsub = onValue(historyRef, (snap) => {
        const data = snap.val() || {};
        const arr = Object.keys(data).map((hid) => ({
          id: hid,
          ...data[hid],
        }));
        setHistories((prev) => ({ ...prev, [it.reportId]: arr }));
      });

      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [items]);

  if (!items || items.length === 0)
    return <div className="empty-message">No completed reports</div>;

  return (
    <div className="approved-list">
      {items.map((it) => (
        <div key={it.reportId} className="approved-card">
          <div className="approved-header">
            <strong>{it.title}</strong>
          </div>
          <div className="approved-body">
            <p className="description">{it.description}</p>
            <p className="muted">
              Technician: <span>{it.technician || '—'}</span>
            </p>
            <p className="muted">
              Status: <span>{it.status}</span>
            </p>

            {/* Optional History Section */}
            {histories[it.reportId] && histories[it.reportId].length > 0 && (
              <div className="history">
                <h4>History:</h4>
                <ul>
                  {histories[it.reportId].map((h) => (
                    <li key={h.id}>
                      <span className="history-text">{h.text}</span> –{' '}
                      <span className="history-ts">
                        {h.ts ? new Date(Number(h.ts)).toLocaleString() : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
