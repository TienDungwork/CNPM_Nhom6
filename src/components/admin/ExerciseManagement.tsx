import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { adminAPI } from '../../services/adminAPI';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  muscleGroup: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  caloriesBurned: number;
  description: string;
  stepsJson: string;
  image: string;
  source: string;
  status: 'public' | 'private';
  createdAt: string;
}

export function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    muscleGroup: '',
    duration: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    caloriesBurned: '',
    description: '',
    steps: '',
    image: '',
  });

  // Load exercises from backend
  const loadExercises = async () => {
    try {
      console.log('[ExerciseManagement] Loading exercises...');
      setLoading(true);
      const response = await adminAPI.getAllExercises();
      const exercisesData = response.exercises || [];
      // Parse JSON strings for steps
      const parsedExercises = exercisesData.map((exercise: any) => {
        let steps = [];
        try {
          steps = exercise.stepsJson ? JSON.parse(exercise.stepsJson) : [];
        } catch (e) {
          console.warn('Failed to parse exercise JSON:', exercise.id, e);
        }
        return {
          ...exercise,
          steps,
        };
      });
      setExercises(parsedExercises);
      console.log('[ExerciseManagement] Exercises loaded:', parsedExercises.length);
    } catch (error) {
      console.error('[ExerciseManagement] Failed to load exercises:', error);
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise: Exercise) => {
    if (!exercise || !exercise.title) return false;
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exercise.muscleGroup || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === 'all' || exercise.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleAddExercise = async () => {
    if (!formData.title || !formData.duration) {
      toast.error('Please fill in title and duration!');
      return;
    }

    try {
      await adminAPI.createExercise({
        title: formData.title,
        muscleGroup: formData.muscleGroup || 'General',
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        caloriesBurned: parseInt(formData.caloriesBurned) || 100,
        image: formData.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        description: formData.description,
        steps: formData.steps.split('\n').filter(s => s.trim()),
      });
      await loadExercises();
      toast.success('Exercise added successfully!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create exercise:', error);
      toast.error('Không thể tạo bài tập mới');
    }
  };

  const handleEditExercise = async () => {
    if (!editingExercise) return;

    try {
      await adminAPI.updateExercise(editingExercise.id, {
        title: formData.title,
        muscleGroup: formData.muscleGroup,
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        caloriesBurned: parseInt(formData.caloriesBurned) || 100,
        image: formData.image || editingExercise.image,
        description: formData.description,
        steps: formData.steps.split('\n').filter(s => s.trim()),
      });
      await loadExercises();
      toast.success('Exercise updated!');
      setShowEditDialog(false);
      setEditingExercise(null);
    } catch (error) {
      console.error('Failed to update exercise:', error);
      toast.error('Không thể cập nhật bài tập');
    }
  };

  const handleDeleteExercise = async (exerciseId: string, exerciseTitle: string) => {
    if (window.confirm(`Delete exercise "${exerciseTitle}"?`)) {
      try {
        await adminAPI.deleteExercise(exerciseId);
        await loadExercises();
        toast.success('Exercise deleted');
      } catch (error) {
        console.error('Failed to delete exercise:', error);
        toast.error('Không thể xóa bài tập');
      }
    }
  };

  const handleToggleStatus = async (exercise: Exercise) => {
    try {
      const newStatus = exercise.status === 'public' ? ('hidden' as 'hidden') : ('public' as 'public');
      await adminAPI.updateExercise(exercise.id, { status: newStatus });
      await loadExercises();
      toast.success(`Exercise ${newStatus === 'public' ? 'published' : 'hidden'}`);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Không thể thay đổi trạng thái');
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
      steps: (exercise as any).steps?.join('\n') || '',
      image: exercise.image,
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
      image: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Exercise Management</h1>
          <p className="text-gray-600">Manage exercise database</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="gradient-primary text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-xl border-0 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-gray-600">
            <span style={{ fontWeight: 600 }}>{filteredExercises.length}</span> exercises
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Exercises</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>{exercises.length}</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Public</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>
            {exercises.filter((e: Exercise) => e.status === 'public').length}
          </p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Private</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#FF9800' }}>
            {exercises.filter((e: Exercise) => e.status === 'private').length}
          </p>
        </Card>
      </div>

      {/* Exercises Table */}
      <Card className="rounded-xl border-0 shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20 animate-pulse" />
            <p>Loading exercises...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Muscle Group</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No exercises found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell style={{ fontSize: '0.875rem' }}>#{exercise.id.slice(0, 6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={exercise.image}
                          alt={exercise.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span style={{ fontWeight: 600 }}>{exercise.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{exercise.muscleGroup}</TableCell>
                    <TableCell>{exercise.duration} min</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {exercise.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{exercise.caloriesBurned} cal</TableCell>
                    <TableCell>
                      <Badge className={exercise.status === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {exercise.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(exercise)}
                          title={exercise.status === 'public' ? 'Hide' : 'Publish'}
                        >
                          {exercise.status === 'public' ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(exercise)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExercise(exercise.id, exercise.title)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open: boolean) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
        }
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? 'Add New Exercise' : 'Edit Exercise'}</DialogTitle>
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
                  placeholder="e.g., Chest, Legs, Core"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="mt-2" />
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
                <Input type="number" value={formData.caloriesBurned} onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })} className="mt-2" />
              </div>
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                rows={3}
                placeholder="Brief description of the exercise..."
              />
            </div>

            <div>
              <Label>Instructions (one per line)</Label>
              <Textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="mt-2"
                rows={6}
                placeholder="Step 1: Get in position&#10;Step 2: Perform movement&#10;Step 3: Return to start..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
            }}>Cancel</Button>
            <Button onClick={showAddDialog ? handleAddExercise : handleEditExercise} className="gradient-primary text-white border-0">
              {showAddDialog ? 'Add Exercise' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
