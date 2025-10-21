import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Calendar, Plus, Trash2, Clock, Apple, Dumbbell, Moon, Droplets, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';

interface Plan {
  id: string;
  date: string;
  time: string;
  activityType: 'meal' | 'exercise' | 'water' | 'sleep';
  title: string;
  description: string;
  notes: string;
  completed: boolean;
  mealId?: string;
  exerciseId?: string;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  type: string;
}

interface Exercise {
  id: string;
  title: string;
  duration: number;
  caloriesBurned: number;
}

export function DailyPlanner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    time: '',
    activityType: 'meal' as 'meal' | 'exercise' | 'water' | 'sleep',
    title: '',
    description: '',
    notes: '',
    mealId: '',
    exerciseId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [plansRes, mealsRes, exercisesRes] = await Promise.all([
        fetch('http://localhost:5000/api/planning/today', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/meals/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/exercises/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const plansData = await plansRes.json();
      const mealsData = await mealsRes.json();
      const exercisesData = await exercisesRes.json();

      setPlans(plansData.plans || []);
      setMeals(mealsData.meals || []);
      setExercises(exercisesData.exercises || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Failed to load planning data');
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const completedCount = plans.filter(p => p.completed).length;
  const totalCount = plans.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activityIcons = {
    meal: { icon: Apple, color: 'text-green-500', bg: 'bg-green-50' },
    exercise: { icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50' },
    sleep: { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
    water: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.time || !formData.title) {
      toast.error('Vui lòng điền thời gian và tiêu đề!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: today,
          time: formData.time + ':00', // Add seconds for SQL Server TIME format
          activityType: formData.activityType,
          title: formData.title,
          description: formData.description,
          notes: formData.notes,
          mealId: formData.mealId ? parseInt(formData.mealId) : null,
          exerciseId: formData.exerciseId ? parseInt(formData.exerciseId) : null
        })
      });

      if (!response.ok) throw new Error('Failed to create plan');

      toast.success('Đã tạo kế hoạch thành công!');
      setShowAddDialog(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Create plan error:', error);
      toast.error('Không thể tạo kế hoạch');
    }
  };

  const handleExecutePlan = async (planId: string, planTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/planning/${planId}/execute`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to execute plan');

      toast.success(`${planTitle} đã hoàn thành và được ghi nhận!`);
      await loadData();
    } catch (error) {
      console.error('Execute plan error:', error);
      toast.error('Không thể thực thi kế hoạch');
    }
  };

  const handleToggleComplete = async (planId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/planning/${planId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(!currentStatus ? 'Đã đánh dấu hoàn thành' : 'Đã bỏ đánh dấu');
      await loadData();
    } catch (error) {
      console.error('Toggle complete error:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa kế hoạch này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/planning/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete plan');

      toast.success('Đã xóa kế hoạch');
      await loadData();
    } catch (error) {
      console.error('Delete plan error:', error);
      toast.error('Không thể xóa kế hoạch');
    }
  };

  const resetForm = () => {
    setFormData({
      time: '',
      activityType: 'meal',
      title: '',
      description: '',
      notes: '',
      mealId: '',
      exerciseId: '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C78C] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kế hoạch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Daily Planner</h1>
          <p className="text-gray-600">Lập kế hoạch và theo dõi hoạt động hàng ngày</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="gradient-primary text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm kế hoạch
        </Button>
      </div>

      <Card className="p-6 rounded-xl border-0 shadow-md bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 style={{ fontWeight: 600 }}>Tổng kết hôm nay</h3>
            <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#00C78C]" style={{ fontSize: '2rem', fontWeight: 700 }}>{completionPercentage}%</p>
            <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Hoàn thành</p>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-3" />
        <p className="text-gray-600 mt-3" style={{ fontSize: '0.875rem' }}>
          Bạn đã hoàn thành {completedCount} / {totalCount} kế hoạch hôm nay.
          {completionPercentage >= 80 && '  Xuất sắc!'}
        </p>
      </Card>

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-6" style={{ fontWeight: 600 }}>Kế hoạch hôm nay</h3>

        {plans.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Chưa có kế hoạch nào</p>
            <p className="mt-2" style={{ fontSize: '0.875rem' }}>Nhấn "Thêm kế hoạch" để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.sort((a, b) => a.time.localeCompare(b.time)).map((plan) => {
              const iconData = activityIcons[plan.activityType];
              const Icon = iconData.icon;

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    plan.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-[#00C78C]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Checkbox
                        checked={plan.completed}
                        onCheckedChange={() => handleToggleComplete(plan.id, plan.completed)}
                        className="w-5 h-5"
                      />
                      <div className={`w-12 h-12 rounded-xl ${iconData.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${iconData.color}`} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700" style={{ fontWeight: 600 }}>{plan.time}</span>
                        <span className="text-gray-500"></span>
                        <span className="text-gray-600 capitalize">{plan.activityType}</span>
                      </div>
                      <p className={`font-semibold mb-1 ${plan.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {plan.title}
                      </p>
                      {plan.description && <p className="text-gray-600 text-sm">{plan.description}</p>}
                      {plan.notes && <p className="text-gray-500 mt-1 text-sm"> {plan.notes}</p>}
                    </div>

                    <div className="flex gap-2">
                      {!plan.completed && (plan.mealId || plan.exerciseId) && (
                        <Button
                          size="sm"
                          className="gradient-primary text-white border-0"
                          onClick={() => handleExecutePlan(plan.id, plan.title)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Thực hiện
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(plan.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['meal', 'exercise', 'sleep', 'water'] as const).map((activity) => {
          const count = plans.filter(p => p.activityType === activity).length;
          const completed = plans.filter(p => p.activityType === activity && p.completed).length;
          const iconData = activityIcons[activity];
          const Icon = iconData.icon;

          return (
            <Card key={activity} className="p-4 rounded-lg border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${iconData.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconData.color}`} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm capitalize">{activity}</p>
                  <p style={{ fontWeight: 600 }}>{completed}/{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Thêm kế hoạch mới</DialogTitle>
          </DialogHeader>
          <p id="dialog-description" className="sr-only">Form để thêm kế hoạch mới cho ngày hôm nay</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Thời gian</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label>Loại hoạt động</Label>
                <Select
                  value={formData.activityType}
                  onValueChange={(value: 'meal' | 'exercise' | 'water' | 'sleep') => 
                    setFormData({ ...formData, activityType: value, mealId: '', exerciseId: '' })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meal"> Bữa ăn</SelectItem>
                    <SelectItem value="exercise"> Tập luyện</SelectItem>
                    <SelectItem value="water"> Uống nước</SelectItem>
                    <SelectItem value="sleep"> Nghỉ ngơi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.activityType === 'meal' && meals.length > 0 && (
              <div>
                <Label>Liên kết bữa ăn (tùy chọn)</Label>
                <Select
                  value={formData.mealId}
                  onValueChange={(value: string) => {
                    const meal = meals.find(m => m.id === value);
                    setFormData({ 
                      ...formData, 
                      mealId: value,
                      title: meal?.name || '',
                      description: meal ? `${meal.calories} kcal` : ''
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn bữa ăn" />
                  </SelectTrigger>
                  <SelectContent>
                    {meals.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name} ({m.calories} kcal)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.activityType === 'exercise' && exercises.length > 0 && (
              <div>
                <Label>Liên kết bài tập (tùy chọn)</Label>
                <Select
                  value={formData.exerciseId}
                  onValueChange={(value: string) => {
                    const ex = exercises.find(e => e.id === value);
                    setFormData({ 
                      ...formData, 
                      exerciseId: value,
                      title: ex?.title || '',
                      description: ex ? `${ex.duration} phút, đốt ${ex.caloriesBurned} cal` : ''
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn bài tập" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.title} ({e.duration} phút)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Tiêu đề</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Bữa sáng, Chạy bộ buổi sáng"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label>Mô tả</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tùy chọn"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú bổ sung"
                className="mt-2"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Hủy</Button>
              <Button type="submit" className="gradient-primary text-white border-0">
                <Plus className="w-4 h-4 mr-2" />Thêm kế hoạch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
