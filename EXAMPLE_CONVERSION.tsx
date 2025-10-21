// ============================================
// BEFORE: Using Mock Data from DataContext
// ============================================
import { useData } from '../DataContext';

export function MealManagement() {
  const { meals, addMeal, updateMeal, deleteMeal } = useData();
  
  // meals = mock data from DataContext useState
  // addMeal = just updates local state
  // NO DATABASE CONNECTION!
}

// ============================================
// AFTER: Using Real API Calls
// ============================================
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'sonner';

export function MealManagement() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch meals from database on mount
  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllMeals();
      setMeals(data.meals);
    } catch (error) {
      console.error('Failed to load meals:', error);
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  // Create meal - SAVES TO DATABASE
  const handleAddMeal = async (mealData) => {
    try {
      await adminAPI.createMeal({
        name: mealData.name,
        type: mealData.type,
        calories: parseInt(mealData.calories),
        protein: parseInt(mealData.protein) || 0,
        carbs: parseInt(mealData.carbs) || 0,
        fat: parseInt(mealData.fat) || 0,
        prepTime: parseInt(mealData.prepTime) || 15,
        image: mealData.image,
        ingredients: mealData.ingredients,
        steps: mealData.steps
      });
      
      toast.success('Meal created successfully!');
      await loadMeals(); // Refresh list from database
    } catch (error) {
      console.error('Failed to create meal:', error);
      toast.error('Failed to create meal');
    }
  };

  // Update meal - UPDATES DATABASE
  const handleUpdateMeal = async (mealId, mealData) => {
    try {
      await adminAPI.updateMeal(mealId, {
        name: mealData.name,
        type: mealData.type,
        calories: parseInt(mealData.calories),
        protein: parseInt(mealData.protein),
        carbs: parseInt(mealData.carbs),
        fat: parseInt(mealData.fat),
        prepTime: parseInt(mealData.prepTime),
        image: mealData.image,
        ingredients: mealData.ingredients,
        steps: mealData.steps
      });
      
      toast.success('Meal updated successfully!');
      await loadMeals(); // Refresh list
    } catch (error) {
      console.error('Failed to update meal:', error);
      toast.error('Failed to update meal');
    }
  };

  // Delete meal - DELETES FROM DATABASE
  const handleDeleteMeal = async (mealId) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await adminAPI.deleteMeal(mealId);
      toast.success('Meal deleted successfully!');
      await loadMeals(); // Refresh list
    } catch (error) {
      console.error('Failed to delete meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  if (loading) {
    return <div>Loading meals...</div>;
  }

  return (
    <div>
      {/* Your existing UI code */}
      {/* Just replace the handler functions */}
    </div>
  );
}

// ============================================
// KEY DIFFERENCES:
// ============================================
// BEFORE:
// - meals from mock data (hardcoded)
// - addMeal just updates state
// - Changes lost on refresh
// - No database persistence

// AFTER:
// - meals from database API
// - addMeal calls backend API
// - Data persisted in SQL database
// - Admin sees real user activity
