import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GymRegistrationPage from './pages/GymRegistrationPage';
import { AuthProvider } from './context/AuthContext'; // Adjust path if needed

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gym-register" element={<GymRegistrationPage />} />
      </Routes>
    </AuthProvider>
  </Router>
);


export default App;