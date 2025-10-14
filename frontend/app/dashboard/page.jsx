"use client";

import { useAuth } from "../LoginAndReg/Context/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaDumbbell, FaUsers, FaChartLine, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  const { userData, logout, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard - isLoggedIn:", isLoggedIn);
    console.log("Dashboard - userData:", userData);
    console.log("Dashboard - userData.role:", userData?.role);
    
    if (!isLoggedIn) {
      router.push("/LoginAndReg/Login");
    } else {
      // Redirect based on user role
      if (userData?.role === "USER" || userData?.role === "user") {
        console.log("Redirecting to member dashboard");
        router.push("/member-dashboard");
      } else if (userData?.role === "ADMIN" || userData?.role === "admin") {
        console.log("Staying on admin dashboard");
        // Admin stays on this page
      } else {
        console.log("Unknown role, defaulting to member dashboard");
        router.push("/member-dashboard");
      }
      // If admin, stay on this page
    }
  }, [isLoggedIn, userData, router]);

  const handleLogout = () => {
    logout();
    router.push("/NavBarLandingPage");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = userData?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaDumbbell className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                GYM <span className="text-green-500">bro's</span> Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {userData?.firstName || "User"}!
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isAdmin 
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" 
                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              }`}>
                {isAdmin ? "Admin" : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isAdmin 
              ? "Manage your gym operations and members" 
              : "Track your fitness journey and progress"
            }
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaChartLine className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Members</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">987</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Classes Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCog className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Equipment</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/Admin/GymAdmin/memberManagement")}
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaUsers className="h-6 w-6 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Members</span>
              </button>
              <button
                onClick={() => router.push("/Admin/WorkoutManagement")}
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaDumbbell className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Workout Plans</span>
              </button>
              <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <FaChartLine className="h-6 w-6 text-purple-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
