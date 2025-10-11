import { Card } from '../ui/card';
import { useData } from '../DataContext';
import { Users, Activity, MessageSquare, FileText, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function Statistics() {
  const { getStatistics, users, feedbacks, waterLogs, sleepCycles } = useData();
  const stats = getStatistics();

  // User growth simulation
  const userGrowthData = [
    { month: 'Jan', users: 50 },
    { month: 'Feb', users: 75 },
    { month: 'Mar', users: 120 },
    { month: 'Apr', users: 185 },
    { month: 'May', users: 280 },
    { month: 'Jun', users: stats.totalUsers },
  ];

  // Feedback categories
  const feedbackCategories = [
    { name: 'Feature', value: feedbacks.filter(f => f.category === 'feature').length, color: '#00C78C' },
    { name: 'Bug', value: feedbacks.filter(f => f.category === 'bug').length, color: '#EF4444' },
    { name: 'Improvement', value: feedbacks.filter(f => f.category === 'improvement').length, color: '#3B82F6' },
    { name: 'General', value: feedbacks.filter(f => f.category === 'general').length, color: '#8B5CF6' },
    { name: 'Other', value: feedbacks.filter(f => f.category === 'other').length, color: '#F59E0B' },
  ].filter(cat => cat.value > 0);

  // Activity data
  const activityData = [
    { day: 'Mon', activities: 45 },
    { day: 'Tue', activities: 52 },
    { day: 'Wed', activities: 38 },
    { day: 'Thu', activities: 61 },
    { day: 'Fri', activities: 48 },
    { day: 'Sat', activities: 70 },
    { day: 'Sun', activities: 55 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Statistics Overview</h1>
        <p className="text-gray-600">Detailed analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              +{Math.round((stats.totalUsers / 50 - 1) * 100)}%
            </span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Users</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{stats.totalUsers}</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>
            {stats.activeUsers} active users
          </p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Engagement Rate</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>
            {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
          </p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Users using the platform</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {stats.pendingFeedbacks} new
            </span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Feedback</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{stats.totalFeedbacks}</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>User suggestions & reports</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Library</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Content Items</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{stats.totalExercises + 24}</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>
            {stats.totalExercises} exercises, 24 meals
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C78C] to-[#00E6A0] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>User Growth</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#00C78C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Activity */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Weekly Activity</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>User actions per day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activities" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Feedback Distribution & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Categories */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Feedback Distribution</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>By category</p>
            </div>
          </div>
          
          {feedbackCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={feedbackCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {feedbackCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {feedbackCategories.map((cat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                      {cat.name}: {cat.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p style={{ fontSize: '0.875rem' }}>No feedback data yet</p>
            </div>
          )}
        </Card>

        {/* Recent Users */}
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Recent Registrations</h3>
              <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Latest users</p>
            </div>
          </div>

          <div className="space-y-3">
            {users.filter(u => u.role === 'user').slice(-5).reverse().map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p style={{ fontWeight: 600 }}>{user.name}</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>{user.email}</p>
                </div>
                <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
