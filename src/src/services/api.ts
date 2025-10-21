import axios, { AxiosInstance, AxiosError } from 'axios';

// API Base URL - change this to your backend URL
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    username?: string;
    email: string;
    password: string;
    fullName?: string;
    name?: string;
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
  }) => {
    // Backend expects 'name' not 'username' or 'fullName'
    const payload = {
      name: data.name || data.fullName || data.username || data.email.split('@')[0],
      email: data.email,
      password: data.password
    };
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  login: async (credentials: { username?: string; email?: string; password: string }) => {
    // Backend expects 'email' not 'username'
    const payload = {
      email: credentials.email || credentials.username,
      password: credentials.password
    };
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
  }) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },
};

// Meals API
export const mealsAPI = {
  getAdminMeals: async () => {
    const response = await apiClient.get('/meals/admin');
    return response.data;
  },

  getUserMeals: async () => {
    const response = await apiClient.get('/meals/user');
    return response.data;
  },

  copyMealToUser: async (mealId: number) => {
    const response = await apiClient.post(`/meals/copy/${mealId}`);
    return response.data;
  },

  createUserMeal: async (data: {
    mealName: string;
    category: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    description?: string;
    imageUrl?: string;
  }) => {
    const response = await apiClient.post('/meals', data);
    return response.data;
  },

  updateUserMeal: async (userMealId: number, data: any) => {
    const response = await apiClient.put(`/meals/${userMealId}`, data);
    return response.data;
  },

  deleteUserMeal: async (userMealId: number) => {
    const response = await apiClient.delete(`/meals/${userMealId}`);
    return response.data;
  },
};

// Exercises API
export const exercisesAPI = {
  getAdminExercises: async () => {
    const response = await apiClient.get('/exercises/admin');
    return response.data;
  },

  getUserExercises: async () => {
    const response = await apiClient.get('/exercises/user');
    return response.data;
  },

  copyExerciseToUser: async (exerciseId: number) => {
    const response = await apiClient.post(`/exercises/copy/${exerciseId}`);
    return response.data;
  },

  createUserExercise: async (data: {
    exerciseName: string;
    category: string;
    level?: string;
    duration?: number;
    caloriesBurned?: number;
    description?: string;
    imageUrl?: string;
  }) => {
    const response = await apiClient.post('/exercises', data);
    return response.data;
  },

  updateUserExercise: async (userExerciseId: number, data: any) => {
    const response = await apiClient.put(`/exercises/${userExerciseId}`, data);
    return response.data;
  },

  deleteUserExercise: async (userExerciseId: number) => {
    const response = await apiClient.delete(`/exercises/${userExerciseId}`);
    return response.data;
  },
};

// User Data API
export const userDataAPI = {
  getStatistics: async () => {
    const response = await apiClient.get('/user/statistics');
    return response.data;
  },

  // Sleep Records
  getSleepRecords: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/user/sleep', { params });
    return response.data;
  },

  createSleepRecord: async (data: {
    sleepDate: string;
    sleepStartTime: string;
    sleepEndTime: string;
    duration?: number;
    quality?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/user/sleep', data);
    return response.data;
  },

  updateSleepRecord: async (sleepRecordId: number, data: any) => {
    const response = await apiClient.put(`/user/sleep/${sleepRecordId}`, data);
    return response.data;
  },

  deleteSleepRecord: async (sleepRecordId: number) => {
    const response = await apiClient.delete(`/user/sleep/${sleepRecordId}`);
    return response.data;
  },

  // Water Logs
  getWaterLogs: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/user/water', { params });
    return response.data;
  },

  createWaterLog: async (data: {
    logDate: string;
    amountMl: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/user/water', data);
    return response.data;
  },

  deleteWaterLog: async (waterLogId: number) => {
    const response = await apiClient.delete(`/user/water/${waterLogId}`);
    return response.data;
  },

  // Activity Logs
  getActivityLogs: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/user/activity', { params });
    return response.data;
  },

  upsertActivityLog: async (data: {
    logDate: string;
    totalCalories?: number;
    totalExerciseMinutes?: number;
    totalWaterMl?: number;
    sleepHours?: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/user/activity', data);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/statistics');
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId: number) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Meal Management
  createAdminMeal: async (data: any) => {
    const response = await apiClient.post('/admin/meals', data);
    return response.data;
  },

  updateAdminMeal: async (mealId: number, data: any) => {
    const response = await apiClient.put(`/admin/meals/${mealId}`, data);
    return response.data;
  },

  deleteAdminMeal: async (mealId: number) => {
    const response = await apiClient.delete(`/admin/meals/${mealId}`);
    return response.data;
  },

  // Exercise Management
  createAdminExercise: async (data: any) => {
    const response = await apiClient.post('/admin/exercises', data);
    return response.data;
  },

  updateAdminExercise: async (exerciseId: number, data: any) => {
    const response = await apiClient.put(`/admin/exercises/${exerciseId}`, data);
    return response.data;
  },

  deleteAdminExercise: async (exerciseId: number) => {
    const response = await apiClient.delete(`/admin/exercises/${exerciseId}`);
    return response.data;
  },
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: async (data: {
    subject: string;
    message: string;
    category?: string;
  }) => {
    const response = await apiClient.post('/feedback', data);
    return response.data;
  },

  getUserFeedback: async () => {
    const response = await apiClient.get('/feedback/my-feedback');
    return response.data;
  },

  getAllFeedback: async (params?: { status?: string }) => {
    const response = await apiClient.get('/feedback/all', { params });
    return response.data;
  },

  updateFeedback: async (feedbackId: number, data: { status?: string; response?: string }) => {
    const response = await apiClient.put(`/feedback/${feedbackId}`, data);
    return response.data;
  },

  deleteFeedback: async (feedbackId: number) => {
    const response = await apiClient.delete(`/feedback/${feedbackId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
