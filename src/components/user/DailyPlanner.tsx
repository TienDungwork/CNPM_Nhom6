import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useData, DailyPlanner as DailyPlannerType } from '../DataContext';
import { Calendar, Plus, Trash2, CheckCircle, Clock, Apple, Dumbbell, Moon, Droplets } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';

export function DailyPlanner() {
  const { dailyPlanners, addDailyPlanner, updateDailyPlannerStatus, deleteDailyPlanner, addActivityLog } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    time: '',
    activity: 'eating' as DailyPlannerType['activity'],
    type: '',
    description: '',
    notes: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const todayPlanners = dailyPlanners.filter(p => p.userId === '1' && p.date === today);
  const completedCount = todayPlanners.filter(p => p.completed).length;
  const totalCount = todayPlanners.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activityIcons = {
    eating: { icon: Apple, color: 'text-green-500', bg: 'bg-green-50' },
    exercise: { icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50' },
    sleep: { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
    water: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.time || !formData.type || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    addDailyPlanner({
      userId: '1',
      date: today,
      time: formData.time,
      activity: formData.activity,
      type: formData.type,
      description: formData.description,
      notes: formData.notes,
      completed: false,
    });

    addActivityLog({
      userId: '1',
      type: 'meal',
      title: 'Thêm kế hoạch mới',
      details: `${formData.activity}: ${formData.description}`,
      timestamp: new Date().toISOString(),
    });

    toast.success('Đã thêm kế hoạch thành công!');
    setShowAddForm(false);
    setFormData({
      time: '',
      activity: 'eating',
      type: '',
      description: '',
      notes: '',
    });
  };

  const handleToggleComplete = (plannerId: string, currentStatus: boolean) => {
    updateDailyPlannerStatus(plannerId, !currentStatus);
    toast.success(!currentStatus ? 'Đã hoàn thành!' : 'Đã bỏ đánh dấu');
  };

  const handleDelete = (plannerId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa kế hoạch này?')) {
      deleteDailyPlanner(plannerId);
      toast.success('Đã xóa kế hoạch');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Daily Planner</h1>
          <p className="text-gray-600">Lập kế hoạch và theo dõi hoạt động hàng ngày</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gradient-primary text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm kế hoạch
        </Button>
      </div>

      {/* Daily Summary Card */}
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
          {completionPercentage >= 80 && ' 🎉 Xuất sắc!'}
        </p>
      </Card>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <h3 className="mb-6" style={{ fontWeight: 600 }}>Thêm kế hoạch mới</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Thời gian</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="activity">Loại hoạt động</Label>
                <Select
                  value={formData.activity}
                  onValueChange={(value: DailyPlannerType['activity']) => setFormData({ ...formData, activity: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eating">🍎 Ăn uống</SelectItem>
                    <SelectItem value="exercise">🏋️ Tập luyện</SelectItem>
                    <SelectItem value="sleep">😴 Nghỉ ngơi</SelectItem>
                    <SelectItem value="water">💧 Uống nước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Chi tiết</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Ví dụ: Bữa sáng, Cardio, Ngủ trưa..."
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về hoạt động"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Thêm ghi chú..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="gradient-primary text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Thêm kế hoạch
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Planner Timeline */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-6" style={{ fontWeight: 600 }}>Kế hoạch hôm nay</h3>

        {todayPlanners.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Chưa có kế hoạch nào</p>
            <p className="mt-2" style={{ fontSize: '0.875rem' }}>Nhấn "Thêm kế hoạch" để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayPlanners
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((planner) => {
                const iconData = activityIcons[planner.activity];
                const Icon = iconData.icon;

                return (
                  <div
                    key={planner.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      planner.completed
                        ? 'bg-[#C9FDD7] border-green-300'
                        : 'bg-white border-gray-200 hover:border-[#00C78C]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Checkbox
                          checked={planner.completed}
                          onCheckedChange={() => handleToggleComplete(planner.id, planner.completed)}
                          className="w-5 h-5"
                        />
                        <div className={`w-12 h-12 rounded-xl ${iconData.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${iconData.color}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700" style={{ fontWeight: 600 }}>{planner.time}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{planner.type}</span>
                        </div>
                        <p className={planner.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                          {planner.description}
                        </p>
                        {planner.notes && (
                          <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
                            📝 {planner.notes}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(planner.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['eating', 'exercise', 'sleep', 'water'].map((activity) => {
          const count = todayPlanners.filter(p => p.activity === activity).length;
          const completed = todayPlanners.filter(p => p.activity === activity && p.completed).length;
          const iconData = activityIcons[activity as keyof typeof activityIcons];
          const Icon = iconData.icon;

          return (
            <Card key={activity} className="p-4 rounded-lg border-0 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${iconData.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconData.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    {activity === 'eating' && 'Ăn uống'}
                    {activity === 'exercise' && 'Tập luyện'}
                    {activity === 'sleep' && 'Nghỉ ngơi'}
                    {activity === 'water' && 'Uống nước'}
                  </p>
                  <p style={{ fontWeight: 600 }}>{completed}/{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
