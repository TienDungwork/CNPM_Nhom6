import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Dumbbell, Clock, Flame, Plus, Edit2, Trash2, Play, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  muscleGroup: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurned: number;
  image: string;
  description: string;
  steps: string[];
  source: 'admin' | 'copy' | 'custom';
  createdAt?: string;
}

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

export function ExercisePlansNew() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    muscleGroup: '',
    duration: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    caloriesBurned: '',
    description: '',
    steps: '',
  });

  // Fetch exercises from API
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exercises/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load exercises');
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Load exercises error:', error);
      toast.error('Failed to load exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const publicExercises = exercises.filter(e => e.source === 'admin');
  const myExercises = exercises.filter(e => e.source === 'copy' || e.source === 'custom');

  const handleViewDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailsDialog(true);
  };

  const handleAddToMyExercises = async (exercise: Exercise) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exercises/copy/${exercise.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add exercise');
      }

      toast.success(`Added "${exercise.title}" to My Exercises!`);
      await loadExercises();
    } catch (error) {
      console.error('Add exercise error:', error);
      toast.error('Failed to add exercise');
    }
  };

  const handleAddCustomExercise = async () => {
    if (!formData.title || !formData.duration) {
      toast.error('Please fill in title and duration!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exercises', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          muscleGroup: formData.muscleGroup,
          duration: parseInt(formData.duration),
          difficulty: formData.difficulty,
          caloriesBurned: parseInt(formData.caloriesBurned) || 100,
          description: formData.description,
          stepsJson: JSON.stringify(formData.steps.split('\n').filter(s => s.trim())),
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create exercise');
      }

      toast.success('Exercise created successfully!');
      setShowAddDialog(false);
      setFormData({
        title: '',
        muscleGroup: '',
        duration: '',
        difficulty: 'Beginner',
        caloriesBurned: '',
        description: '',
        steps: '',
      });
      await loadExercises();
    } catch (error) {
      console.error('Create exercise error:', error);
      toast.error('Failed to create exercise');
    }
  };

  const handleEditExercise = async () => {
    if (!editingExercise) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exercises/${editingExercise.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          muscleGroup: formData.muscleGroup,
          duration: parseInt(formData.duration),
          difficulty: formData.difficulty,
          caloriesBurned: parseInt(formData.caloriesBurned) || 100,
          description: formData.description,
          stepsJson: JSON.stringify(formData.steps.split('\n').filter(s => s.trim()))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update exercise');
      }

      toast.success('Exercise updated!');
      setShowEditDialog(false);
      setEditingExercise(null);
      await loadExercises();
    } catch (error) {
      console.error('Update exercise error:', error);
      toast.error('Failed to update exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId: string, exerciseTitle: string) => {
    if (!window.confirm(`Delete "${exerciseTitle}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      toast.success('Exercise deleted');
      await loadExercises();
    } catch (error) {
      console.error('Delete exercise error:', error);
      toast.error('Failed to delete exercise');
    }
  };

  const handleStartWorkout = async (exercise: Exercise) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/activity/log-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
          title: exercise.title,
          duration: exercise.duration,
          caloriesBurned: exercise.caloriesBurned
        })
      });

      if (!response.ok) throw new Error('Failed to log exercise');
      
      toast.success(`✅ Completed ${exercise.title}! Great work! 💪`);
      setShowDetailsDialog(false);
    } catch (error) {
      console.error('Log exercise error:', error);
      toast.error('Failed to log exercise. Please try again.');
    }
  };

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      muscleGroup: exercise.muscleGroup,
      duration: exercise.duration.toString(),
      difficulty: exercise.difficulty,
      caloriesBurned: exercise.caloriesBurned.toString(),
      description: exercise.description,
      steps: exercise.steps.join('\n'),
    });
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C78C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercises...</p>
        </div>
      </div>
    );
  }

  const ExerciseCard = ({ exercise, showActions = false }: { exercise: Exercise; showActions?: boolean }) => (
    <Card className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
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
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-orange-900" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exercise.caloriesBurned} cal</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Dumbbell className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-green-900" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exercise.muscleGroup}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 gradient-primary text-white border-0"
            onClick={() => handleStartWorkout(exercise)}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Workout
          </Button>
          <Button
            variant="outline"
            onClick={() => handleViewDetails(exercise)}
          >
            Details
          </Button>
        </div>

        {!showActions ? (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => handleAddToMyExercises(exercise)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to My Exercises
          </Button>
        ) : (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openEditDialog(exercise)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={() => handleDeleteExercise(exercise.id, exercise.title)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Exercise Plans</h1>
          <p className="text-gray-600">Personalized workout routines to reach your fitness goals</p>
        </div>
        <Button
          className="gradient-primary text-white border-0"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Exercise
        </Button>
      </div>

      <Tabs defaultValue="public" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="public">Public Exercises ({publicExercises.length})</TabsTrigger>
          <TabsTrigger value="my">My Exercises ({myExercises.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="space-y-4">
          {publicExercises.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>No Public Exercises</h3>
              <p className="text-gray-600">Admin hasn't added any exercises yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          {myExercises.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>No Exercises Yet</h3>
              <p className="text-gray-600 mb-4">Add exercises from public tab or create your own</p>
              <Button
                className="gradient-primary text-white border-0"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Exercise
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} showActions={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Weekly Progress Card */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 style={{ fontWeight: 600 }}>Your Progress</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Available Exercises</p>
            <p className="text-[#00C78C]" style={{ fontSize: '2rem', fontWeight: 700 }}>{exercises.length}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>My Custom</p>
            <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 700 }}>{myExercises.length}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Avg Duration</p>
            <p className="text-orange-600" style={{ fontSize: '2rem', fontWeight: 700 }}>
              {exercises.length > 0 ? Math.round(exercises.reduce((sum, e) => sum + e.duration, 0) / exercises.length) : 0} min
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Calories</p>
            <p className="text-green-600" style={{ fontSize: '2rem', fontWeight: 700 }}>
              {exercises.reduce((sum, e) => sum + e.caloriesBurned, 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.title}</DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-4">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedExercise.image}
                  alt={selectedExercise.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{selectedExercise.duration} min</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-semibold">{selectedExercise.caloriesBurned} cal</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Dumbbell className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="font-semibold">{selectedExercise.difficulty}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{selectedExercise.description}</p>
              </div>

              {selectedExercise.steps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Exercise Steps</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedExercise.steps.map((step, index) => (
                      <li key={index} className="text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <Button
                className="w-full gradient-primary text-white border-0"
                onClick={() => {
                  handleStartWorkout(selectedExercise);
                  setShowDetailsDialog(false);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start This Workout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open: boolean) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? 'Add Custom Exercise' : 'Edit Exercise'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Exercise Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Yoga"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="muscleGroup">Muscle Group</Label>
                <Input
                  id="muscleGroup"
                  placeholder="e.g., Full Body, Core, Legs"
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: string) => setFormData({ ...formData, difficulty: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="200"
                  value={formData.caloriesBurned}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the exercise..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="steps">Steps (one per line)</Label>
              <Textarea
                id="steps"
                placeholder="Step 1: Warm up&#10;Step 2: Main exercise&#10;Step 3: Cool down"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
            }}>
              Cancel
            </Button>
            <Button
              className="gradient-primary text-white border-0"
              onClick={showAddDialog ? handleAddCustomExercise : handleEditExercise}
            >
              {showAddDialog ? 'Create Exercise' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
