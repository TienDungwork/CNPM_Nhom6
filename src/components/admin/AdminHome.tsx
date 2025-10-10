import { Card } from '../ui/card';
import { Users, FileText, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 185 },
  { month: 'Mar', users: 250 },
  { month: 'Apr', users: 340 },
  { month: 'May', users: 420 },
  { month: 'Jun', users: 520 },
];

const activityData = [
  { day: 'Mon', activities: 850 },
  { day: 'Tue', activities: 920 },
  { day: 'Wed', activities: 780 },
  { day: 'Thu', activities: 1100 },
  { day: 'Fri', activities: 950 },
  { day: 'Sat', activities: 1200 },
  { day: 'Sun', activities: 980 },
];

export function AdminHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Admin Overview</h1>
        <p className="text-gray-600">Monitor and manage your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>+12%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Users</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>520</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>45 new this week</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>+8%</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Active Today</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>342</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>66% engagement rate</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>124</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Content Items</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>856</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Meals, exercises, articles</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600" style={{ fontSize: '0.875rem', fontWeight: 600 }}>18 new</span>
          </div>
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Feedback</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>127</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>12 pending review</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Recent Activity */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-6" style={{ fontWeight: 600 }}>Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 600 }}>New user registration</p>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>user@example.com joined the platform</p>
            </div>
            <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>5 min ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 600 }}>New feedback submitted</p>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Feature request: Dark mode</p>
            </div>
            <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>12 min ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p style={{ fontWeight: 600 }}>Content updated</p>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>New meal plan added to library</p>
            </div>
            <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>1 hour ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
