import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../firebase';
import './AssignModal.css';

export default function AssignModal({ item, onClose }) {
  const [techs, setTechs] = useState([]);
  const [sel, setSel] = useState('');

  useEffect(() => {
    const r = ref(db, 'users');
    const unsub = onValue(r, snap => {
      const all = snap.val() || {};
      const arr = Object.keys(all)
        .map(k => ({ uid: k, ...all[k] }))
        .filter(u => u.role === 'technician');
      setTechs(arr);
    });
    return () => unsub();
  }, []);

  async function assign() {
    if (!sel) return alert('Please select a technician');
    await update(ref(db, `breakdowns/${item.id}`), {
      technician: sel,
      status: 'assigned',
      updatedAt: Date.now()
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Assign Task: {item.title}</h3>
        <select value={sel} onChange={e => setSel(e.target.value)}>
          <option value="">-- choose technician --</option>
          {techs.map(t => (
            <option key={t.uid} value={t.email}>
              {t.email || t.uid}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button className="btn assign-btn" onClick={assign}>Assign</button>
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
