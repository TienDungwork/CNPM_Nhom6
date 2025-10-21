import { Card } from '../ui/card';
import { Activity, Apple, Droplets, Moon, Flame, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface TodayActivity {
  date: string;
  meals: Array<{ mealId: string; name: string; calories: number; type: string; loggedAt: string }>;
  exercises: Array<{ exerciseId: string; title: string; duration: number; caloriesBurned: number; completedAt: string }>;
  sleep: { duration: number; quality: string } | null;
  water: Array<{ amountMl: number; time: string }>;
}

interface WeeklyData {
  date: string;
  calories: number;
  water: number;
}

export function DashboardHome() {
  const [todayActivity, setTodayActivity] = useState<TodayActivity | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [waterToday, setWaterToday] = useState({ totalMl: 0, totalCups: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default
  const waterGoal = 10; // cups

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile to get calorie goal
      const profileResponse = await fetch('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileResponse.json();
      if (profileData.hasProfile) {
        setCalorieGoal(profileData.profile.calorieGoal);
      }
      
      // Fetch today's activity
      const todayResponse = await fetch('http://localhost:5000/api/activity/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const today = await todayResponse.json();
      setTodayActivity(today);

      // Fetch weekly data
      const weeklyResponse = await fetch('http://localhost:5000/api/activity/weekly', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const weekly = await weeklyResponse.json();
      setWeeklyData(weekly.weeklyData || []);

      // Fetch water intake
      const waterResponse = await fetch('http://localhost:5000/api/activity/water/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const water = await waterResponse.json();
      setWaterToday(water);

      setIsLoading(false);
    } catch (error) {
      console.error('Load dashboard error:', error);
      setIsLoading(false);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleLogWater = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/activity/log-water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amountMl: 250 }) // 1 cup = 250ml
      });
      
      toast.success('💧 Water logged! (1 cup)');
      await loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Log water error:', error);
      toast.error('Failed to log water');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C78C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats from real data
  const totalCaloriesConsumed = todayActivity?.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  const totalCaloriesBurned = todayActivity?.exercises?.reduce((sum, ex) => sum + ex.caloriesBurned, 0) || 0;
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;
  const remainingCalories = Math.max(0, calorieGoal - netCalories);
  const calorieProgress = Math.round((netCalories / calorieGoal) * 100);
  
  const waterProgress = Math.round((waterToday?.totalCups || 0) / waterGoal * 100);
  
  const totalActiveMinutes = todayActivity?.exercises?.reduce((sum, ex) => sum + ex.duration, 0) || 0;
  const activeMinutesGoal = 60;
  const activeProgress = Math.round((totalActiveMinutes / activeMinutesGoal) * 100);

  const calorieData = [
    { name: 'Net Calories', value: Math.max(0, netCalories), color: '#00C78C' },
    { name: 'Remaining', value: remainingCalories, color: '#E5E7EB' },
  ];

  // Format weekly data for chart
  const weeklyActivityData = weeklyData.map(day => ({
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: day.calories,
    water: day.water
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Welcome back!</h1>
        <p className="text-gray-600">Here's your health summary for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C78C] to-[#00E6A0] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {calorieProgress > 100 ? `+${calorieProgress - 100}%` : `${calorieProgress}%`}
            </span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Net Calories Today</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{netCalories.toLocaleString()}</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>
            Goal: {calorieGoal.toLocaleString()} kcal
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-green-600">+{totalCaloriesConsumed}</span>
            <span className="text-gray-400">→</span>
            <span className="text-orange-600">-{totalCaloriesBurned}</span>
          </div>
        </Card>
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{waterProgress}%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Water Intake</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{waterToday.totalCups} cups</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: {waterGoal} cups</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <span className="text-purple-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {todayActivity?.sleep ? 'Good' : 'No data'}
            </span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Sleep Duration</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>
            {todayActivity?.sleep?.duration || 0} hrs
          </p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: 8 hours</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {activeProgress}%
            </span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Active Minutes</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{totalActiveMinutes} min</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: {activeMinutesGoal} minutes</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Chart */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C78C] to-[#00E6A0] flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Daily Calories</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Today's intake progress</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={calorieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {calorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Consumed</span>
              </div>
              <p style={{ fontWeight: 600 }} className="text-green-600">{totalCaloriesConsumed} kcal</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Burned</span>
              </div>
              <p style={{ fontWeight: 600 }} className="text-orange-600">{totalCaloriesBurned} kcal</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-[#00C78C]" />
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Net</span>
              </div>
              <p style={{ fontWeight: 600 }} className="text-[#00C78C]">{netCalories} kcal</p>
            </div>
          </div>
        </Card>

        {/* Weekly Activity Chart */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Weekly Progress</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Last 7 days activity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="water" fill="#3B82F6" name="Water (cups)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-4" style={{ fontWeight: 600 }}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left"
            onClick={() => window.location.href = '#/user/meals'}
          >
            <Apple className="w-6 h-6 text-[#00C78C] mb-2" />
            <p style={{ fontWeight: 600 }}>Log Meal</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Track your food intake</p>
          </button>
          <button 
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left"
            onClick={handleLogWater}
          >
            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
            <p style={{ fontWeight: 600 }}>Log Water</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Record water intake (1 cup)</p>
          </button>
          <button 
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left"
            onClick={() => window.location.href = '#/user/exercises'}
          >
            <Activity className="w-6 h-6 text-orange-500 mb-2" />
            <p style={{ fontWeight: 600 }}>Start Workout</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Begin exercise session</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
