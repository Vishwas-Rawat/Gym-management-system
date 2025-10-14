"use client";

import { useAuth } from "../LoginAndReg/Context/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDumbbell, FaChartLine, FaCalendarAlt, FaUser, FaSignOutAlt, FaPlay, FaPause, FaCheck } from "react-icons/fa";
import Link from "next/link";

export default function MemberDashboard() {
  const { userData, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/LoginAndReg/Login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    // Load workout plan from localStorage or API
    const savedPlan = localStorage.getItem("memberWorkoutPlan");
    if (savedPlan) {
      setWorkoutPlan(JSON.parse(savedPlan));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const handleLogout = () => {
    logout();
    router.push("/NavBarLandingPage");
  };

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
  };

  const resetTimer = () => {
    setWorkoutTimer(0);
    setIsWorkoutActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedExercises = workoutPlan.filter(ex => ex.completed).length;
  const totalExercises = workoutPlan.length;
  const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaDumbbell className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Member <span className="text-green-500">Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {userData?.firstName || "Member"}!
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Member
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
            Your Workout Plan
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track your fitness journey and progress
          </p>
        </div>

        {/* User Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{userData?.firstName || "Xyz"}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">28 kg</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Height:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">155 cm</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">3 month + 1 month (120 days)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Member Status</div>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                Active Member
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaDumbbell className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Exercises</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalExercises}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedExercises}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaChartLine className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalExercises - completedExercises}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{progress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Workout Timer</h3>
              <div className="text-3xl font-mono text-green-600 dark:text-green-400">
                {formatTime(workoutTimer)}
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleWorkout}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isWorkoutActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isWorkoutActive ? <FaPause className="w-5 h-5 mr-2" /> : <FaPlay className="w-5 h-5 mr-2" />}
                {isWorkoutActive ? "Pause" : "Start"} Workout
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Reset Timer
              </button>
            </div>
          </div>
        </div>

        {/* Workout Plan Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Workout Plan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {workoutPlan.length > 0 ? (
                  workoutPlan.map((exercise, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.sets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.reps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.rest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          exercise.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {exercise.completed ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No workout plan assigned yet. Contact your trainer for a personalized workout plan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
