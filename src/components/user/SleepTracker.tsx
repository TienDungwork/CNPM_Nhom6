import { Card } from '../ui/card';
import { Moon, Sun, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sleepData = [
  { day: 'Mon', hours: 7.5, quality: 85 },
  { day: 'Tue', hours: 6.8, quality: 75 },
  { day: 'Wed', hours: 8.2, quality: 90 },
  { day: 'Thu', hours: 7.0, quality: 80 },
  { day: 'Fri', hours: 6.5, quality: 70 },
  { day: 'Sat', hours: 8.5, quality: 95 },
  { day: 'Sun', hours: 7.8, quality: 88 },
];

export function SleepTracker() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Sleep Tracker</h1>
        <p className="text-gray-600">Monitor your sleep patterns and improve your rest quality</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Last Night</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>7.8 hrs</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: '97%' }} />
          </div>
          <p className="text-gray-500 mt-2" style={{ fontSize: '0.75rem' }}>Goal: 8 hours</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Sleep Quality</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>88%</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '88%' }} />
          </div>
          <p className="text-gray-500 mt-2" style={{ fontSize: '0.75rem' }}>Excellent quality</p>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Avg This Week</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>7.5 hrs</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: '94%' }} />
          </div>
          <p className="text-gray-500 mt-2" style={{ fontSize: '0.75rem' }}>Keep it up!</p>
        </Card>
      </div>

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-6" style={{ fontWeight: 600 }}>Weekly Sleep Pattern</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#8B5CF6" name="Sleep Hours" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-4" style={{ fontWeight: 600 }}>Sleep Tips</h3>
        <div className="space-y-3">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-purple-900 mb-1">Maintain a consistent schedule</p>
            <p className="text-purple-700" style={{ fontSize: '0.875rem' }}>Go to bed and wake up at the same time every day</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-blue-900 mb-1">Create a relaxing bedtime routine</p>
            <p className="text-blue-700" style={{ fontSize: '0.875rem' }}>Read, meditate, or take a warm bath before sleep</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-green-900 mb-1">Optimize your sleep environment</p>
            <p className="text-green-700" style={{ fontSize: '0.875rem' }}>Keep your bedroom cool, dark, and quiet</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
