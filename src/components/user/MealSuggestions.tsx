import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { UtensilsCrossed, Clock, Flame } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const meals = [
  {
    id: 1,
    name: 'Quinoa Buddha Bowl',
    type: 'Lunch',
    calories: 450,
    prepTime: 25,
    protein: 18,
    carbs: 62,
    fat: 12,
    image: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MDA5Mzg3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Spinach', 'Cherry tomatoes'],
  },
  {
    id: 2,
    name: 'Grilled Chicken Salad',
    type: 'Dinner',
    calories: 380,
    prepTime: 20,
    protein: 35,
    carbs: 25,
    fat: 15,
    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYwMDgxNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: ['Chicken breast', 'Mixed greens', 'Cucumber', 'Bell peppers', 'Olive oil'],
  },
  {
    id: 3,
    name: 'Greek Yogurt Parfait',
    type: 'Breakfast',
    calories: 280,
    prepTime: 10,
    protein: 20,
    carbs: 35,
    fat: 8,
    image: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MDA5Mzg3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: ['Greek yogurt', 'Granola', 'Berries', 'Honey', 'Chia seeds'],
  },
  {
    id: 4,
    name: 'Salmon with Vegetables',
    type: 'Dinner',
    calories: 520,
    prepTime: 30,
    protein: 40,
    carbs: 30,
    fat: 22,
    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYwMDgxNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Lemon', 'Herbs'],
  },
];

export function MealSuggestions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Meal Suggestions</h1>
        <p className="text-gray-600">Healthy meal ideas tailored to your nutritional goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all">
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

              <div className="mb-4">
                <p className="text-gray-700 mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ingredient, idx) => (
                    <Badge key={idx} variant="secondary" className="rounded-full">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 px-4 rounded-lg border-2 border-[#00C78C] text-[#00C78C] hover:bg-[#00C78C] hover:text-white transition-all">
                View Recipe
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
