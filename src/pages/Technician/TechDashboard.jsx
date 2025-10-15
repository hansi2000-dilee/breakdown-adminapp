import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import useRealtimeList from "../../hooks/useRealtimeList";
import { useAuth } from "../../AuthProvider";
import TechTasks from "./TechTasks";
import './TechDashboard.css';

export default function TechDashboard() {
  const { user } = useAuth();
  const breakdowns = useRealtimeList("breakdowns"); 

  const mine = breakdowns.filter((b) => b.technician === user.email);
  const pending = mine.filter(
    (m) => m.status === "assigned" || m.status === "in_progress"
  );
  const completed = mine.filter(
    (m) => m.status === "completed" || m.status === "closed"
  );

   const nav = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav("/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <div className="tech-dashboard">
      <div className="dashboard-header">
        <h2>👋 Welcome, {user.email}</h2>
       <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <section className="dashboard-section">
        <h3>🛠 Pending Tasks</h3>
        <TechTasks items={pending} />
      </section>

      <section className="dashboard-section">
        <h3>✅ Completed Tasks</h3>
        <TechTasks items={completed} completed />
      </section>
    </div>
  );
}
