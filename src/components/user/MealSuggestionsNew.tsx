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
import { UtensilsCrossed, Clock, Flame, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface Meal {
  id: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  image: string;
  ingredients: string[];
  steps: string[];
  source: 'admin' | 'copy' | 'custom';
  createdAt?: string;
}

export function MealSuggestionsNew() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
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

  // Fetch meals from API
  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/meals/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load meals');
      }

      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Load meals error:', error);
      toast.error('Failed to load meals');
    } finally {
      setIsLoading(false);
    }
  };

  const publicMeals = meals.filter(m => m.source === 'admin');
  const myMeals = meals.filter(m => m.source === 'copy' || m.source === 'custom');

  const handleViewRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleAddToMyMeals = async (meal: Meal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/meals/copy/${meal.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      toast.success(`Added "${meal.name}" to My Meals!`);
      await loadMeals(); // Reload meals
    } catch (error) {
      console.error('Add meal error:', error);
      toast.error('Failed to add meal');
    }
  };

  const handleAddCustomMeal = async () => {
    if (!formData.name || !formData.calories) {
      toast.error('Please fill in name and calories!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/meals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          calories: parseInt(formData.calories),
          type: formData.type,
          protein: parseInt(formData.protein) || 0,
          carbs: parseInt(formData.carbs) || 0,
          fat: parseInt(formData.fat) || 0,
          prepTime: parseInt(formData.prepTime) || 15,
          ingredientsJson: JSON.stringify(formData.ingredients.split(',').map(i => i.trim())),
          stepsJson: JSON.stringify(formData.steps.split('\n').filter(s => s.trim())),
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create meal');
      }

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
      await loadMeals();
    } catch (error) {
      console.error('Create meal error:', error);
      toast.error('Failed to create meal');
    }
  };

  const handleEditMeal = async () => {
    if (!editingMeal) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/meals/${editingMeal.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          calories: parseInt(formData.calories),
          type: formData.type,
          protein: parseInt(formData.protein) || 0,
          carbs: parseInt(formData.carbs) || 0,
          fat: parseInt(formData.fat) || 0,
          prepTime: parseInt(formData.prepTime) || 15,
          ingredientsJson: JSON.stringify(formData.ingredients.split(',').map(i => i.trim())),
          stepsJson: JSON.stringify(formData.steps.split('\n').filter(s => s.trim()))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update meal');
      }

      toast.success('Meal updated!');
      setShowEditDialog(false);
      setEditingMeal(null);
      await loadMeals();
    } catch (error) {
      console.error('Update meal error:', error);
      toast.error('Failed to update meal');
    }
  };

  const handleDeleteMeal = async (mealId: string, mealName: string) => {
    if (!window.confirm(`Delete "${mealName}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      toast.success('Meal deleted');
      await loadMeals();
    } catch (error) {
      console.error('Delete meal error:', error);
      toast.error('Failed to delete meal');
    }
  };

  const handleLogMeal = async (meal: Meal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/activity/log-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mealId: meal.id,
          name: meal.name,
          calories: meal.calories,
          type: meal.type
        })
      });

      if (!response.ok) throw new Error('Failed to log meal');
      
      toast.success(`✅ ${meal.name} logged! (${meal.calories} kcal)`);
    } catch (error) {
      console.error('Log meal error:', error);
      toast.error('Failed to log meal. Please try again.');
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
      ingredients: meal.ingredients.join(', '),
      steps: meal.steps.join('\n'),
    });
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C78C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meals...</p>
        </div>
      </div>
    );
  }

  const MealCard = ({ meal, showActions = false }: { meal: Meal; showActions?: boolean }) => (
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
            </>
          )}
        </div>
        
        {/* Log Meal Button */}
        <Button
          className="w-full mt-2 gradient-primary text-white border-0"
          onClick={() => handleLogMeal(meal)}
        >
          <UtensilsCrossed className="w-4 h-4 mr-2" />
          Log This Meal
        </Button>
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
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open: boolean) => {
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
