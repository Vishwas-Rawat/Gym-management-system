"use client";

import { useState, useEffect } from "react";
import { FaDumbbell, FaPlus, FaSearch, FaCheck, FaTimes, FaRotateCcw } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

const muscleGroups = [
  { id: "chest", name: "Chest", position: { top: "35%", left: "50%" } },
  { id: "shoulders", name: "Shoulders", position: { top: "25%", left: "50%" } },
  { id: "biceps", name: "Biceps", position: { top: "40%", left: "25%" } },
  { id: "forearms", name: "Forearms", position: { top: "55%", left: "25%" } },
  { id: "abs", name: "Abs", position: { top: "50%", left: "50%" } },
  { id: "obliques", name: "Obliques", position: { top: "50%", left: "40%" } },
  { id: "quads", name: "Quads", position: { top: "70%", left: "50%" } },
  { id: "adductors", name: "Adductors", position: { top: "75%", left: "45%" } },
  { id: "abductors", name: "Abductors", position: { top: "75%", left: "55%" } },
  { id: "calves", name: "Calves", position: { top: "85%", left: "50%" } }
];

const exercises = {
  chest: [
    { id: 1, name: "Bench Press Upper Chest", sets: 3, reps: "8-12", rest: "60-90s" },
    { id: 2, name: "Bench Press Lower Chest", sets: 3, reps: "8-12", rest: "60-90s" },
    { id: 3, name: "Bench Press Mid Chest", sets: 3, reps: "8-12", rest: "60-90s" },
    { id: 4, name: "Cable Flys", sets: 3, reps: "8-12", rest: "60-90s" },
    { id: 5, name: "Butterflys", sets: 3, reps: "8-12", rest: "60-90s" }
  ],
  shoulders: [
    { id: 6, name: "Overhead Press", sets: 3, reps: "8-12", rest: "60-90s" },
    { id: 7, name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s" },
    { id: 8, name: "Front Raises", sets: 3, reps: "12", rest: "60s" }
  ],
  biceps: [
    { id: 9, name: "Bicep Curls", sets: 3, reps: "10-12", rest: "60s" },
    { id: 10, name: "Hammer Curls", sets: 3, reps: "10", rest: "60s" },
    { id: 11, name: "Concentration Curls", sets: 3, reps: "8-10", rest: "60s" }
  ],
  forearms: [
    { id: 12, name: "Wrist Curls", sets: 3, reps: "15", rest: "45s" },
    { id: 13, name: "Reverse Curls", sets: 3, reps: "12", rest: "45s" }
  ],
  abs: [
    { id: 14, name: "Crunches", sets: 3, reps: "20", rest: "30s" },
    { id: 15, name: "Planks", sets: 3, reps: "30-60s", rest: "30s" },
    { id: 16, name: "Leg Raises", sets: 3, reps: "10-12", rest: "60s" }
  ],
  obliques: [
    { id: 17, name: "Russian Twists", sets: 3, reps: "15 per side", rest: "45s" },
    { id: 18, name: "Side Planks", sets: 3, reps: "30s per side", rest: "30s" }
  ],
  quads: [
    { id: 19, name: "Squats", sets: 4, reps: "8-12", rest: "90s" },
    { id: 20, name: "Lunges", sets: 3, reps: "10 per leg", rest: "60s" },
    { id: 21, name: "Leg Press", sets: 3, reps: "12-15", rest: "90s" }
  ],
  adductors: [
    { id: 22, name: "Adductor Machine", sets: 3, reps: "12-15", rest: "60s" },
    { id: 23, name: "Sumo Squats", sets: 3, reps: "10-12", rest: "60s" }
  ],
  abductors: [
    { id: 24, name: "Abductor Machine", sets: 3, reps: "12-15", rest: "60s" },
    { id: 25, name: "Clamshells", sets: 3, reps: "15 per side", rest: "45s" }
  ],
  calves: [
    { id: 26, name: "Calf Raises", sets: 3, reps: "15", rest: "45s" },
    { id: 27, name: "Seated Calf Raises", sets: 3, reps: "15", rest: "45s" }
  ]
};

export default function WorkoutManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');
  const memberName = searchParams.get('memberName') || "Xyz";

  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);

  const handleMuscleClick = (muscleId) => {
    setSelectedMuscle(muscleId);
    setShowAddWorkout(true);
  };

  const toggleExerciseSelection = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(ex => ex.id === exercise.id);
      if (isSelected) {
        return prev.filter(ex => ex.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const addSelectedExercises = () => {
    const newExercises = selectedExercises.map(exercise => ({
      ...exercise,
      completed: false
    }));
    setWorkoutPlan(prev => [...prev, ...newExercises]);
    setSelectedExercises([]);
    setShowAddWorkout(false);
    setSelectedMuscle(null);
  };

  const removeExercise = (exerciseId) => {
    setWorkoutPlan(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const filteredExercises = selectedMuscle 
    ? exercises[selectedMuscle].filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaDumbbell className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Workout <span className="text-green-500">Management</span>
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/Admin/GymAdmin/memberManagement")}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back to Members
              </button>
              <button
                onClick={() => setShowAddWorkout(!showAddWorkout)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Workout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showAddWorkout ? (
          // Normal workout plan view
          <div className="space-y-8">
            {/* User Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Workout Plan for {memberName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{memberName}</span>
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

            {/* Workout Plan Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Workout Plan</h3>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Add workout view with human body diagram
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Workout for {memberName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Click on a muscle group to select exercises</p>
              
              {/* Human Body Diagram */}
              <div className="relative max-w-md mx-auto mb-8">
                <div className="relative w-64 h-96 mx-auto">
                  {/* Human body silhouette */}
                  <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full opacity-30"></div>
                  
                  {/* Muscle group buttons */}
                  {muscleGroups.map((muscle) => (
                    <button
                      key={muscle.id}
                      onClick={() => handleMuscleClick(muscle.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        selectedMuscle === muscle.id
                          ? "bg-green-500 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900"
                      }`}
                      style={{
                        top: muscle.position.top,
                        left: muscle.position.left
                      }}
                    >
                      {muscle.name}
                    </button>
                  ))}
                  
                  {/* Rotate button */}
                  <button className="absolute bottom-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full">
                    <FaRotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Selected muscle exercises */}
              {selectedMuscle && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {muscleGroups.find(m => m.id === selectedMuscle)?.name} Exercises
                    </h3>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search exercises..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {filteredExercises.map((exercise) => {
                      const isSelected = selectedExercises.find(ex => ex.id === exercise.id);
                      return (
                        <div
                          key={exercise.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "border-green-500 bg-green-50 dark:bg-green-900"
                              : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700"
                          }`}
                          onClick={() => toggleExerciseSelection(exercise)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {exercise.sets} sets • {exercise.reps} reps • {exercise.rest} rest
                              </p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}>
                              {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedExercises.length > 0 && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setSelectedExercises([]);
                          setSelectedMuscle(null);
                        }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addSelectedExercises}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center"
                      >
                        <FaPlus className="w-4 h-4 mr-2" />
                        Add Selected Exercises ({selectedExercises.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
