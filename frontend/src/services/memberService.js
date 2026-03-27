import api, { userApi, memberActivityApi, attendanceApi } from './api';

const processError = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};

// --- HOME & DASHBOARD (8085) ---
export const getHomeStats = async (gymId) => {
    try {
        const response = await memberActivityApi.get(`/api/member/dashboard/home/${gymId}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getTodayActivity = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/dashboard/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- DIET LOGGING (8083 & 8085) ---

// 1. Search Food (Trainer Panel 8085)
export const searchFood = async (query) => {
    try {
        const response = await memberActivityApi.get(`/api/food/search?query=${query}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

// 2. Add Custom Food (Trainer Panel 8085 - Member Context)
export const addCustomFood = async (data) => {
    try {
        const response = await memberActivityApi.post('/api/food', data);
        return response.data;
    } catch (error) { throw processError(error); }
}

// 3. Log Diet (8085)
// 3. Log Diet (8085)
export const logDiet = async (data) => {
    try {
        // data: Array of { date, mealName, foodItemId, quantity }
        const response = await memberActivityApi.post('/api/diet/log', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

// 4. Get Daily Logs (8085)
export const getTodayDietLogs = async (date) => {
    try {
        const queryDate = date || new Date().toISOString().split('T')[0];
        const response = await memberActivityApi.get(`/api/diet/log?date=${queryDate}`);
        return response.data; // Returns { date, logs: [], totalCalories... }
    } catch (error) { throw processError(error); }
};

export const getDietHistory = async () => {
     try {
        const response = await memberActivityApi.get('/api/diet/history');
        return response.data;
    } catch (error) { throw processError(error); }
}

export const deleteDietLog = async (logId) => {
    try {
        const response = await memberActivityApi.delete(`/api/diet/log/${logId}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const updateDietLog = async (logId, data) => {
    try {
        const response = await memberActivityApi.put(`/api/diet/log/${logId}`, data);
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- WORKOUT LOGGING (8083 & 8085) ---

// 1. Search Exercise (Trainer Panel 8085)
export const searchExercise = async (query) => {
    try {
        const response = await memberActivityApi.get(`/api/exercise/search?query=${query}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

// 2. Add Custom Exercise (Trainer Panel 8085)
export const addCustomExercise = async (data) => {
    try {
        const response = await memberActivityApi.post('/api/exercise', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

// 3. Log Workout (Member Service 8083)
export const logWorkout = async (data) => {
    try {
        // data: { date, exerciseId, sets, reps, weightKg }
        const response = await memberActivityApi.post('/api/workout/log', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getTodayWorkoutLogs = async (date) => {
    try {
        const queryDate = date || new Date().toISOString().split('T')[0];
        const response = await memberActivityApi.get(`/api/workout/log?date=${queryDate}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const deleteWorkoutLog = async (logId) => {
    try {
        const response = await memberActivityApi.delete(`/api/workout/log/${logId}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const updateWorkoutLog = async (logId, data) => {
    try {
        const response = await memberActivityApi.put(`/api/workout/log/${logId}`, data);
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- PROFILE (8083) ---
export const getMyProfile = async () => {
    try {
        const response = await userApi.get('/member/profile/me'); 
        return response.data;
    } catch (error) { throw processError(error); }
};

export const updateProfile = async (data) => {
    try {
        const response = await userApi.put('/member/profile/me', data);
        return response.data;
    } catch (error) { throw processError(error); }
};



// --- DIET PLAN (8083) ---
export const getMyDietPlan = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/diet/my-plan');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const logFood = async (data) => {
    try {
        const response = await memberActivityApi.post('/api/member/diet/log', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getDietTodaySummary = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/diet/today/summary');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- WORKOUT PLAN (8083) ---
export const getMyWorkoutPlan = async () => {
    try {
        const response = await memberActivityApi.get('/api/workout/my-plan');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- ATTENDANCE (8084) ---

export const markAttendance = async (status = 'PRESENT') => {
    try {
        const response = await attendanceApi.post(`/attendance/mark?status=${status}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getAttendanceHistory = async () => {
    try {
        const response = await attendanceApi.get('/attendance/history');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const checkTodayAttendanceStatus = async () => {
    try {
        const response = await attendanceApi.get('/attendance/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- TRAINER CHECK ---
export const getHasTrainer = async () => {
    try {
        // Use userApi (8083) as per instruction
        const response = await userApi.get('/member/has-trainer');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getAvailableTrainers = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/trainers/available');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getMuscleGroups = async () => {
    try {
        const response = await memberActivityApi.get('/api/workout/muscle-groups');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getExercisesByMuscleGroup = async (muscleGroup) => {
    try {
        const response = await memberActivityApi.get(`/api/workout/exercises?muscleGroup=${muscleGroup}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const requestWorkoutPlan = async (data) => {
    try {
    const response = await memberActivityApi.post('/api/member/request/workout', data);
        return response.data;
    } catch (error) { throw processError(error); }
};


export const requestDietPlan = async (data) => {
    try {
    const response = await memberActivityApi.post('/api/member/request/diet', data);
        return response.data;
    } catch (error) { throw processError(error); }
};


export const getMyRequests = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/request/my'); 
        return response.data;
    } catch (error) { throw processError(error); }
};

export const updateRequest = async (type, requestId, message) => {
    try {
        const response = await memberActivityApi.put(`/api/member/request/${type}/${requestId}`, { message });
        return response.data;
    } catch (error) { throw processError(error); }
};

export const cancelRequest = async (type, requestId) => {
    try {
        const response = await memberActivityApi.delete(`/api/member/request/${type}/${requestId}`);
        return response.data;
    } catch (error) { throw processError(error); }
};


