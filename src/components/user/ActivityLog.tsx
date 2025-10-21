import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Activity, Apple, Droplets, Moon } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  type: 'meal' | 'water' | 'exercise' | 'sleep';
  title: string;
  time: string;
  details: string;
  timestamp: string;
}

interface TodaySummary {
  mealsLogged: number;
  waterCups: number;
  workouts: number;
  sleepQuality: number;
  sleepHours: number;
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [summary, setSummary] = useState<TodaySummary>({
    mealsLogged: 0,
    waterCups: 0,
    workouts: 0,
    sleepQuality: 0,
    sleepHours: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivityLog();
  }, []);

  const loadActivityLog = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch today's activity
      const response = await fetch('http://localhost:5000/api/activity/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      // Fetch water intake
      const waterResponse = await fetch('http://localhost:5000/api/activity/water/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const waterData = await waterResponse.json();

      // Build activities list
      const activityList: ActivityItem[] = [];

      // Add meals
      data.meals?.forEach((meal: any) => {
        activityList.push({
          id: `meal-${meal.mealId}`,
          type: 'meal',
          title: `Logged ${meal.name}`,
          time: new Date(meal.loggedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          details: `${meal.calories} calories`,
          timestamp: meal.loggedAt
        });
      });

      // Add exercises
      data.exercises?.forEach((exercise: any) => {
        activityList.push({
          id: `exercise-${exercise.exerciseId}`,
          type: 'exercise',
          title: `Completed ${exercise.title}`,
          time: new Date(exercise.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          details: `${exercise.duration} min, ${exercise.caloriesBurned} cal burned`,
          timestamp: exercise.completedAt
        });
      });

      // Add water logs
      data.water?.forEach((water: any, index: number) => {
        activityList.push({
          id: `water-${index}`,
          type: 'water',
          title: `Drank water`,
          time: new Date(water.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          details: `${water.amountMl} ml`,
          timestamp: water.time
        });
      });

      // Add sleep if available
      if (data.sleep) {
        activityList.push({
          id: 'sleep',
          type: 'sleep',
          title: 'Sleep recorded',
          time: 'Last night',
          details: `${data.sleep.duration} hours (${data.sleep.quality})`,
          timestamp: new Date().toISOString()
        });
      }

      // Sort by timestamp (newest first)
      activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(activityList);

      // Calculate summary
      const sleepQualityPercent = data.sleep ? 
        (data.sleep.quality === 'excellent' ? 95 : 
         data.sleep.quality === 'good' ? 80 : 
         data.sleep.quality === 'fair' ? 60 : 40) : 0;

      setSummary({
        mealsLogged: data.meals?.length || 0,
        waterCups: waterData.totalCups || 0,
        workouts: data.exercises?.length || 0,
        sleepQuality: sleepQualityPercent,
        sleepHours: data.sleep?.duration || 0
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Load activity log error:', error);
      toast.error('Failed to load activity log');
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meal': return { icon: Apple, color: 'text-green-500', bgColor: 'bg-green-50' };
      case 'water': return { icon: Droplets, color: 'text-blue-500', bgColor: 'bg-blue-50' };
      case 'exercise': return { icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' };
      case 'sleep': return { icon: Moon, color: 'text-purple-500', bgColor: 'bg-purple-50' };
      default: return { icon: BookOpen, color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C78C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity log...</p>
        </div>
      </div>
    );
  }
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
              {activities.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No activities logged today</p>
                  <p className="text-sm mt-2">Start by logging a meal or completing a workout!</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const { icon: Icon, color, bgColor } = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontWeight: 600 }} className="mb-1">{activity.title}</p>
                        <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>{activity.details}</p>
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>{activity.time}</span>
                    </div>
                  );
                })
              )}
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
                  <span className="text-green-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.mealsLogged}</span>
                </div>
                <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (summary.mealsLogged / 3) * 100)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900" style={{ fontWeight: 600 }}>Water Cups</span>
                  <span className="text-blue-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.waterCups}</span>
                </div>
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (summary.waterCups / 10) * 100)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-900" style={{ fontWeight: 600 }}>Workouts</span>
                  <span className="text-orange-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.workouts}</span>
                </div>
                <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, summary.workouts * 100)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-900" style={{ fontWeight: 600 }}>Sleep Quality</span>
                  <span className="text-purple-700" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {summary.sleepQuality > 0 ? `${summary.sleepQuality}%` : '--'}
                  </span>
                </div>
                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${summary.sleepQuality}%` }} />
                </div>
                {summary.sleepHours > 0 && (
                  <p className="text-purple-600 text-xs mt-1">{summary.sleepHours} hours</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-0 shadow-md bg-gradient-to-br from-[#00C78C] to-[#00E6A0] text-white">
            <h3 className="mb-2" style={{ fontWeight: 600 }}>
              {summary.mealsLogged >= 3 && summary.waterCups >= 8 && summary.workouts >= 1 
                ? '🎉 Great Progress!' 
                : '💪 Keep Going!'}
            </h3>
            <p style={{ fontSize: '0.875rem' }} className="opacity-90">
              {summary.mealsLogged >= 3 && summary.waterCups >= 8 && summary.workouts >= 1
                ? "You've completed all your daily health goals. Keep up the excellent work!"
                : "You're making progress! Complete more activities to reach your daily goals."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
