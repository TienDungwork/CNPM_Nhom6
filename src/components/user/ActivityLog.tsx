import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Activity, Apple, Droplets, Moon } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'meal',
    title: 'Logged Quinoa Bowl',
    time: '12:30 PM',
    icon: Apple,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    details: '450 calories',
  },
  {
    id: 2,
    type: 'water',
    title: 'Drank 2 cups of water',
    time: '11:45 AM',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    details: 'Hydration goal: 80%',
  },
  {
    id: 3,
    type: 'exercise',
    title: 'Completed HIIT Workout',
    time: '9:00 AM',
    icon: Activity,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    details: '30 min, 400 cal burned',
  },
  {
    id: 4,
    type: 'sleep',
    title: 'Sleep recorded',
    time: 'Yesterday',
    icon: Moon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    details: '7.8 hours',
  },
  {
    id: 5,
    type: 'meal',
    title: 'Logged Greek Yogurt Parfait',
    time: 'Yesterday, 8:00 AM',
    icon: Apple,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    details: '280 calories',
  },
];

export function ActivityLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Activity Log</h1>
        <p className="text-gray-600">Track all your daily health activities in one place</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 rounded-xl border-0 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600 }}>Recent Activities</h3>
              <Badge variant="secondary">Today</Badge>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontWeight: 600 }} className="mb-1">{activity.title}</p>
                    <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>{activity.details}</p>
                  </div>
                  <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-xl border-0 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 style={{ fontWeight: 600 }}>Today's Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-900" style={{ fontWeight: 600 }}>Meals Logged</span>
                  <span className="text-green-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>3</span>
                </div>
                <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900" style={{ fontWeight: 600 }}>Water Cups</span>
                  <span className="text-blue-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>8</span>
                </div>
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-900" style={{ fontWeight: 600 }}>Workouts</span>
                  <span className="text-orange-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>1</span>
                </div>
                <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-900" style={{ fontWeight: 600 }}>Sleep Quality</span>
                  <span className="text-purple-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>88%</span>
                </div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-0 shadow-md bg-gradient-to-br from-[#00C78C] to-[#00E6A0] text-white">
            <h3 className="mb-2" style={{ fontWeight: 600 }}>🎉 Great Progress!</h3>
            <p style={{ fontSize: '0.875rem' }} className="opacity-90">
              You've completed all your daily health goals. Keep up the excellent work!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
