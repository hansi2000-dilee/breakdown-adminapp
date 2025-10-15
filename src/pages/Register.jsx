import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState("reporter");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      const uid = cred.user.uid;
      await set(ref(db, `users/${uid}`), { email, role, createdAt: Date.now() });
      nav("/"); // redirect to dashboard/home
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="reporter">Reporter</option>
          <option value="technician">Technician</option>
          <option value="admin">Admin</option>
        </select>
        {err && <div className="auth-error">{err}</div>}
        <button type="submit">Create Account</button>
        <p className="auth-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}
