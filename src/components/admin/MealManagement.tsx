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

interface Meal {
  id: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredientsJson: string;
  stepsJson: string;
  prepTime: number;
  source: string;
  status: 'public' | 'private';
  creatorId?: string;
}

export function MealManagement() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    type: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    protein: '',
    carbs: '',
    fat: '',
    prepTime: '',
    ingredients: '',
    steps: '',
    image: '',
  });

  // Load meals from backend
  const loadMeals = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllMeals();
      const mealsData = response.meals || [];
      // Parse JSON strings for ingredients and steps
      const parsedMeals = mealsData.map((meal: any) => {
        let ingredients = [];
        let steps = [];
        try {
          ingredients = meal.ingredientsJson ? JSON.parse(meal.ingredientsJson) : [];
          steps = meal.stepsJson ? JSON.parse(meal.stepsJson) : [];
        } catch (e) {
          console.warn('Failed to parse meal JSON:', meal.id, e);
        }
        return {
          ...meal,
          ingredients,
          steps,
        };
      });
      setMeals(parsedMeals);
    } catch (error) {
      console.error('Failed to load meals:', error);
      toast.error('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const filteredMeals = meals.filter((meal: Meal) => {
    if (!meal || !meal.name) return false; // Safety check
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || meal.type === filterType;
    const matchesStatus = filterStatus === 'all' || meal.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddMeal = async () => {
    if (!formData.name || !formData.calories) {
      toast.error('Please fill in name and calories!');
      return;
    }

    try {
      await adminAPI.createMeal({
        name: formData.name,
        type: formData.type,
        calories: parseInt(formData.calories),
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
        prepTime: parseInt(formData.prepTime) || 15,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        steps: formData.steps.split('\n').filter(s => s.trim()),
      });
      await loadMeals();
      toast.success('Meal added successfully!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create meal:', error);
      toast.error('Không thể tạo món ăn mới');
    }
  };

  const handleEditMeal = async () => {
    if (!editingMeal) return;

    try {
      await adminAPI.updateMeal(editingMeal.id, {
        name: formData.name,
        calories: parseInt(formData.calories),
        type: formData.type,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
        prepTime: parseInt(formData.prepTime) || 15,
        image: formData.image || editingMeal.image,
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        steps: formData.steps.split('\n').filter(s => s.trim()),
      });
      await loadMeals();
      toast.success('Meal updated!');
      setShowEditDialog(false);
      setEditingMeal(null);
    } catch (error) {
      console.error('Failed to update meal:', error);
      toast.error('Không thể cập nhật món ăn');
    }
  };

  const handleDeleteMeal = async (mealId: string, mealName: string) => {
    if (window.confirm(`Delete meal "${mealName}"? This will remove it from the database.`)) {
      try {
        await adminAPI.deleteMeal(mealId);
        await loadMeals();
        toast.success('Meal deleted');
      } catch (error) {
        console.error('Failed to delete meal:', error);
        toast.error('Không thể xóa món ăn');
      }
    }
  };

  const handleToggleStatus = async (meal: Meal) => {
    try {
      const newStatus = meal.status === 'public' ? ('hidden' as 'hidden') : ('public' as 'public');
      await adminAPI.updateMeal(meal.id, { status: newStatus });
      await loadMeals();
      toast.success(`Meal ${newStatus === 'public' ? 'published' : 'hidden'}`);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const openEditDialog = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      calories: meal.calories.toString(),
      type: meal.type,
      protein: meal.protein.toString(),
      carbs: meal.carbs.toString(),
      fat: meal.fat.toString(),
      prepTime: meal.prepTime.toString(),
      ingredients: (meal as any).ingredients?.join(', ') || '',
      steps: (meal as any).steps?.join('\n') || '',
      image: meal.image,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      calories: '',
      type: 'lunch',
      protein: '',
      carbs: '',
      fat: '',
      prepTime: '',
      ingredients: '',
      steps: '',
      image: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Meal Management</h1>
          <p className="text-gray-600">Manage meal database</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="gradient-primary text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-xl border-0 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-gray-600">
            <span style={{ fontWeight: 600 }}>{filteredMeals.length}</span> meals
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Meals</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>{meals.length}</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Public</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>
            {meals.filter((m: Meal) => m.status === 'public').length}
          </p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Private</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#FF9800' }}>
            {meals.filter((m: Meal) => m.status === 'private').length}
          </p>
        </Card>
      </div>

      {/* Meals Table */}
      <Card className="rounded-xl border-0 shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20 animate-pulse" />
            <p>Loading meals...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nutrition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No meals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell style={{ fontSize: '0.875rem' }}>#{meal.id.slice(0, 6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={meal.image}
                          alt={meal.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span style={{ fontWeight: 600 }}>{meal.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{meal.calories} cal</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{meal.type}</Badge>
                    </TableCell>
                    <TableCell style={{ fontSize: '0.75rem' }}>
                      P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                    </TableCell>
                    <TableCell>
                      <Badge className={meal.status === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {meal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(meal)}
                          title={meal.status === 'public' ? 'Hide' : 'Publish'}
                        >
                          {meal.status === 'public' ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(meal)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMeal(meal.id, meal.name)}
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
            <DialogTitle>{showAddDialog ? 'Add New Meal' : 'Edit Meal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meal Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label>Calories</Label>
                <Input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Protein (g)</Label>
                <Input type="number" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Carbs (g)</Label>
                <Input type="number" value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Fat (g)</Label>
                <Input type="number" value={formData.fat} onChange={(e) => setFormData({ ...formData, fat: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Prep Time</Label>
                <Input type="number" value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })} className="mt-2" />
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
              <Label>Ingredients (comma separated)</Label>
              <Textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="mt-2"
                rows={3}
                placeholder="Chicken breast, Lettuce, Tomatoes, Olive oil..."
              />
            </div>

            <div>
              <Label>Cooking Steps (one per line)</Label>
              <Textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="mt-2"
                rows={5}
                placeholder="Step 1: Prepare ingredients&#10;Step 2: Cook chicken&#10;Step 3: Assemble salad..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
            }}>Cancel</Button>
            <Button onClick={showAddDialog ? handleAddMeal : handleEditMeal} className="gradient-primary text-white border-0">
              {showAddDialog ? 'Add Meal' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
