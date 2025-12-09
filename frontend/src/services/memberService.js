import api, { memberActivityApi, attendanceApi } from './api';

const processError = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};

// --- HOME & DASHBOARD (8085) ---
export const getHomeStats = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/dashboard/home');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getTodayActivity = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/dashboard/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- DIET LOGGING (8085) ---
export const logDiet = async (data) => {
    try {
        const response = await memberActivityApi.post('/api/diet/log', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getTodayDietLogs = async () => {
    try {
        const response = await memberActivityApi.get('/api/diet/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getDietHistory = async () => {
     try {
        const response = await memberActivityApi.get('/api/diet/history');
        return response.data;
    } catch (error) { throw processError(error); }
}

// --- WORKOUT LOGGING (8085) ---
export const logWorkout = async (data) => {
    try {
        const response = await memberActivityApi.post('/api/workout/log', data);
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

export const getTodayWorkoutLogs = async () => {
    try {
        const response = await memberActivityApi.get('/api/workout/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- PROFILE (8085) ---
export const getMyProfile = async () => {
    try {
        const response = await api.get('/api/member/profile/me');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const updateProfile = async (data) => {
    try {
        const response = await api.put('/api/member/profile/update', data);
        return response.data;
    } catch (error) { throw processError(error); }
};



// --- DIET PLAN (8085) ---
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

// --- WORKOUT PLAN (8085) ---
export const getMyWorkoutPlan = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/workout/my-plan');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- ATTENDANCE (8084) ---

export const markAttendance = async (status = 'PRESENT') => {
    try {
        const response = await attendanceApi.post(`/api/attendance/mark?status=${status}`);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getAttendanceHistory = async () => {
    try {
        const response = await attendanceApi.get('/api/attendance/history');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const checkTodayAttendanceStatus = async () => {
    try {
        const response = await attendanceApi.get('/api/attendance/today');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getAttendanceStreak = async () => {
    try {
        const response = await attendanceApi.get('/api/attendance/streak');
        return response.data;
    } catch (error) { throw processError(error); }
};

export const getAttendanceMaxStreak = async () => {
    try {
        const response = await attendanceApi.get('/api/attendance/max-streak');
        return response.data;
    } catch (error) { throw processError(error); }
};

// --- TRAINER CHECK ---
export const getHasTrainer = async () => {
    try {
        const response = await memberActivityApi.get('/api/member/has-trainer');
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
        const response = await memberActivityApi.post('/member/request/workout', data);
        return response.data;
    } catch (error) { throw processError(error); }
};

export const requestDietPlan = async (data) => {
    try {
        const response = await memberActivityApi.post('/member/request/diet', data);
        return response.data;
    } catch (error) { throw processError(error); }
};
