import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../firebase';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
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
    if (!sel) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Technician',
        text: 'Please select a technician before assigning.',
      });
      return;
    }

    const tech = techs.find(t => t.email === sel);
    if (!tech) {
      Swal.fire({
        icon: 'error',
        title: 'Technician not found',
        text: 'Please check the selected technician.',
      });
      return;
    }

    try {
      // 1️⃣ Update Firebase
      await update(ref(db, `breakdowns/${item.id}`), {
        technician: sel,
        status: 'assigned',
        updatedAt: Date.now(),
      });

      // 2️⃣ EmailJS parameters
      const templateParams = {
        technician_email: tech.email,
        title: item.title,
        description: item.description,
        createdAt: new Date(item.createdAt).toLocaleString(),
      };

      // 3️⃣ Send Email
      await emailjs.send(
        'service_iq1t3ae',
        'template_p6rvqlc',
        templateParams,
        'O7xL_PETZ7lQEOI8C'
      );

      // ✅ Sweet alert success message
      Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        html: `Email successfully sent to <b>${tech.email}</b> about the task updates.`,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });

      onClose();

    } catch (err) {
      console.error('Email send error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to send email',
        text: 'Something went wrong while sending the email. Please try again.',
      });
    }
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
