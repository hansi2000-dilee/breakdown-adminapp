import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pw);

      // Get user profile from DB
      const snap = await get(ref(db, `users/${cred.user.uid}`));
      const profile = snap.val();

      if (!profile) {
        setErr("User profile not found");
        return;
      }

      // Redirect based on role
      if (profile.role === "admin") nav("/admin");
      else if (profile.role === "technician") nav("/tech");
      else nav("/"); // fallback

    } catch (e) {
      console.log(e);
      setErr(e.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Login</h2>
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
        {err && <div className="auth-error">{err}</div>}
        <button type="submit">Login</button>
        <p className="auth-text">
          Not registered? <a href="/register">Create an account</a>
        </p>
      </form>
    </div>
  );
}
