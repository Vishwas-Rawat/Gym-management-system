import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import AdminAddMemberPage from "./pages/AdminAddMemberPage";
import AdminAddTrainerPage from "./pages/AdminAddTrainerPage";
import AdminAssignmentsPage from "./pages/AdminAssignmentsPage";
import AdminAttendancePage from "./pages/AdminAttendancePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminGymsPage from "./pages/AdminGymsPage";
import GymRegistrationPage from "./pages/GymRegistrationPage";
import LoginPage from "./pages/LoginPage";
import MemberCompleteRegistrationPage from "./pages/MemberCompleteRegistrationPage";
import RegisterPage from "./pages/RegisterPage";
import TrainerCompleteRegistrationPage from "./pages/TrainerCompleteRegistrationPage";
import TrainerDashboardPage from "./pages/TrainerDashboardPage";

import AdminChatPage from "./pages/AdminChatPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import LandingPage from "./pages/LandingPage"; // Import LandingPage
import MemberDashboardPage from "./pages/MemberDashboardPage";
import TrainerChatPage from "./pages/TrainerChatPage"; // Import TrainerChatPage

import AdminLayout from "./components/AdminLayout"; // Import AdminLayout
import TrainerLayout from "./components/TrainerLayout"; // Import TrainerLayout
import { AttendanceProvider } from "./context/AttendanceContext";
import { AuthProvider } from "./context/AuthContext";
import { GymProvider } from "./context/GymContext";
// cleaned up imports
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => (
  <ThemeProvider>
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <GymProvider>
            <WorkoutProvider>
              <ChatProvider>
                <Routes>
                  {/* ... routes ... */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/gym-register"
                    element={<GymRegistrationPage />}
                  />
                  <Route
                    path="/register/complete"
                    element={<MemberCompleteRegistrationPage />}
                  />
                  <Route
                    path="/trainer/register/complete"
                    element={<TrainerCompleteRegistrationPage />}
                  />

                  {/* Trainer Routes */}
                  <Route
                    path="/trainer"
                    element={
                      <ProtectedRoute allowedRoles={["TRAINER"]}>
                        <TrainerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="dashboard"
                      element={<TrainerDashboardPage />}
                    />
                    <Route path="chat" element={<TrainerChatPage />} />
                  </Route>

                  {/* Member Routes */}
                  <Route
                    path="/member/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["MEMBER"]}>
                        <MemberDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="gyms" element={<AdminGymsPage />} />
                    <Route
                      path="members/add"
                      element={<AdminAddMemberPage />}
                    />
                    <Route
                      path="trainers/add"
                      element={<AdminAddTrainerPage />}
                    />
                    <Route
                      path="attendance"
                      element={<AdminAttendancePage />}
                    />
                    <Route
                      path="assignments"
                      element={<AdminAssignmentsPage />}
                    />
                    <Route path="assignments" element={<AdminAssignmentsPage />} />
                    <Route path="chat" element={<AdminChatPage />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                  </Route>
                </Routes>
              </ChatProvider>
            </WorkoutProvider>
          </GymProvider>
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  </ThemeProvider>
);

export default App;
