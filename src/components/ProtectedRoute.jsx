import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';


export default function ProtectedRoute({ roles, children }){
const { user, profile, loading } = useAuth();
if (loading) return <div>Loading...</div>;
if (!user) return <Navigate to="/login" />;
if (roles && !roles.includes(profile?.role)) return <div>Unauthorized</div>;
return children;
}