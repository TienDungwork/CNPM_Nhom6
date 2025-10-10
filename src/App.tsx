import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DashboardHome } from './components/user/DashboardHome';
import { CalorieCalculator } from './components/user/CalorieCalculator';
import { MealSuggestions } from './components/user/MealSuggestions';
import { ExercisePlans } from './components/user/ExercisePlans';
import { SleepTracker } from './components/user/SleepTracker';
import { WaterReminder } from './components/user/WaterReminder';
import { ActivityLog } from './components/user/ActivityLog';
import { Chatbot } from './components/user/Chatbot';
import { Feedback } from './components/user/Feedback';
import { AdminHome } from './components/admin/AdminHome';
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
      
      {/* User Routes */}
      <Route path="/user" element={
        <ProtectedRoute requiredRole="user">
          <UserDashboard />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="nutrition/calorie-calculator" element={<CalorieCalculator />} />
        <Route path="nutrition/meal-suggestions" element={<MealSuggestions />} />
        <Route path="fitness/exercise-plans" element={<ExercisePlans />} />
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
        <Route path="users" element={
          <div className="text-center py-12 text-gray-500">
            <p style={{ fontSize: '1.25rem' }}>User Management</p>
            <p className="mt-2">User management features will be displayed here</p>
          </div>
        } />
        <Route path="content" element={
          <div className="text-center py-12 text-gray-500">
            <p style={{ fontSize: '1.25rem' }}>Content Management</p>
            <p className="mt-2">Content management features will be displayed here</p>
          </div>
        } />
        <Route path="feedback" element={
          <div className="text-center py-12 text-gray-500">
            <p style={{ fontSize: '1.25rem' }}>Feedback Review</p>
            <p className="mt-2">User feedback review features will be displayed here</p>
          </div>
        } />
        <Route path="statistics" element={
          <div className="text-center py-12 text-gray-500">
            <p style={{ fontSize: '1.25rem' }}>Statistics Overview</p>
            <p className="mt-2">Detailed statistics and analytics will be displayed here</p>
          </div>
        } />
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
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}
