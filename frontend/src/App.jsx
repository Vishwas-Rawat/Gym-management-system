import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
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
import AdminAttendancePage from './pages/AdminAttendancePage';
import AdminAssignmentsPage from './pages/AdminAssignmentsPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import AdminLayout from './components/AdminLayout'; // Import AdminLayout
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { GymProvider } from './context/GymContext';
import { ChatProvider } from './context/ChatContext';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <AuthProvider>
      <AttendanceProvider>
        <ChatProvider>
          <GymProvider>
            <WorkoutProvider>
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

              {/* Member Routes */}
              <Route 
                path="/member/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['MEMBER']}>
                    <MemberDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes - Wrapped in AdminLayout with Protection */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="gyms" element={<AdminGymsPage />} />
                <Route path="members/add" element={<AdminAddMemberPage />} />
                <Route path="trainers/add" element={<AdminAddTrainerPage />} />
                <Route path="attendance" element={<AdminAttendancePage />} />
                <Route path="members/:memberId" element={<AdminDashboardPage />} /> {/* Placeholder if needed or Member Details Page? Assumed reused or new page. User didn't specify. AdminDashboard logic had links to /admin/members/:id. I'll map it to Dashboard or AddMemberPage for now if no dedicated page exists, but better to keep it valid. Wait, I saw navigation to `/admin/members/${m.memberId}` in code. I don't see a route for it. I will add it if it was there? It wasn't in original App.jsx I viewed. So maybe it was broken or led to nothing. I'll stick to known routes. */}
                <Route path="assignments" element={<AdminAssignmentsPage />} />
              </Route>

            </Routes>
          </WorkoutProvider>
          </GymProvider>
        </ChatProvider>
      </AttendanceProvider>
    </AuthProvider>
  </Router>
);

export default App;