import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DataProvider } from './components/DataContext';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DashboardHome } from './components/user/DashboardHome';
import { DailyPlanner } from './components/user/DailyPlanner';
import { CalorieCalculator } from './components/user/CalorieCalculator';
import { MealSuggestionsNew } from './components/user/MealSuggestionsNew';
import { ExercisePlansNew } from './components/user/ExercisePlansNew';
import { SleepTracker } from './components/user/SleepTracker';
import { WaterReminder } from './components/user/WaterReminder';
import { ActivityLog } from './components/user/ActivityLog';
import { Chatbot } from './components/user/Chatbot';
import { Feedback } from './components/user/Feedback';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { AdminHome } from './components/admin/AdminHome';
import { UserManagement } from './components/admin/UserManagement';
import { ContentManagement } from './components/admin/ContentManagement';
import { MealManagement } from './components/admin/MealManagement';
import { ExerciseManagement } from './components/admin/ExerciseManagement';
import { FeedbackReview } from './components/admin/FeedbackReview';
import { Statistics } from './components/admin/Statistics';
import { ProjectReview } from './components/ProjectReview';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'user' | 'admin' }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/project-review" element={<ProjectReview />} />
      
      {/* User Routes */}
      <Route path="/user" element={
        <ProtectedRoute requiredRole="user">
          <UserDashboard />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="planner" element={<DailyPlanner />} />
        <Route path="nutrition/calorie-calculator" element={<CalorieCalculator />} />
        <Route path="nutrition/meal-suggestions" element={<MealSuggestionsNew />} />
        <Route path="fitness/exercise-plans" element={<ExercisePlansNew />} />
        <Route path="wellness/sleep-tracker" element={<SleepTracker />} />
        <Route path="wellness/water-reminder" element={<WaterReminder />} />
        <Route path="wellness/activity-log" element={<ActivityLog />} />
        <Route path="assistant/chatbot" element={<Chatbot />} />
        <Route path="feedback" element={<Feedback />} />
        <Route index element={<Navigate to="/user/dashboard" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="meal-management" element={<MealManagement />} />
        <Route path="exercise-management" element={<ExerciseManagement />} />
        <Route path="feedback" element={<FeedbackReview />} />
        <Route path="statistics" element={<Statistics />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
