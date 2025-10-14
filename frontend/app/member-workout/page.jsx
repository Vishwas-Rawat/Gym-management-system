"use client";

import { useState, useEffect } from "react";
import { FaDumbbell, FaPlay, FaPause, FaCheck, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

export default function MemberWorkoutPlan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');
  const memberName = searchParams.get('memberName') || "Xyz";

  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock workout data - in real app, this would come from API based on memberId
  useEffect(() => {
    const mockWorkoutPlan = [
      {
        id: 1,
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        rest: "60-90s",
        description: "Chest exercise",
        completed: false
      },
      {
        id: 2,
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        rest: "60-90s",
        description: "Chest exercise",
        completed: false
      },
      {
        id: 3,
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        rest: "60-90s",
        description: "Chest exercise",
        completed: false
      },
      {
        id: 4,
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        rest: "60-90s",
        description: "Chest exercise",
        completed: false
      }
    ];
    setWorkoutPlan(mockWorkoutPlan);
  }, [memberId]);

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

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

  const toggleExercise = (id) => {
    setWorkoutPlan(prev => 
      prev.map(exercise => 
        exercise.id === id 
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const deleteExercise = (id) => {
    setWorkoutPlan(prev => prev.filter(exercise => exercise.id !== id));
  };

  const completedExercises = workoutPlan.filter(ex => ex.completed).length;
  const totalExercises = workoutPlan.length;
  const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaDumbbell className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Workout <span className="text-green-500">Plan</span>
              </h1>
            </div>
            <button
              onClick={() => router.push("/Admin/GymAdmin/memberManagement")}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Back to Members
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Details and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="text-gray-900 dark:text-white">{memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                <span className="text-gray-900 dark:text-white">28 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Height:</span>
                <span className="text-gray-900 dark:text-white">155 cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                <span className="text-gray-900 dark:text-white">3 month + 1 month (120 days)</span>
              </div>
            </div>
          </div>

          {/* Exercise Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exercise Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Total Exercises</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Completed</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completedExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalExercises - completedExercises}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Member Info and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Member Info</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Member:</span>
                <span className="text-gray-900 dark:text-white">User/ Prime User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Trainer:</span>
                <span className="text-gray-900 dark:text-white">xyz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                <span className="text-gray-900 dark:text-white">done/remaining</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date of joining:</span>
                <span className="text-gray-900 dark:text-white">12-02-2024</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Notification</span>
                <input type="text" className="w-20 px-2 py-1 text-xs border rounded" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Pause membership</span>
                <input type="text" className="w-20 px-2 py-1 text-xs border rounded" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Last Workout Details</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">No recent workout data</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                  Add Workout
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                  Fuck OFF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Plan Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Workout Plan</h3>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {workoutPlan.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                      <button
                        onClick={() => toggleExercise(exercise.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          exercise.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {exercise.completed ? <FaCheck className="w-4 h-4" /> : "O"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteExercise(exercise.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
