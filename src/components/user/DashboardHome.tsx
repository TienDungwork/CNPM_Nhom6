import { Card } from '../ui/card';
import { Activity, Apple, Droplets, Moon, Flame, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const calorieData = [
  { name: 'Consumed', value: 1650, color: '#00C78C' },
  { name: 'Remaining', value: 350, color: '#E5E7EB' },
];

const weeklyActivityData = [
  { day: 'Mon', calories: 1800, water: 8 },
  { day: 'Tue', calories: 2000, water: 7 },
  { day: 'Wed', calories: 1900, water: 9 },
  { day: 'Thu', calories: 2100, water: 8 },
  { day: 'Fri', calories: 1850, water: 10 },
  { day: 'Sat', calories: 2200, water: 6 },
  { day: 'Sun', calories: 1950, water: 8 },
];

export function DashboardHome() {
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
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>+5%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Calories Today</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>1,650</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: 2,000 kcal</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>80%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Water Intake</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>8 cups</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: 10 cups</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <span className="text-purple-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Good</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Sleep Duration</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>7.5 hrs</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: 8 hours</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>+12%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Active Minutes</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>45 min</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Goal: 60 minutes</p>
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
                <div className="w-3 h-3 rounded-full bg-[#00C78C]" />
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Consumed</span>
              </div>
              <p style={{ fontWeight: 600 }}>1,650 kcal</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Remaining</span>
              </div>
              <p style={{ fontWeight: 600 }}>350 kcal</p>
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
          <button className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left">
            <Apple className="w-6 h-6 text-[#00C78C] mb-2" />
            <p style={{ fontWeight: 600 }}>Log Meal</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Track your food intake</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left">
            <Droplets className="w-6 h-6 text-blue-500 mb-2" />
            <p style={{ fontWeight: 600 }}>Log Water</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Record water intake</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#00C78C] transition-all text-left">
            <Activity className="w-6 h-6 text-orange-500 mb-2" />
            <p style={{ fontWeight: 600 }}>Start Workout</p>
            <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Begin exercise session</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
