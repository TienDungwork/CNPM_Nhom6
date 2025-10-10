import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calculator, Activity } from 'lucide-react';

export function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || !gender || !activityLevel) {
      alert('Please fill all fields');
      return;
    }

    // Harris-Benedict Formula
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];
    setResult(Math.round(tdee));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Calorie Calculator</h1>
        <p className="text-gray-600">Calculate your daily caloric needs based on your profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h3 style={{ fontWeight: 600 }}>Enter Your Details</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateCalories} className="w-full gradient-primary text-white border-0">
              Calculate
            </Button>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 style={{ fontWeight: 600 }}>Your Results</h3>
          </div>

          {result ? (
            <div className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 rounded-xl">
                <p className="text-gray-600 mb-2">Daily Caloric Need</p>
                <p className="text-[#00C78C]" style={{ fontSize: '3rem', fontWeight: 700 }}>{result}</p>
                <p className="text-gray-600">calories per day</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p style={{ fontWeight: 600 }} className="text-blue-900 mb-1">Weight Loss</p>
                  <p className="text-blue-700">{result - 500} calories/day</p>
                  <p className="text-blue-600" style={{ fontSize: '0.875rem' }}>Reduce 500 calories for gradual weight loss</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p style={{ fontWeight: 600 }} className="text-green-900 mb-1">Maintenance</p>
                  <p className="text-green-700">{result} calories/day</p>
                  <p className="text-green-600" style={{ fontSize: '0.875rem' }}>Maintain current weight</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <p style={{ fontWeight: 600 }} className="text-orange-900 mb-1">Weight Gain</p>
                  <p className="text-orange-700">{result + 500} calories/day</p>
                  <p className="text-orange-600" style={{ fontSize: '0.875rem' }}>Add 500 calories for muscle building</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Enter your details and click Calculate to see your results</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
