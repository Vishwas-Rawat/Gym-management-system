import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GymRegistrationPage from './pages/GymRegistrationPage';
import MemberCompleteRegistrationPage from './pages/MemberCompleteRegistrationPage';
import AdminAddMemberPage from './pages/AdminAddMemberPage';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gym-register" element={<GymRegistrationPage />} />
        <Route path="/register/complete" element={<MemberCompleteRegistrationPage />} />
        <Route path="/admin/members/add" element={<AdminAddMemberPage />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;