import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GymRegistrationPage from './pages/GymRegistrationPage';
import MemberCompleteRegistrationPage from './pages/MemberCompleteRegistrationPage';
import TrainerCompleteRegistrationPage from './pages/TrainerCompleteRegistrationPage';
import TrainerDashboardPage from './pages/TrainerDashboardPage';
import AdminAddMemberPage from './pages/AdminAddMemberPage';
import AdminAddTrainerPage from './pages/AdminAddTrainerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGymsPage from './pages/AdminGymsPage';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { GymProvider } from './context/GymContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <AuthProvider>
      <AttendanceProvider>
        <GymProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gym-register" element={<GymRegistrationPage />} />
            <Route path="/register/complete" element={<MemberCompleteRegistrationPage />} />
            <Route path="/trainer/register/complete" element={<TrainerCompleteRegistrationPage />} />

            {/* Trainer Routes */}
            <Route 
              path="/trainer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['TRAINER']}>
                  <TrainerDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/members/add" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAddMemberPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/trainers/add" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAddTrainerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/gyms" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminGymsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </GymProvider>
      </AttendanceProvider>
    </AuthProvider>
  </Router>
);

export default App;