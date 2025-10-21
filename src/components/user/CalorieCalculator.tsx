import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calculator, Activity, Save } from 'lucide-react';
import { toast } from 'sonner';

export function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.hasProfile) {
        const p = data.profile;
        setAge(p.age.toString());
        setWeight(p.weight.toString());
        setHeight(p.height.toString());
        setGender(p.gender);
        setActivityLevel(p.activityLevel);
        setGoal(p.goal);
        setResult(p.calorieGoal);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Load profile error:', error);
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || !gender || !activityLevel || !goal) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: parseInt(age),
          weight: w,
          height: h,
          gender,
          activityLevel,
          goal
        })
      });

      if (!response.ok) throw new Error('Failed to save profile');
      
      const data = await response.json();
      setResult(data.profile.calorieGoal);
      
      // Calculate BMI
      const heightInMeters = h / 100; // convert cm to m
      const calculatedBmi = w / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
      setBmiCategory(getBmiCategory(calculatedBmi));
      
      toast.success('✅ Profile saved! Your calorie goal: ' + data.profile.calorieGoal + ' kcal/day');
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getBmiCategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const getBmiColor = (bmiValue: number): string => {
    if (bmiValue < 18.5) return 'text-blue-600';
    if (bmiValue < 25) return 'text-green-600';
    if (bmiValue < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGoalDescription = (goalType: string): string => {
    switch (goalType) {
      case 'lose':
        return 'Reduce 500 calories/day for gradual weight loss';
      case 'maintain':
        return 'Maintain current weight with balanced intake';
      case 'gain':
        return 'Add 500 calories/day for muscle building';
      default:
        return '';
    }
  };

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

            <div>
              <Label htmlFor="goal">Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Weight Loss (- 500 kcal)</SelectItem>
                  <SelectItem value="maintain">Maintenance</SelectItem>
                  <SelectItem value="gain">Weight Gain (+ 500 kcal)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={saveProfile} 
              className="w-full gradient-primary text-white border-0"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile & Calculate
                </>
              )}
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
              {/* Main Calorie Goal */}
              <div className="text-center p-8 bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 rounded-xl">
                <p className="text-gray-600 mb-2">Daily Caloric Need</p>
                <p className="text-[#00C78C]" style={{ fontSize: '3rem', fontWeight: 700 }}>{result}</p>
                <p className="text-gray-600">calories per day</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* BMI Card */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <p className="text-gray-700 mb-2 text-center" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Your BMI</p>
                  <p className={`text-center mb-1 ${bmi ? getBmiColor(bmi) : 'text-gray-600'}`} style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                    {bmi ? bmi.toFixed(1) : '--'}
                  </p>
                  <p className="text-center text-gray-600" style={{ fontSize: '0.875rem' }}>
                    {bmiCategory || 'Calculate to see BMI'}
                  </p>
                </div>

                {/* Goal Card */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <p className="text-gray-700 mb-2 text-center" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Your Goal</p>
                  <p className="text-purple-900 text-center mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : 'Maintenance'}
                  </p>
                  <p className="text-center text-gray-600" style={{ fontSize: '0.75rem' }}>
                    {getGoalDescription(goal)}
                  </p>
                </div>
              </div>

              {/* BMI Reference Chart */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>BMI Reference</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">● Underweight</span>
                    <span className="text-gray-600">&lt; 18.5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">● Normal weight</span>
                    <span className="text-gray-600">18.5 - 24.9</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-600">● Overweight</span>
                    <span className="text-gray-600">25 - 29.9</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600">● Obese</span>
                    <span className="text-gray-600">≥ 30</span>
                  </div>
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
