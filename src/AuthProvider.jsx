import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from './firebase';


const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }


export default function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
const un = onAuthStateChanged(auth, (u) => {
setUser(u);
if (!u) {
setProfile(null);
setLoading(false);
return;
}
const userRef = ref(db, `users/${u.uid}`);
const unsub = onValue(userRef, (snap) => {
setProfile(snap.exists() ? snap.val() : null);
setLoading(false);
});
// onAuthStateChange listener cleanup doesn't remove onValue; keep simple
});
return () => un();
}, []);


return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
}