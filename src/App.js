import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TechDashboard from './pages/Technician/TechDashboard';
import ProtectedRoute from './components/ProtectedRoute';


export default function App(){
return (
<div className="app">

<main>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />


<Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
<Route path="/tech" element={<ProtectedRoute roles={["technician"]}><TechDashboard /></ProtectedRoute>} />
</Routes>
</main>
</div>
);
}