import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { useData, Meal, UserMeal } from '../DataContext';
import { UtensilsCrossed, Clock, Flame, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function MealSuggestionsNew() {
  const { meals, userMeals, addUserMeal, updateUserMeal, deleteUserMeal, copyMealToUser, addActivityLog } = useData();
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | UserMeal | null>(null);
  const [editingMeal, setEditingMeal] = useState<UserMeal | null>(null);
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
  });

  const userId = '1'; // Mock user ID
  const publicMeals = meals.filter(m => m.status === 'public');
  const myMeals = userMeals.filter(m => m.userId === userId);

  const handleViewRecipe = (meal: Meal | UserMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleAddToMyMeals = (meal: Meal) => {
    copyMealToUser(userId, meal.id);
    toast.success(`Added "${meal.name}" to My Meals!`);
    addActivityLog({
      userId,
      type: 'meal',
      title: 'Added meal',
      details: `Added ${meal.name} to My Meals`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAddCustomMeal = () => {
    if (!formData.name || !formData.calories) {
      toast.error('Please fill in name and calories!');
      return;
    }

    const newMeal: Omit<UserMeal, 'id' | 'createdAt'> = {
      userId,
      name: formData.name,
      calories: parseInt(formData.calories),
      type: formData.type,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      steps: formData.steps.split('\n').filter(s => s.trim()),
      prepTime: parseInt(formData.prepTime) || 15,
      source: 'custom',
    };

    addUserMeal(newMeal);
    toast.success('Meal created successfully!');
    setShowAddDialog(false);
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
    });
  };

  const handleEditMeal = () => {
    if (!editingMeal) return;

    updateUserMeal(editingMeal.id, {
      name: formData.name,
      calories: parseInt(formData.calories),
      type: formData.type,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      steps: formData.steps.split('\n').filter(s => s.trim()),
      prepTime: parseInt(formData.prepTime) || 15,
    });

    toast.success('Meal updated!');
    setShowEditDialog(false);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId: string, mealName: string) => {
    if (window.confirm(`Delete "${mealName}"?`)) {
      deleteUserMeal(mealId);
      toast.success('Meal deleted');
    }
  };

  const openEditDialog = (meal: UserMeal) => {
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
    });
    setShowEditDialog(true);
  };

  const MealCard = ({ meal, showActions = false }: { meal: Meal | UserMeal; showActions?: boolean }) => (
    <Card className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
      <div className="relative h-48">
        <ImageWithFallback
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 right-4 bg-white text-gray-900 hover:bg-white">
          {meal.type}
        </Badge>
      </div>
      
      <div className="p-6">
        <h3 className="mb-3" style={{ fontWeight: 600, fontSize: '1.25rem' }}>{meal.name}</h3>
        
        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span style={{ fontSize: '0.875rem' }}>{meal.calories} cal</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span style={{ fontSize: '0.875rem' }}>{meal.prepTime} min</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-blue-900" style={{ fontWeight: 600 }}>{meal.protein}g</p>
            <p className="text-blue-600" style={{ fontSize: '0.75rem' }}>Protein</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-green-900" style={{ fontWeight: 600 }}>{meal.carbs}g</p>
            <p className="text-green-600" style={{ fontSize: '0.75rem' }}>Carbs</p>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <p className="text-orange-900" style={{ fontWeight: 600 }}>{meal.fat}g</p>
            <p className="text-orange-600" style={{ fontSize: '0.75rem' }}>Fat</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleViewRecipe(meal)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Recipe
          </Button>
          {!showActions ? (
            <Button
              className="flex-1 gradient-primary text-white border-0"
              onClick={() => handleAddToMyMeals(meal as Meal)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to My Meals
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(meal as UserMeal)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMeal((meal as UserMeal).id, meal.name)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Meal Suggestions</h1>
          <p className="text-gray-600">Discover and manage healthy meal plans</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All Meals</TabsTrigger>
          <TabsTrigger value="my">My Meals</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {publicMeals.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>No meals available</h3>
              <p className="text-gray-600">Admin is adding meal suggestions</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          <div className="mb-6">
            <Button
              onClick={() => {
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
                });
                setShowAddDialog(true);
              }}
              className="gradient-primary text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Meal
            </Button>
          </div>

          {myMeals.length === 0 ? (
            <Card className="p-12 rounded-xl border-0 shadow-md text-center">
              <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2" style={{ fontWeight: 600 }}>Your meal list is empty</h3>
              <p className="text-gray-600">Add meals from "All Meals" or create custom meals</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} showActions />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recipe Details Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMeal?.name}</DialogTitle>
          </DialogHeader>
          {selectedMeal && (
            <div className="space-y-6">
              <ImageWithFallback
                src={selectedMeal.image}
                alt={selectedMeal.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                  <p style={{ fontWeight: 600 }}>{selectedMeal.calories}</p>
                  <p className="text-gray-600" style={{ fontSize: '0.75rem' }}>Calories</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-900" style={{ fontWeight: 600 }}>{selectedMeal.protein}g</p>
                  <p className="text-blue-600" style={{ fontSize: '0.75rem' }}>Protein</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-green-900" style={{ fontWeight: 600 }}>{selectedMeal.carbs}g</p>
                  <p className="text-green-600" style={{ fontSize: '0.75rem' }}>Carbs</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-orange-900" style={{ fontWeight: 600 }}>{selectedMeal.fat}g</p>
                  <p className="text-orange-600" style={{ fontSize: '0.75rem' }}>Fat</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3" style={{ fontWeight: 600 }}>Ingredients</h4>
                <ul className="list-disc list-inside space-y-2">
                  {selectedMeal.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-gray-700">{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3" style={{ fontWeight: 600 }}>Steps</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedMeal.steps.map((step, idx) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>

              {'source' in selectedMeal && selectedMeal.source === 'admin' && (
                <Button
                  className="w-full gradient-primary text-white border-0"
                  onClick={() => {
                    handleAddToMyMeals(selectedMeal as Meal);
                    setShowRecipeDialog(false);
                  }}
                >
                  Add this Meal
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialogs */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? 'Add Custom Meal' : 'Edit Meal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meal Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter meal name"
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

            <div className="grid grid-cols-4 gap-4">
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
            </div>

            <div>
              <Label>Prep Time (minutes)</Label>
              <Input type="number" value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })} className="mt-2" />
            </div>

            <div>
              <Label>Ingredients (comma separated)</Label>
              <Textarea value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} className="mt-2" placeholder="Rice, Chicken, Vegetables..." />
            </div>

            <div>
              <Label>Steps (one per line)</Label>
              <Textarea value={formData.steps} onChange={(e) => setFormData({ ...formData, steps: e.target.value })} className="mt-2" rows={5} placeholder="Step 1&#10;Step 2&#10;Step 3..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
            }}>Cancel</Button>
            <Button onClick={showAddDialog ? handleAddCustomMeal : handleEditMeal} className="gradient-primary text-white border-0">
              {showAddDialog ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
