import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useData, Meal } from '../DataContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MealManagement() {
  const { meals, userMeals, addMeal, updateMeal, deleteMeal, getUserById } = useData();
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

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || meal.type === filterType;
    const matchesStatus = filterStatus === 'all' || meal.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddMeal = () => {
    if (!formData.name || !formData.calories) {
      toast.error('Please fill in name and calories!');
      return;
    }

    const newMeal: Omit<Meal, 'id'> = {
      name: formData.name,
      calories: parseInt(formData.calories),
      type: formData.type,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
      steps: formData.steps.split('\n').filter(s => s.trim()),
      prepTime: parseInt(formData.prepTime) || 15,
      source: 'admin',
      status: 'public',
    };

    addMeal(newMeal);
    toast.success('Meal added successfully!');
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditMeal = () => {
    if (!editingMeal) return;

    updateMeal(editingMeal.id, {
      name: formData.name,
      calories: parseInt(formData.calories),
      type: formData.type,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      image: formData.image || editingMeal.image,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
      steps: formData.steps.split('\n').filter(s => s.trim()),
      prepTime: parseInt(formData.prepTime) || 15,
    });

    toast.success('Meal updated!');
    setShowEditDialog(false);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId: string, mealName: string) => {
    if (window.confirm(`Delete meal "${mealName}"? This will not affect user copies.`)) {
      deleteMeal(mealId);
      toast.success('Meal deleted');
    }
  };

  const handleToggleStatus = (meal: Meal) => {
    updateMeal(meal.id, {
      status: meal.status === 'public' ? 'hidden' : 'public'
    });
    toast.success(`Meal ${meal.status === 'public' ? 'hidden' : 'published'}`);
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
      ingredients: meal.ingredients.join(', '),
      steps: meal.steps.join('\n'),
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

  const userMealStats = userMeals.reduce((acc, um) => {
    if (um.baseMealId) {
      acc[um.baseMealId] = (acc[um.baseMealId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Meal Management</h1>
          <p className="text-gray-600">Manage meal database and user submissions</p>
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
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-gray-600">
            <span style={{ fontWeight: 600 }}>{filteredMeals.length}</span> meals
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Total Meals</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>{meals.length}</p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Public</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00C78C' }}>
            {meals.filter(m => m.status === 'public').length}
          </p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>Hidden</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#FF9800' }}>
            {meals.filter(m => m.status === 'hidden').length}
          </p>
        </Card>
        <Card className="p-4 rounded-xl border-0 shadow-md">
          <p className="text-gray-600 mb-1" style={{ fontSize: '0.875rem' }}>User Copies</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2196F3' }}>{userMeals.length}</p>
        </Card>
      </div>

      {/* Meals Table */}
      <Card className="rounded-xl border-0 shadow-md overflow-hidden">
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
                <TableHead>User Copies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No meals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell style={{ fontSize: '0.875rem' }}>#{meal.id.slice(0, 6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
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
                      <Badge variant="outline">{userMealStats[meal.id] || 0} users</Badge>
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
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
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
