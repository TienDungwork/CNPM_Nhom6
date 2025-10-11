import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Backend Entities
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface MealPlan {
  id: string;
  userId: string;
  userName: string;
  calories: number;
  items: string[];
  date: string;
}

export interface Exercise {
  id: string;
  title: string;
  type: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurned: number;
  image: string;
  description: string;
}

export interface SleepCycle {
  id: string;
  userId: string;
  sleepTime: string;
  wakeTime: string;
  hours: number;
  quality: number;
  date: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string;
  cups: number;
  goal: number;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  category: string;
  message: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'meal' | 'water' | 'exercise' | 'sleep' | 'feedback';
  title: string;
  details: string;
  timestamp: string;
}

export interface DailyPlanner {
  id: string;
  userId: string;
  date: string;
  time: string;
  activity: 'eating' | 'exercise' | 'sleep' | 'water';
  type: string;
  description: string;
  notes?: string;
  completed: boolean;
}

interface DataContextType {
  users: User[];
  mealPlans: MealPlan[];
  exercises: Exercise[];
  sleepCycles: SleepCycle[];
  waterLogs: WaterLog[];
  feedbacks: Feedback[];
  activityLogs: ActivityLog[];
  dailyPlanners: DailyPlanner[];
  
  // User actions
  addMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  addSleepCycle: (sleepCycle: Omit<SleepCycle, 'id'>) => void;
  updateWaterLog: (userId: string, cups: number) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => string;
  addActivityLog: (log: Omit<ActivityLog, 'id'>) => void;
  addDailyPlanner: (planner: Omit<DailyPlanner, 'id'>) => void;
  updateDailyPlannerStatus: (plannerId: string, completed: boolean) => void;
  deleteDailyPlanner: (plannerId: string) => void;
  
  // Admin actions
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  updateUserStatus: (userId: string, isActive: boolean) => void;
  updateFeedbackStatus: (feedbackId: string, status: Feedback['status']) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  
  // Getters
  getUserById: (userId: string) => User | undefined;
  getUserFeedbacks: (userId: string) => Feedback[];
  getUserPlanners: (userId: string, date?: string) => DailyPlanner[];
  getPendingFeedbacksCount: () => number;
  getRecentUsers: (count: number) => User[];
  getStatistics: () => {
    totalUsers: number;
    activeUsers: number;
    totalFeedbacks: number;
    pendingFeedbacks: number;
    totalMealPlans: number;
    totalExercises: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize with mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'user@test.com',
      role: 'user',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
  ]);

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      title: 'Full Body Strength',
      type: 'Strength',
      duration: 45,
      difficulty: 'Intermediate',
      caloriesBurned: 320,
      image: 'https://images.unsplash.com/photo-1634788699201-77bbb9428ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYwMDU5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Complete workout targeting all major muscle groups',
    },
  ]);
  
  const [sleepCycles, setSleepCycles] = useState<SleepCycle[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dailyPlanners, setDailyPlanners] = useState<DailyPlanner[]>([]);

  // Persist to localStorage
  useEffect(() => {
    const data = {
      users,
      mealPlans,
      exercises,
      sleepCycles,
      waterLogs,
      feedbacks,
      activityLogs,
      dailyPlanners,
    };
    localStorage.setItem('healthyColorsData', JSON.stringify(data));
  }, [users, mealPlans, exercises, sleepCycles, waterLogs, feedbacks, activityLogs, dailyPlanners]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('healthyColorsData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.users) setUsers(data.users);
        if (data.mealPlans) setMealPlans(data.mealPlans);
        if (data.exercises && data.exercises.length > 0) setExercises(data.exercises);
        if (data.sleepCycles) setSleepCycles(data.sleepCycles);
        if (data.waterLogs) setWaterLogs(data.waterLogs);
        if (data.feedbacks) setFeedbacks(data.feedbacks);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
        if (data.dailyPlanners) setDailyPlanners(data.dailyPlanners);
      } catch (e) {
        console.error('Failed to load data from localStorage', e);
      }
    }
  }, []);

  // User actions
  const addMealPlan = (mealPlan: Omit<MealPlan, 'id'>) => {
    const newMealPlan = { ...mealPlan, id: Date.now().toString() };
    setMealPlans([...mealPlans, newMealPlan]);
  };

  const addSleepCycle = (sleepCycle: Omit<SleepCycle, 'id'>) => {
    const newSleepCycle = { ...sleepCycle, id: Date.now().toString() };
    setSleepCycles([...sleepCycles, newSleepCycle]);
  };

  const updateWaterLog = (userId: string, cups: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = waterLogs.find(log => log.userId === userId && log.date === today);
    
    if (existingLog) {
      setWaterLogs(waterLogs.map(log => 
        log.id === existingLog.id ? { ...log, cups } : log
      ));
    } else {
      const newLog: WaterLog = {
        id: Date.now().toString(),
        userId,
        date: today,
        cups,
        goal: 10,
      };
      setWaterLogs([...waterLogs, newLog]);
    }
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setFeedbacks([...feedbacks, newFeedback]);
    return newFeedback.id;
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setActivityLogs([newLog, ...activityLogs]);
  };

  const addDailyPlanner = (planner: Omit<DailyPlanner, 'id'>) => {
    const newPlanner = { ...planner, id: Date.now().toString() };
    setDailyPlanners([...dailyPlanners, newPlanner]);
  };

  const updateDailyPlannerStatus = (plannerId: string, completed: boolean) => {
    setDailyPlanners(dailyPlanners.map(planner =>
      planner.id === plannerId ? { ...planner, completed } : planner
    ));
  };

  const deleteDailyPlanner = (plannerId: string) => {
    setDailyPlanners(dailyPlanners.filter(planner => planner.id !== plannerId));
  };

  // Admin actions
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUserStatus = (userId: string, isActive: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive } : user
    ));
  };

  const updateFeedbackStatus = (feedbackId: string, status: Feedback['status']) => {
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId ? { ...feedback, status } : feedback
    ));
  };

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = { ...exercise, id: Date.now().toString() };
    setExercises([...exercises, newExercise]);
  };

  // Getters
  const getUserById = (userId: string) => users.find(u => u.id === userId);
  
  const getUserFeedbacks = (userId: string) => 
    feedbacks.filter(f => f.userId === userId);

  const getUserPlanners = (userId: string, date?: string) => {
    const today = date || new Date().toISOString().split('T')[0];
    return dailyPlanners.filter(p => p.userId === userId && p.date === today);
  };
  
  const getPendingFeedbacksCount = () => 
    feedbacks.filter(f => f.status === 'Pending').length;
  
  const getRecentUsers = (count: number) => 
    [...users].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, count);
  
  const getStatistics = () => ({
    totalUsers: users.filter(u => u.role === 'user').length,
    activeUsers: users.filter(u => u.role === 'user' && u.isActive).length,
    totalFeedbacks: feedbacks.length,
    pendingFeedbacks: feedbacks.filter(f => f.status === 'Pending').length,
    totalMealPlans: mealPlans.length,
    totalExercises: exercises.length,
  });

  return (
    <DataContext.Provider value={{
      users,
      mealPlans,
      exercises,
      sleepCycles,
      waterLogs,
      feedbacks,
      activityLogs,
      dailyPlanners,
      addMealPlan,
      addSleepCycle,
      updateWaterLog,
      addFeedback,
      addActivityLog,
      addDailyPlanner,
      updateDailyPlannerStatus,
      deleteDailyPlanner,
      addUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      updateFeedbackStatus,
      addExercise,
      getUserById,
      getUserFeedbacks,
      getUserPlanners,
      getPendingFeedbacksCount,
      getRecentUsers,
      getStatistics,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
