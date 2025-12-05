import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming the role is stored in the token under 'role' or 'authorities'
        // Adjust this based on your actual JWT structure
        const role = decoded.role || decoded.authorities?.[0]?.authority || decoded.sub?.role; 
        setUserRole(role);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, [token]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'TRAINER') return <Navigate to="/trainer/dashboard" replace />;
    return <Navigate to="/login" replace />; // Fallback
  }

  return children;
};

export default ProtectedRoute;
