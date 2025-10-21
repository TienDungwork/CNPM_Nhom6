import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

// Admin API Service
export const adminAPI = {
  // ==================== USERS ====================
  async getAllUsers() {
    const api = createAuthAxios();
    console.log('[adminAPI] Calling GET /admin/users with token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    const response = await api.get('/admin/users');
    console.log('[adminAPI] GET /admin/users response:', response.data);
    return response.data;
  },

  async getUserById(userId: string) {
    const api = createAuthAxios();
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, userData: {
    name?: string;
    email?: string;
    role?: 'user' | 'admin';
    status?: 'active' | 'inactive';
  }) {
    const api = createAuthAxios();
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string) {
    const api = createAuthAxios();
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // ==================== STATISTICS ====================
  async getDashboardStats() {
    const api = createAuthAxios();
    console.log('[adminAPI] Calling GET /admin/statistics with token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    const response = await api.get('/admin/statistics');
    console.log('[adminAPI] GET /admin/statistics response:', response.data);
    return response.data;
  },

  // ==================== MEALS ====================
  async getAllMeals() {
    const api = createAuthAxios();
    const response = await api.get('/admin/meals');
    return response.data;
  },

  async createMeal(mealData: {
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    prepTime?: number;
    image?: string;
    ingredients?: string[];
    steps?: string[];
  }) {
    const api = createAuthAxios();
    const response = await api.post('/admin/meals', mealData);
    return response.data;
  },

  async updateMeal(mealId: string, mealData: Partial<{
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prepTime: number;
    image: string;
    ingredients: string[];
    steps: string[];
    status: 'public' | 'hidden';
  }>) {
    const api = createAuthAxios();
    const response = await api.put(`/admin/meals/${mealId}`, mealData);
    return response.data;
  },

  async deleteMeal(mealId: string) {
    const api = createAuthAxios();
    const response = await api.delete(`/admin/meals/${mealId}`);
    return response.data;
  },

  // ==================== EXERCISES ====================
  async getAllExercises() {
    const api = createAuthAxios();
    const response = await api.get('/admin/exercises');
    return response.data;
  },

  async createExercise(exerciseData: {
    title: string;
    muscleGroup: string;
    duration: number;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    caloriesBurned?: number;
    image?: string;
    description?: string;
    steps?: string[];
  }) {
    const api = createAuthAxios();
    const response = await api.post('/admin/exercises', exerciseData);
    return response.data;
  },

  async updateExercise(exerciseId: string, exerciseData: Partial<{
    title: string;
    muscleGroup: string;
    duration: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    caloriesBurned: number;
    image: string;
    description: string;
    steps: string[];
    status: 'public' | 'hidden';
  }>) {
    const api = createAuthAxios();
    const response = await api.put(`/admin/exercises/${exerciseId}`, exerciseData);
    return response.data;
  },

  async deleteExercise(exerciseId: string) {
    const api = createAuthAxios();
    const response = await api.delete(`/admin/exercises/${exerciseId}`);
    return response.data;
  },

  // ==================== FEEDBACK ====================
  async getAllFeedback(status?: 'pending' | 'in_progress' | 'resolved') {
    const api = createAuthAxios();
    const params = status ? { status } : {};
    const response = await api.get('/feedback/all', { params });
    return response.data;
  },

  async updateFeedback(feedbackId: string, data: { status?: string; response?: string }) {
    const api = createAuthAxios();
    const response = await api.put(`/feedback/${feedbackId}`, data);
    return response.data;
  },

  async deleteFeedback(feedbackId: string) {
    const api = createAuthAxios();
    const response = await api.delete(`/feedback/${feedbackId}`);
    return response.data;
  }
};

// Helper to check if user is admin
export const isAdmin = (): boolean => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  
  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === 'admin';
  } catch {
    return false;
  }
};

// Export for use in components
export default adminAPI;
