import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import PendingList from './PendingList';
import ApprovedList from './ApprovedList';
import useRealtimeList from '../../hooks/useRealtimeList';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const breakdowns = useRealtimeList('breakdowns');
  const pending = breakdowns.filter(
    b => b.status === 'pending' || b.status === 'assigned' || b.status === 'in_progress'
  );
  const approved = breakdowns.filter(
    b => b.status === 'completed' || b.status === 'closed'
  );

  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav('/login');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="card total">Total Reports: {breakdowns.length}</div>
        <div className="card pending">Pending: {pending.length}</div>
        <div className="card approved">Approved/Completed: {approved.length}</div>
      </div>

      <section className="dashboard-section">
        <h3>Pending / Assigned</h3>
        <PendingList items={pending} />
      </section>

      <section className="dashboard-section">
        <h3>Completed / Closed</h3>
        <ApprovedList items={approved} />
      </section>
    </div>
  );
}
