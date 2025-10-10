import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Droplets, Plus, Minus, Award } from 'lucide-react';

export function WaterReminder() {
  const [cupsToday, setCupsToday] = useState(8);
  const goal = 10;
  const percentage = Math.min((cupsToday / goal) * 100, 100);

  const addCup = () => setCupsToday(Math.min(cupsToday + 1, 20));
  const removeCup = () => setCupsToday(Math.max(cupsToday - 1, 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Water Reminder</h1>
        <p className="text-gray-600">Stay hydrated throughout the day for optimal health</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 rounded-xl border-0 shadow-md">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            
            <p className="text-gray-600 mb-2">Today's Progress</p>
            <p style={{ fontSize: '3rem', fontWeight: 700 }} className="text-blue-600">
              {cupsToday}/{goal}
            </p>
            <p className="text-gray-600">cups of water</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={removeCup}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <Button
              onClick={addCup}
              className="w-32 h-12 rounded-full gradient-primary text-white border-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Cup
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 rounded-xl border-0 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 style={{ fontWeight: 600 }}>Your Streak</h3>
            </div>
            <div className="text-center py-6">
              <p className="text-blue-600" style={{ fontSize: '3rem', fontWeight: 700 }}>7</p>
              <p className="text-gray-600">days reaching your goal</p>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-0 shadow-md">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>Hydration Reminders</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900" style={{ fontWeight: 600 }}>Morning</span>
                <span className="text-blue-700">8:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900" style={{ fontWeight: 600 }}>Midday</span>
                <span className="text-blue-700">12:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900" style={{ fontWeight: 600 }}>Afternoon</span>
                <span className="text-blue-700">3:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900" style={{ fontWeight: 600 }}>Evening</span>
                <span className="text-blue-700">6:00 PM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-4" style={{ fontWeight: 600 }}>Benefits of Staying Hydrated</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-blue-900 mb-2">💪 Boosts Energy</p>
            <p className="text-blue-700" style={{ fontSize: '0.875rem' }}>Prevents fatigue and improves physical performance</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-green-900 mb-2">🧠 Enhances Focus</p>
            <p className="text-green-700" style={{ fontSize: '0.875rem' }}>Improves concentration and cognitive function</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p style={{ fontWeight: 600 }} className="text-purple-900 mb-2">✨ Healthy Skin</p>
            <p className="text-purple-700" style={{ fontSize: '0.875rem' }}>Keeps skin hydrated and radiant</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
