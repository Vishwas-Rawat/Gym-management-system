import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GymRegistrationPage from './pages/GymRegistrationPage';
import MemberCompleteRegistrationPage from './pages/MemberCompleteRegistrationPage';
import TrainerCompleteRegistrationPage from './pages/TrainerCompleteRegistrationPage';
import AdminAddMemberPage from './pages/AdminAddMemberPage';
import AdminAddTrainerPage from './pages/AdminAddTrainerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';

const App = () => (
  <Router>
    <AuthProvider>
      <AttendanceProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gym-register" element={<GymRegistrationPage />} />
          <Route path="/register/complete" element={<MemberCompleteRegistrationPage />} />
          <Route path="/trainer/complete-registration" element={<TrainerCompleteRegistrationPage />} />
          <Route path="/admin/members/add" element={<AdminAddMemberPage />} />
          <Route path="/admin/trainers/add" element={<AdminAddTrainerPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </AttendanceProvider>
    </AuthProvider>
  </Router>
);

export default App;