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
import { useData, Exercise, UserExercise } from '../DataContext';
import { Dumbbell, Clock, Flame, Plus, Edit2, Trash2, Play, Pause, Check, Activity } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function ExercisePlansNew() {
  const { exercises, userExercises, addUserExercise, updateUserExercise, deleteUserExercise, copyExerciseToUser, addActivityLog } = useData();
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | UserExercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<UserExercise | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    muscleGroup: '',
    duration: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    caloriesBurned: '',
    description: '',
    steps: '',
  });

  const userId = '1'; // Mock user ID
  const publicExercises = exercises.filter(e => e.status === 'public');
  const myExercises = userExercises.filter(e => e.userId === userId);

  // Workout Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && selectedExercise) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => {
          const maxTime = selectedExercise.duration * 60;
          if (prev >= maxTime) {
            setIsTimerRunning(false);
            handleFinishWorkout();
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, selectedExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewDetails = (exercise: Exercise | UserExercise) => {
    setSelectedExercise(exercise);
    setShowDetailsDialog(true);
  };

  const handleStartWorkout = (exercise: Exercise | UserExercise) => {
    setSelectedExercise(exercise);
    setWorkoutTimer(0);
    setCurrentStep(0);
    setIsTimerRunning(false);
    setShowWorkoutDialog(true);
  };

  const handleFinishWorkout = () => {
    if (!selectedExercise) return;

    addActivityLog({
      userId,
      type: 'exercise',
      title: 'Completed Workout',
      details: `Completed ${selectedExercise.title} - ${selectedExercise.duration} min`,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Workout completed! 🎉 You burned ~${selectedExercise.caloriesBurned} calories!`);
    setShowWorkoutDialog(false);
    setIsTimerRunning(false);
  };

  const handleAddToMyExercises = (exercise: Exercise) => {
    copyExerciseToUser(userId, exercise.id);
    toast.success(`Added "${exercise.title}" to My Exercises!`);
  };

  const handleAddCustomExercise = () => {
    if (!formData.title || !formData.duration) {
      toast.error('Please fill in title and duration!');
      return;
    }

    const newExercise: Omit<UserExercise, 'id' | 'createdAt'> = {
      userId,
      title: formData.title,
      muscleGroup: formData.muscleGroup || 'General',
      duration: parseInt(formData.duration),
      difficulty: formData.difficulty,
      caloriesBurned: parseInt(formData.caloriesBurned) || 100,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: formData.description,
      steps: formData.steps.split('\n').filter(s => s.trim()),
      source: 'custom',
    };

    addUserExercise(newExercise);
    toast.success('Exercise created successfully!');
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditExercise = () => {
    if (!editingExercise) return;

    updateUserExercise(editingExercise.id, {
      title: formData.title,
      muscleGroup: formData.muscleGroup,
      duration: parseInt(formData.duration),
      difficulty: formData.difficulty,
      caloriesBurned: parseInt(formData.caloriesBurned) || 100,
      description: formData.description,
      steps: formData.steps.split('\n').filter(s => s.trim()),
    });

    toast.success('Exercise updated!');
    setShowEditDialog(false);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (exerciseId: string, exerciseTitle: string) => {
    if (window.confirm(`Delete "${exerciseTitle}"?`)) {
      deleteUserExercise(exerciseId);
      toast.success('Exercise deleted');
    }
  };

  const openEditDialog = (exercise: UserExercise) => {
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

  const resetForm = () => {
    setFormData({
      title: '',
      muscleGroup: '',
      duration: '',
      difficulty: 'Beginner',
      caloriesBurned: '',
      description: '',
      steps: '',
    });
  };

  const ExerciseCard = ({ exercise, showActions = false }: { exercise: Exercise | UserExercise; showActions?: boolean }) => (
    <Card className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
      <div className="relative h-48">
        <ImageWithFallback
          src={exercise.image}
          alt={exercise.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-white text-gray-900 hover:bg-white">
          {exercise.difficulty}
        </Badge>
      </div>
      
      <div className="p-6">
        <h3 className="mb-2" style={{ fontWeight: 600, fontSize: '1.25rem' }}>{exercise.title}</h3>
        <p className="text-gray-600 mb-4" style={{ fontSize: '0.875rem' }}>{exercise.muscleGroup}</p>
        
        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span style={{ fontSize: '0.875rem' }}>{exercise.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span style={{ fontSize: '0.875rem' }}>{exercise.caloriesBurned} cal</span>
          </div>
        </div>

        <div className="flex gap-2">
          {!showActions ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleViewDetails(exercise)}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                className="flex-1 gradient-primary text-white border-0"
                onClick={() => handleStartWorkout(exercise)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleStartWorkout(exercise)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(exercise as UserExercise)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteExercise((exercise as UserExercise).id, exercise.title)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {!showActions && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => handleAddToMyExercises(exercise as Exercise)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to My Exercises
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Exercise Plans</h1>
          <p className="text-gray-600">Discover and track your workout routines</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="my">My Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {publicExercises.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>No exercises available</h3>
              <p className="text-gray-600">Admin is adding exercise plans</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          <div className="mb-6">
            <Button
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="gradient-primary text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Exercise
            </Button>
          </div>

          {myExercises.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>Your exercise list is empty</h3>
              <p className="text-gray-600">Add exercises from "All Exercises" or create custom ones</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} showActions />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Exercise Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.title}</DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-6">
              <ImageWithFallback
                src={selectedExercise.image}
                alt={selectedExercise.title}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p style={{ fontWeight: 600 }}>{selectedExercise.duration} min</p>
                  <p className="text-gray-600" style={{ fontSize: '0.75rem' }}>Duration</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                  <p style={{ fontWeight: 600 }}>{selectedExercise.caloriesBurned}</p>
                  <p className="text-gray-600" style={{ fontSize: '0.75rem' }}>Calories</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <p style={{ fontWeight: 600 }}>{selectedExercise.difficulty}</p>
                  <p className="text-gray-600" style={{ fontSize: '0.75rem' }}>Level</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2" style={{ fontWeight: 600 }}>Muscle Group</h4>
                <p className="text-gray-700">{selectedExercise.muscleGroup}</p>
              </div>

              <div>
                <h4 className="mb-2" style={{ fontWeight: 600 }}>Description</h4>
                <p className="text-gray-700">{selectedExercise.description}</p>
              </div>

              {selectedExercise.steps && selectedExercise.steps.length > 0 && (
                <div>
                  <h4 className="mb-3" style={{ fontWeight: 600 }}>Instructions</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedExercise.steps.map((step, idx) => (
                      <li key={idx} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <Button
                className="w-full gradient-primary text-white border-0"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleStartWorkout(selectedExercise);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start This Workout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Workout Timer Dialog */}
      <Dialog open={showWorkoutDialog} onOpenChange={(open) => {
        if (!open) {
          setShowWorkoutDialog(false);
          setIsTimerRunning(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.title} - Workout Session</DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-6">
              {/* Timer Display */}
              <div className="text-center p-8 bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 rounded-xl">
                <div className="text-6xl mb-4" style={{ fontWeight: 700, color: '#00C78C' }}>
                  {formatTime(workoutTimer)}
                </div>
                <p className="text-gray-600">
                  Target: {selectedExercise.duration} minutes
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="gradient-primary h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((workoutTimer / (selectedExercise.duration * 60)) * 100, 100)}%`
                  }}
                />
              </div>

              {/* Current Step */}
              {selectedExercise.steps && selectedExercise.steps.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="mb-2" style={{ fontWeight: 600 }}>
                    Step {currentStep + 1} of {selectedExercise.steps.length}
                  </h4>
                  <p className="text-gray-700">{selectedExercise.steps[currentStep]}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(Math.min(selectedExercise.steps.length - 1, currentStep + 1))}
                      disabled={currentStep === selectedExercise.steps.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex gap-3">
                {!isTimerRunning ? (
                  <Button
                    className="flex-1 gradient-primary text-white border-0"
                    onClick={() => setIsTimerRunning(true)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => setIsTimerRunning(false)}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button
                  className="flex-1 bg-green-600 text-white border-0 hover:bg-green-700"
                  onClick={handleFinishWorkout}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Finish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Exercise Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
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
                <Label>Exercise Name</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Push-ups"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Muscle Group</Label>
                <Input
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                  placeholder="e.g., Chest, Legs"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger className="mt-2">
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
                <Label>Calories Burned</Label>
                <Input
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                placeholder="Brief description of the exercise"
              />
            </div>

            <div>
              <Label>Instructions (one per line)</Label>
              <Textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="mt-2"
                rows={6}
                placeholder="Step 1&#10;Step 2&#10;Step 3..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
            }}>Cancel</Button>
            <Button onClick={showAddDialog ? handleAddCustomExercise : handleEditExercise} className="gradient-primary text-white border-0">
              {showAddDialog ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
