import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dumbbell, Clock, Zap, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useData } from '../DataContext';
import { toast } from 'sonner@2.0.3';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-700';
    case 'Intermediate':
      return 'bg-blue-100 text-blue-700';
    case 'Advanced':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function ExercisePlans() {
  const { exercises } = useData();
  
  const handleStartWorkout = (exerciseTitle: string) => {
    toast.success(`Starting ${exerciseTitle}!`);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Exercise Plans</h1>
        <p className="text-gray-600">Personalized workout routines to reach your fitness goals</p>
      </div>

      {exercises.length === 0 ? (
        <Card className="p-12 rounded-xl border-0 shadow-md text-center">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="mb-2" style={{ fontWeight: 600 }}>No Exercises Available Yet</h3>
          <p className="text-gray-600">Admin is working on adding exercise plans. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
              <div className="relative h-48">
                <ImageWithFallback
                  src={exercise.image}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className={`absolute top-4 right-4 ${getLevelColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </Badge>
              </div>
              
              <div className="p-6">
                <h3 className="mb-2" style={{ fontWeight: 600, fontSize: '1.25rem' }}>{exercise.title}</h3>
                <p className="text-gray-600 mb-4" style={{ fontSize: '0.875rem' }}>{exercise.description}</p>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-blue-900" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exercise.duration} min</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-orange-900" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exercise.caloriesBurned} cal</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-green-900" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exercise.type}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleStartWorkout(exercise.title)}
                  className="w-full py-3 px-4 rounded-lg gradient-primary text-white hover:opacity-90 transition-all"
                >
                  Start Workout
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 style={{ fontWeight: 600 }}>Weekly Progress</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Workouts Completed</p>
            <p className="text-[#00C78C]" style={{ fontSize: '2rem', fontWeight: 700 }}>12</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Minutes</p>
            <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 700 }}>450</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Calories Burned</p>
            <p className="text-orange-600" style={{ fontSize: '2rem', fontWeight: 700 }}>3200</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Current Streak</p>
            <p className="text-purple-600" style={{ fontSize: '2rem', fontWeight: 700 }}>5 days</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
