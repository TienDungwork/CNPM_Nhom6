import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  BarChart3, 
  Database, 
  Server, 
  Code2, 
  CheckSquare, 
  Shield, 
  GitBranch, 
  Calendar, 
  HelpCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function ProjectReview() {
  const [activeSection, setActiveSection] = useState('overview');
  const [checklist, setChecklist] = useState({
    db1: false,
    db2: false,
    db3: false,
    be1: false,
    be2: false,
    be3: false,
    be4: false,
    be5: false,
    fe1: false,
    fe2: false,
    fe3: false,
    fe4: false,
    fe5: false,
    fe6: false,
    test1: false,
    test2: false,
    test3: false,
    test4: false,
  });

  const progressData = [
    { name: 'Frontend', value: 100, color: '#00C78C' },
    { name: 'Backend', value: 0, color: '#EF4444' },
    { name: 'Integration', value: 40, color: '#F59E0B' },
  ];

  const overallProgress = 60;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'code-tree', label: 'Code Tree', icon: Code2 },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'architecture', label: 'Architecture', icon: GitBranch },
    { id: 'roadmap', label: 'Roadmap', icon: Calendar },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span>HealthyColors – Project Review Summary</span>
              </h1>
              <p className="text-muted-foreground">
                Ngày review: 18/10/2025 · Reviewer: GitHub Copilot · Project: HealthyColors Health Management System
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-500">Frontend 100%</Badge>
              <Badge variant="destructive">Backend 0%</Badge>
              <Badge className="bg-yellow-500">Integration 40%</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r h-[calc(100vh-73px)] sticky top-[73px]">
          <ScrollArea className="h-full">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Project có frontend đẹp và database schema tốt, còn thiếu backend API layer và tích hợp JWT. 
                Kế hoạch hiện tại có thể hoàn thiện trong 1–2 tuần theo hướng dẫn.
              </p>
            </CardContent>
          </Card>

          {/* Overview Section */}
          <section id="overview" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Overview (Status)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Completed */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    ĐÃ CÓ (Hoàn thành)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Frontend:</strong> React + TypeScript + Vite (100%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>UI Components & Routing:</strong> hoàn thiện với Auth Flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Database Schema:</strong> SQL Server – 9 bảng + 3 stored procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Mock Data:</strong> DataContext.tsx — present</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>User & Admin Screens:</strong> All pages completed</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Missing */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    CẦN LÀM (Thiếu)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Backend API (Node.js + Express):</strong> chưa có</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>JWT Authentication:</strong> chưa hoạt động</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Database Connection:</strong> cần liên kết với SQL Server thật</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>API Integration:</strong> frontend đang dùng mock data</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Frontend</span>
                        <span className="text-green-600">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Backend</span>
                        <span className="text-red-600">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Integration</span>
                        <span className="text-yellow-600">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <Separator />
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Overall Progress</span>
                        <span className="text-primary">60%</span>
                      </div>
                      <Progress value={overallProgress} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Backend Section */}
          <section id="backend" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <Server className="w-6 h-6 text-primary" />
              Backend (Detail)
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Backend Implementation – Missing Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Thành phần</th>
                        <th className="text-left py-3 px-4">Trạng thái</th>
                        <th className="text-left py-3 px-4">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">backend/ folder</td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">❌</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">chưa có</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Express server</td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">❌</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">cần server.js</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Routes (auth, meals, exercises...)</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500">⚠️</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">chưa tạo</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">JWT Middleware</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500">⚠️</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">chưa có</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">MSSQL Connection</td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">❌</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">cần file config/database.js</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">API Integration</td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">❌</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">chưa có fetch/axios</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Note:</strong> Cần tạo cấu trúc backend/ với routes, controllers, middleware. 
                    Cài các package: express, mssql, cors, dotenv, bcrypt, jsonwebtoken.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backend Structure (Cần tạo)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{`backend/
  server.js
  .env
  config/database.js
  routes/
    auth.routes.js
    meals.routes.js
    exercises.routes.js
    user.routes.js
    admin.routes.js
    feedback.routes.js
  controllers/
    authController.js
    mealsController.js
    exercisesController.js
    userController.js
    adminController.js
    feedbackController.js
  middleware/
    auth.middleware.js
    admin.middleware.js`}</code>
                </pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>express</Badge>
                  <Badge>mssql</Badge>
                  <Badge>cors</Badge>
                  <Badge>dotenv</Badge>
                  <Badge>bcrypt</Badge>
                  <Badge>jsonwebtoken</Badge>
                  <Badge>express-validator</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Database Section */}
          <section id="database" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Database (SQL Server · DB = CNPM)
            </h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Database CNPM — SQL Server (đã thiết kế)</CardTitle>
                <CardDescription>
                  Database: CNPM (SQL Server) · 9 tables · 3 stored procedures: SP_CopyMealToUser, SP_CopyExerciseToUser, SP_GetUserStatistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Table</th>
                        <th className="text-left py-3 px-4">Mục đích</th>
                        <th className="text-left py-3 px-4">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">Users</td>
                        <td className="py-3 px-4 text-muted-foreground">Quản lý tài khoản</td>
                        <td className="py-3 px-4 text-muted-foreground">gồm role: user/admin</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Meals</td>
                        <td className="py-3 px-4 text-muted-foreground">Món ăn admin</td>
                        <td className="py-3 px-4 text-muted-foreground">source = 'admin'</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">UserMeals</td>
                        <td className="py-3 px-4 text-muted-foreground">Món ăn người dùng</td>
                        <td className="py-3 px-4 text-muted-foreground">source = 'user'</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Exercises</td>
                        <td className="py-3 px-4 text-muted-foreground">Bài tập admin</td>
                        <td className="py-3 px-4 text-muted-foreground">có level, duration</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">UserExercises</td>
                        <td className="py-3 px-4 text-muted-foreground">Bài tập cá nhân</td>
                        <td className="py-3 px-4 text-muted-foreground">cho phép chỉnh sửa riêng</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">SleepRecords</td>
                        <td className="py-3 px-4 text-muted-foreground">Log giấc ngủ</td>
                        <td className="py-3 px-4 text-muted-foreground">giờ bắt đầu / kết thúc</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">WaterLogs</td>
                        <td className="py-3 px-4 text-muted-foreground">Lượng nước</td>
                        <td className="py-3 px-4 text-muted-foreground">tần suất uống</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">ActivityLogs</td>
                        <td className="py-3 px-4 text-muted-foreground">Nhật ký hoạt động</td>
                        <td className="py-3 px-4 text-muted-foreground">tổng hợp ngày</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Feedback</td>
                        <td className="py-3 px-4 text-muted-foreground">Phản hồi người dùng</td>
                        <td className="py-3 px-4 text-muted-foreground">trạng thái xử lý</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Note:</strong> Database hiện đã thiết kế đầy đủ schema nhưng chưa được kết nối thật (chỉ lưu localStorage). 
                    Cần update API backend để truy xuất dữ liệu SQL Server (DB: CNPM).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entity Relationship Diagram (Simplified)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-primary rounded-lg p-3 min-w-[150px]">
                      <p>Users</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>UserMeals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-primary rounded-lg p-3 min-w-[150px]">
                      <p>Users</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>UserExercises</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-primary rounded-lg p-3 min-w-[150px]">
                      <p>Users</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>SleepRecords</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-primary rounded-lg p-3 min-w-[150px]">
                      <p>Users</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>WaterLogs</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-green-500 rounded-lg p-3 min-w-[150px]">
                      <p>Meals</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>UserMeals (BaseMealId)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-green-500 rounded-lg p-3 min-w-[150px]">
                      <p>Exercises</p>
                    </div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="text-muted-foreground">1:n</div>
                    <div className="flex-1 border-t-2 border-gray-300"></div>
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
                      <p>UserExercises (BaseExerciseId)</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-3">
                    <p><strong>ActivityLogs</strong> (per user per date) tổng hợp từ UserMeals/UserExercises/Sleep/Water</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Code Tree Section */}
          <section id="code-tree" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              Code Tree (File View)
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
                <CardDescription>
                  Note: DataContext.tsx đang chứa mock data & localStorage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{`HealthColors/
├─ src/
│  ├─ components/
│  │  ├─ user/           ✅
│  │  ├─ admin/          ✅
│  │  ├─ ui/             ✅
│  │  ├─ AuthContext.tsx ✅
│  │  └─ DataContext.tsx ✅ (mock data)
│  ├─ pages/             ✅
│  ├─ context/           ✅
│  ├─ services/
│  │  └─ api.js          ❌ chưa có – cần thêm API service
│  └─ styles/            ✅
├─ backend/              ❌ chưa có – sẽ được tạo trong phase tiếp theo
│  ├─ server.js
│  ├─ config/
│  ├─ routes/
│  ├─ controllers/
│  └─ middleware/
└─ SQL_QUICK_START.sql   ✅`}</code>
                </pre>
                <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                  <p className="text-muted-foreground">
                    <strong>Note:</strong> Frontend hiện hoạt động độc lập, cần bổ sung API service để gọi dữ liệu thật từ backend.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Checklist Section */}
          <section id="checklist" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-primary" />
              Checklist (Implementation)
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    B1 – Setup Database (30 phút)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="db1"
                      checked={checklist.db1}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, db1: checked as boolean })
                      }
                    />
                    <label htmlFor="db1" className="cursor-pointer">
                      Cài SQL Server 2019+ / Express
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="db2"
                      checked={checklist.db2}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, db2: checked as boolean })
                      }
                    />
                    <label htmlFor="db2" className="cursor-pointer">
                      Chạy SQL_QUICK_START.sql
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="db3"
                      checked={checklist.db3}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, db3: checked as boolean })
                      }
                    />
                    <label htmlFor="db3" className="cursor-pointer">
                      Verify: SELECT * FROM Users
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    B2 – Build Backend (4–6 giờ)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="be1"
                      checked={checklist.be1}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, be1: checked as boolean })
                      }
                    />
                    <label htmlFor="be1" className="cursor-pointer">
                      Tạo backend/ + server.js
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="be2"
                      checked={checklist.be2}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, be2: checked as boolean })
                      }
                    />
                    <label htmlFor="be2" className="cursor-pointer">
                      Cài deps (express mssql cors dotenv bcrypt jsonwebtoken express-validator)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="be3"
                      checked={checklist.be3}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, be3: checked as boolean })
                      }
                    />
                    <label htmlFor="be3" className="cursor-pointer">
                      Tạo routes/controllers
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="be4"
                      checked={checklist.be4}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, be4: checked as boolean })
                      }
                    />
                    <label htmlFor="be4" className="cursor-pointer">
                      Tích hợp JWT auth
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    B3 – Connect Frontend (2–3 giờ)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe1"
                      checked={checklist.fe1}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe1: checked as boolean })
                      }
                    />
                    <label htmlFor="fe1" className="cursor-pointer">
                      src/services/api.js (base API_URL)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe2"
                      checked={checklist.fe2}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe2: checked as boolean })
                      }
                    />
                    <label htmlFor="fe2" className="cursor-pointer">
                      Update DataContext.tsx gọi API thật
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe3"
                      checked={checklist.fe3}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe3: checked as boolean })
                      }
                    />
                    <label htmlFor="fe3" className="cursor-pointer">
                      Update AuthContext.tsx lưu JWT
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe4"
                      checked={checklist.fe4}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe4: checked as boolean })
                      }
                    />
                    <label htmlFor="fe4" className="cursor-pointer">
                      Loading & error states
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe5"
                      checked={checklist.fe5}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe5: checked as boolean })
                      }
                    />
                    <label htmlFor="fe5" className="cursor-pointer">
                      Tạo kết nối thật giữa frontend ↔ backend qua axios service
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="fe6"
                      checked={checklist.fe6}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, fe6: checked as boolean })
                      }
                    />
                    <label htmlFor="fe6" className="cursor-pointer">
                      Thực hiện JWT Authentication flow (login/signup/forgot password)
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    B4 – Testing (1–2 giờ)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="test1"
                      checked={checklist.test1}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, test1: checked as boolean })
                      }
                    />
                    <label htmlFor="test1" className="cursor-pointer">
                      Postman collections
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="test2"
                      checked={checklist.test2}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, test2: checked as boolean })
                      }
                    />
                    <label htmlFor="test2" className="cursor-pointer">
                      Login/Signup flow
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="test3"
                      checked={checklist.test3}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, test3: checked as boolean })
                      }
                    />
                    <label htmlFor="test3" className="cursor-pointer">
                      CRUD Meals/Exercises
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="test4"
                      checked={checklist.test4}
                      onCheckedChange={(checked) =>
                        setChecklist({ ...checklist, test4: checked as boolean })
                      }
                    />
                    <label htmlFor="test4" className="cursor-pointer">
                      Admin dashboards
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Security & Architecture Section */}
          <section id="security" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Security & Architecture
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Shield className="w-5 h-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Password hash (bcrypt)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>JWT auth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Param queries (anti-SQLi)</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Input validation middleware (chưa có)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Rate limiting (chưa cấu hình)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <GitBranch className="w-5 h-5" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>RESTful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>SoC (Routes → Controllers → DB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>RBAC (User/Admin)</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Chưa caching (Redis)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Chưa pagination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Image upload (URL-only)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  <strong>Note:</strong> Hiện tại kiến trúc đã RESTful nhưng chưa tách riêng backend. 
                  Sau khi bổ sung Express API, hệ thống sẽ đạt chuẩn MVC.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Roadmap Section */}
          <section id="roadmap" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Roadmap (Timeline)
            </h2>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Phase 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                        1
                      </div>
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3>Phase 1 – MVP</h3>
                      <p className="text-muted-foreground mb-2">Timeline: 2 tuần</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Backend cơ bản</li>
                        <li>Kết nối FE</li>
                        <li>Local test</li>
                      </ul>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        2
                      </div>
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3>Phase 2 – Enhancement</h3>
                      <p className="text-muted-foreground mb-2">Timeline: 2–4 tuần</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Upload ảnh</li>
                        <li>Reset mật khẩu</li>
                        <li>Pagination</li>
                        <li>Advanced stats</li>
                      </ul>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                        3
                      </div>
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3>Phase 3 – Production</h3>
                      <p className="text-muted-foreground mb-2">Timeline: 1–2 tuần</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Deploy BE (Heroku/Azure/Railway)</li>
                        <li>FE (Vercel)</li>
                        <li>CI/CD</li>
                        <li>Monitoring/Logging</li>
                      </ul>
                    </div>
                  </div>

                  {/* Phase 4 - NEW */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3>Phase 4 – Database Integration</h3>
                      <p className="text-muted-foreground mb-2">Timeline: 1 tuần</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Kết nối backend tới SQL Server</li>
                        <li>Ghi/đọc dữ liệu thực</li>
                        <li>Kiểm thử CRUD</li>
                        <li>Triển khai auth thực tế</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Support Section */}
          <section id="support" className="scroll-mt-8">
            <h2 className="mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Support
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn nhanh & Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p><strong>Database errors</strong></p>
                    <p className="text-muted-foreground">Kiểm tra SQL Server & credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p><strong>Backend connection error</strong></p>
                    <p className="text-muted-foreground">Kiểm tra file .env và cấu hình MSSQL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p><strong>Connection</strong></p>
                    <p className="text-muted-foreground">Verify .env & firewall</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p><strong>CORS</strong></p>
                    <p className="text-muted-foreground">app.use(cors())</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p><strong>JWT error</strong></p>
                    <p className="text-muted-foreground">Verify token expiration</p>
                  </div>
                </div>
                <Separator />
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="mb-3">Ghi chú Backend:</p>
                  <p className="text-muted-foreground mb-4">
                    Cần khởi tạo backend/, thiết lập Express, kết nối mssql, JWT, routes & controllers; 
                    FE chuyển từ mock/localStorage sang API Service Layer.
                  </p>
                  <Button className="gap-2">
                    <FileText className="w-4 h-4" />
                    Open BACKEND_IMPLEMENTATION_GUIDE.md
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2">🚀 Ready to build the backend?</h3>
                <p className="text-muted-foreground mb-4">
                  Hệ thống frontend đã hoàn thiện. Bắt đầu implement backend theo checklist để hoàn thành dự án!
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="default">Start Implementation</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
