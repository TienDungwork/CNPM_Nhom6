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

export interface Meal {
  id: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  source: 'admin' | 'user';
  creatorId?: string;
  status: 'public' | 'hidden' | 'pending';
}

export interface UserMeal {
  id: string;
  userId: string;
  baseMealId?: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  source: 'copy' | 'custom';
  createdAt: string;
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
  muscleGroup: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurned: number;
  image: string;
  description: string;
  steps: string[];
  source: 'admin' | 'user';
  creatorId?: string;
  status: 'public' | 'hidden' | 'pending';
}

export interface UserExercise {
  id: string;
  userId: string;
  baseExerciseId?: string;
  title: string;
  muscleGroup: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurned: number;
  image: string;
  description: string;
  steps: string[];
  source: 'copy' | 'custom';
  createdAt: string;
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
  meals: Meal[];
  userMeals: UserMeal[];
  exercises: Exercise[];
  userExercises: UserExercise[];
  mealPlans: MealPlan[];
  sleepCycles: SleepCycle[];
  waterLogs: WaterLog[];
  feedbacks: Feedback[];
  activityLogs: ActivityLog[];
  dailyPlanners: DailyPlanner[];
  
  // User actions - Meals
  addUserMeal: (meal: Omit<UserMeal, 'id' | 'createdAt'>) => void;
  updateUserMeal: (mealId: string, updates: Partial<UserMeal>) => void;
  deleteUserMeal: (mealId: string) => void;
  copyMealToUser: (userId: string, mealId: string) => void;
  
  // User actions - Exercises
  addUserExercise: (exercise: Omit<UserExercise, 'id' | 'createdAt'>) => void;
  updateUserExercise: (exerciseId: string, updates: Partial<UserExercise>) => void;
  deleteUserExercise: (exerciseId: string) => void;
  copyExerciseToUser: (userId: string, exerciseId: string) => void;
  
  // User actions - Other
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
  
  // Admin - Meals
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (mealId: string, updates: Partial<Meal>) => void;
  deleteMeal: (mealId: string) => void;
  
  // Admin - Exercises
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
  deleteExercise: (exerciseId: string) => void;
  
  // Getters
  getUserById: (userId: string) => User | undefined;
  getUserFeedbacks: (userId: string) => Feedback[];
  getUserPlanners: (userId: string, date?: string) => DailyPlanner[];
  getUserMeals: (userId: string) => UserMeal[];
  getUserExercises: (userId: string) => UserExercise[];
  getPendingFeedbacksCount: () => number;
  getRecentUsers: (count: number) => User[];
  getStatistics: () => {
    totalUsers: number;
    activeUsers: number;
    totalFeedbacks: number;
    pendingFeedbacks: number;
    totalMeals: number;
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

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Quinoa Buddha Bowl',
      calories: 450,
      type: 'lunch',
      protein: 18,
      carbs: 62,
      fat: 12,
      image: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?w=400',
      ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Spinach', 'Cherry tomatoes', 'Olive oil', 'Lemon'],
      steps: ['Cook quinoa according to package', 'Roast chickpeas with spices', 'Prepare vegetables', 'Assemble bowl with all ingredients', 'Drizzle with olive oil and lemon'],
      prepTime: 25,
      source: 'admin',
      status: 'public',
    },
    {
      id: '2',
      name: 'Overnight Oats with Berries',
      calories: 320,
      type: 'breakfast',
      protein: 12,
      carbs: 48,
      fat: 8,
      image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400',
      ingredients: ['Oats', 'Almond milk', 'Blueberries', 'Strawberries', 'Honey', 'Chia seeds', 'Almonds'],
      steps: ['Mix oats with almond milk', 'Add chia seeds and honey', 'Refrigerate overnight', 'Top with fresh berries and almonds'],
      prepTime: 5,
      source: 'admin',
      status: 'public',
    },
    {
      id: '3',
      name: 'Grilled Chicken & Vegetables',
      calories: 520,
      type: 'dinner',
      protein: 45,
      carbs: 32,
      fat: 18,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      ingredients: ['Chicken breast', 'Broccoli', 'Bell peppers', 'Zucchini', 'Olive oil', 'Garlic', 'Herbs'],
      steps: ['Marinate chicken with herbs and garlic', 'Grill chicken until cooked', 'Sauté vegetables', 'Serve together'],
      prepTime: 30,
      source: 'admin',
      status: 'public',
    },
    {
      id: '4',
      name: 'Greek Yogurt Parfait',
      calories: 280,
      type: 'snack',
      protein: 20,
      carbs: 35,
      fat: 6,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      ingredients: ['Greek yogurt', 'Granola', 'Mixed berries', 'Honey', 'Walnuts'],
      steps: ['Layer yogurt in glass', 'Add granola and berries', 'Drizzle with honey', 'Top with walnuts'],
      prepTime: 5,
      source: 'admin',
      status: 'public',
    },
  ]);
  const [userMeals, setUserMeals] = useState<UserMeal[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      title: 'Full Body Strength',
      muscleGroup: 'Full Body',
      duration: 45,
      difficulty: 'Intermediate',
      caloriesBurned: 320,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      description: 'Complete workout targeting all major muscle groups with compound movements',
      steps: ['Warm up for 5 minutes', 'Perform 10 squats', 'Do 10 push-ups', 'Complete 10 lunges each leg', 'Rest 60 seconds', 'Repeat for 3 sets', 'Cool down and stretch'],
      source: 'admin',
      status: 'public',
    },
    {
      id: '2',
      title: 'Morning Yoga Flow',
      muscleGroup: 'Flexibility',
      duration: 20,
      difficulty: 'Beginner',
      caloriesBurned: 80,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      description: 'Gentle yoga sequence to start your day with energy and flexibility',
      steps: ['Begin in mountain pose', 'Sun salutation A', 'Warrior sequence', 'Triangle pose', 'Seated forward fold', 'Finish with savasana'],
      source: 'admin',
      status: 'public',
    },
    {
      id: '3',
      title: 'HIIT Cardio Blast',
      muscleGroup: 'Cardio',
      duration: 30,
      difficulty: 'Advanced',
      caloriesBurned: 450,
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400',
      description: 'High-intensity interval training for maximum calorie burn',
      steps: ['Warm up jogging', '30sec burpees', '30sec rest', '30sec jump squats', '30sec rest', '30sec mountain climbers', 'Repeat 5 rounds', 'Cool down'],
      source: 'admin',
      status: 'public',
    },
    {
      id: '4',
      title: 'Core Strengthening',
      muscleGroup: 'Core',
      duration: 15,
      difficulty: 'Beginner',
      caloriesBurned: 100,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      description: 'Focused ab workout for building core strength',
      steps: ['Plank hold 30 seconds', 'Crunches 15 reps', 'Bicycle crunches 20 reps', 'Leg raises 10 reps', 'Rest 30 seconds', 'Repeat 3 times'],
      source: 'admin',
      status: 'public',
    },
  ]);
  const [userExercises, setUserExercises] = useState<UserExercise[]>([]);
  
  const [sleepCycles, setSleepCycles] = useState<SleepCycle[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dailyPlanners, setDailyPlanners] = useState<DailyPlanner[]>([]);

  // Persist to localStorage
  useEffect(() => {
    const data = {
      users,
      meals,
      userMeals,
      exercises,
      userExercises,
      mealPlans,
      sleepCycles,
      waterLogs,
      feedbacks,
      activityLogs,
      dailyPlanners,
    };
    localStorage.setItem('healthyColorsData', JSON.stringify(data));
  }, [users, meals, userMeals, exercises, userExercises, mealPlans, sleepCycles, waterLogs, feedbacks, activityLogs, dailyPlanners]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('healthyColorsData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.users) setUsers(data.users);
        if (data.meals && data.meals.length > 0) setMeals(data.meals);
        if (data.userMeals) setUserMeals(data.userMeals);
        if (data.exercises && data.exercises.length > 0) setExercises(data.exercises);
        if (data.userExercises) setUserExercises(data.userExercises);
        if (data.mealPlans) setMealPlans(data.mealPlans);
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

  // User Meal actions
  const addUserMeal = (meal: Omit<UserMeal, 'id' | 'createdAt'>) => {
    const newMeal: UserMeal = {
      ...meal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUserMeals([...userMeals, newMeal]);
  };

  const updateUserMeal = (mealId: string, updates: Partial<UserMeal>) => {
    setUserMeals(userMeals.map(meal =>
      meal.id === mealId ? { ...meal, ...updates } : meal
    ));
  };

  const deleteUserMeal = (mealId: string) => {
    setUserMeals(userMeals.filter(meal => meal.id !== mealId));
  };

  const copyMealToUser = (userId: string, mealId: string) => {
    const baseMeal = meals.find(m => m.id === mealId);
    if (!baseMeal) return;

    const userMeal: Omit<UserMeal, 'id' | 'createdAt'> = {
      userId,
      baseMealId: mealId,
      name: baseMeal.name,
      calories: baseMeal.calories,
      type: baseMeal.type,
      protein: baseMeal.protein,
      carbs: baseMeal.carbs,
      fat: baseMeal.fat,
      image: baseMeal.image,
      ingredients: [...baseMeal.ingredients],
      steps: [...baseMeal.steps],
      prepTime: baseMeal.prepTime,
      source: 'copy',
    };

    addUserMeal(userMeal);
  };

  // User Exercise actions
  const addUserExercise = (exercise: Omit<UserExercise, 'id' | 'createdAt'>) => {
    const newExercise: UserExercise = {
      ...exercise,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUserExercises([...userExercises, newExercise]);
  };

  const updateUserExercise = (exerciseId: string, updates: Partial<UserExercise>) => {
    setUserExercises(userExercises.map(ex =>
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    ));
  };

  const deleteUserExercise = (exerciseId: string) => {
    setUserExercises(userExercises.filter(ex => ex.id !== exerciseId));
  };

  const copyExerciseToUser = (userId: string, exerciseId: string) => {
    const baseExercise = exercises.find(e => e.id === exerciseId);
    if (!baseExercise) return;

    const userExercise: Omit<UserExercise, 'id' | 'createdAt'> = {
      userId,
      baseExerciseId: exerciseId,
      title: baseExercise.title,
      muscleGroup: baseExercise.muscleGroup,
      duration: baseExercise.duration,
      difficulty: baseExercise.difficulty,
      caloriesBurned: baseExercise.caloriesBurned,
      image: baseExercise.image,
      description: baseExercise.description,
      steps: [...baseExercise.steps],
      source: 'copy',
    };

    addUserExercise(userExercise);
  };

  // Admin Meal actions
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = { ...meal, id: Date.now().toString() };
    setMeals([...meals, newMeal]);
  };

  const updateMeal = (mealId: string, updates: Partial<Meal>) => {
    setMeals(meals.map(meal =>
      meal.id === mealId ? { ...meal, ...updates } : meal
    ));
  };

  const deleteMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  // Admin Exercise actions
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = { ...exercise, id: Date.now().toString() };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    ));
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  // Getters
  const getUserById = (userId: string) => users.find(u => u.id === userId);
  
  const getUserFeedbacks = (userId: string) => 
    feedbacks.filter(f => f.userId === userId);

  const getUserPlanners = (userId: string, date?: string) => {
    const today = date || new Date().toISOString().split('T')[0];
    return dailyPlanners.filter(p => p.userId === userId && p.date === today);
  };

  const getUserMeals = (userId: string) =>
    userMeals.filter(m => m.userId === userId);

  const getUserExercises = (userId: string) =>
    userExercises.filter(e => e.userId === userId);
  
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
    totalMeals: meals.length + userMeals.length,
    totalExercises: exercises.length + userExercises.length,
  });

  return (
    <DataContext.Provider value={{
      users,
      meals,
      userMeals,
      exercises,
      userExercises,
      mealPlans,
      sleepCycles,
      waterLogs,
      feedbacks,
      activityLogs,
      dailyPlanners,
      // User Meal actions
      addUserMeal,
      updateUserMeal,
      deleteUserMeal,
      copyMealToUser,
      // User Exercise actions
      addUserExercise,
      updateUserExercise,
      deleteUserExercise,
      copyExerciseToUser,
      // Other user actions
      addMealPlan,
      addSleepCycle,
      updateWaterLog,
      addFeedback,
      addActivityLog,
      addDailyPlanner,
      updateDailyPlannerStatus,
      deleteDailyPlanner,
      // Admin actions
      addUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      updateFeedbackStatus,
      addMeal,
      updateMeal,
      deleteMeal,
      addExercise,
      updateExercise,
      deleteExercise,
      // Getters
      getUserById,
      getUserFeedbacks,
      getUserPlanners,
      getUserMeals,
      getUserExercises,
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
