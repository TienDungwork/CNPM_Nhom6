import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useData, Exercise } from '../DataContext';
import { FileText, Plus, Dumbbell } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../ui/badge';

export function ContentManagement() {
  const { exercises, addExercise } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    duration: '',
    difficulty: 'Beginner' as Exercise['difficulty'],
    caloriesBurned: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1634788699201-77bbb9428ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYwMDU5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addExercise({
      title: formData.title,
      type: formData.type,
      duration: parseInt(formData.duration),
      difficulty: formData.difficulty,
      caloriesBurned: parseInt(formData.caloriesBurned),
      description: formData.description,
      image: formData.image,
    });

    toast.success('Exercise added successfully! Users can now see it.');
    setShowAddForm(false);
    setFormData({
      title: '',
      type: '',
      duration: '',
      difficulty: 'Beginner',
      caloriesBurned: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1634788699201-77bbb9428ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYwMDU5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Content Management</h1>
          <p className="text-gray-600">Manage exercises, meals, and other content</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="gradient-primary text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Total Exercises</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{exercises.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Meal Plans</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>24</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Articles</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>12</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Exercise Form */}
      {showAddForm && (
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <h3 className="mb-6" style={{ fontWeight: 600 }}>Add New Exercise</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Exercise Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Full Body Workout"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Cardio, Strength, etc."
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: Exercise['difficulty']) => setFormData({ ...formData, difficulty: value })}
                >
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
                <Label htmlFor="calories">Calories Burned</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                  placeholder="300"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the exercise..."
                className="mt-2"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="gradient-primary text-white border-0">
                Add Exercise
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Exercise List */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-6" style={{ fontWeight: 600 }}>Exercise Library</h3>
        
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No exercises added yet</p>
            <p className="mt-2" style={{ fontSize: '0.875rem' }}>Click "Add Exercise" to create content for users</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 style={{ fontWeight: 600 }}>{exercise.title}</h4>
                  <Badge variant="secondary">{exercise.difficulty}</Badge>
                </div>
                <p className="text-gray-600 mb-3" style={{ fontSize: '0.875rem' }}>
                  {exercise.description}
                </p>
                <div className="flex items-center gap-4 text-gray-500" style={{ fontSize: '0.875rem' }}>
                  <span>⏱️ {exercise.duration} min</span>
                  <span>🔥 {exercise.caloriesBurned} cal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
