import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { checkStatus } = useAuth(); // If available in context, or import useAuth
  
  useEffect(() => {
    const verifyUser = async () => {
        if (token) {
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.authorities?.[0]?.authority || decoded.sub?.role; 
            setUserRole(role);
            
            // Optional: Check status on every route change if critical
            // await checkStatus(); 
        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem('token');
        }
        }
        setIsLoading(false);
    };
    verifyUser();
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
