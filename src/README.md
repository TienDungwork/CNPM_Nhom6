# 🌿 HealthyColors - Health Management System

<div align="center">

![HealthyColors Logo](https://via.placeholder.com/150/00C78C/FFFFFF?text=HC)

**Modern health and wellness management platform**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)](https://nodejs.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927?logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)](https://expressjs.com/)

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [API](#-api-documentation)

</div>

---

## 📖 Giới thiệu

**HealthyColors** là hệ thống quản lý sức khỏe toàn diện với giao diện hiện đại, được thiết kế theo phong cách flat design tương tự Apple Health. Hệ thống hỗ trợ phân quyền User/Admin với dashboard riêng biệt và các tính năng quản lý dinh dưỡng, thể dục, giấc ngủ, và hoạt động hàng ngày.

### 🎯 Mục tiêu

- Theo dõi và quản lý sức khỏe cá nhân
- Tính toán calories và gợi ý thực đơn
- Lên kế hoạch tập luyện
- Theo dõi giấc ngủ và uống nước
- Ghi nhật ký hoạt động hàng ngày
- Hỗ trợ AI chatbot

---

## ✨ Features

### 👤 User Features

- **📊 Dashboard** - Thống kê tổng quan về sức khỏe
- **🍎 Nutrition**
  - Calorie Calculator - Tính toán lượng calories cần thiết
  - Meal Suggestions - Gợi ý thực đơn từ admin
- **💪 Fitness**
  - Exercise Plans - Kế hoạch tập luyện cá nhân hóa
- **🌙 Wellness**
  - Sleep Tracker - Theo dõi giấc ngủ
  - Water Reminder - Nhắc nhở uống nước
  - Daily Activity Log - Nhật ký hoạt động
- **🤖 Assistant**
  - Chatbot - Trợ lý ảo AI
- **📝 Feedback** - Gửi phản hồi cho admin

### 👨‍💼 Admin Features

- **📈 Dashboard** - Thống kê tổng quan hệ thống
- **👥 User Management** - Quản lý người dùng
- **🍽️ Meal Management** - Quản lý thực đơn mẫu (CRUD)
- **🏋️ Exercise Management** - Quản lý bài tập mẫu (CRUD)
- **💬 Feedback Review** - Xem và phản hồi feedback
- **📊 Statistics** - Báo cáo và phân tích

### 🔐 Security & Authentication

- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing (bcrypt)
- Protected API routes

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- SQL Server 2019+
- npm hoặc yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/healthycolors.git
cd healthycolors

# 2. Setup Database
sqlcmd -S localhost -U sa -P YourPassword -i SQL_QUICK_START.sql

# 3. Setup Backend
cd backend
npm install
# Edit .env file với thông tin database
npm run dev

# 4. Setup Frontend (terminal mới)
cd ..
npm install
npm run dev
```

**Chi tiết:** Xem [QUICK_START.md](./QUICK_START.md)

---

## 🏗️ Tech Stack

### Frontend

- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Shadcn/UI** - Component library
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend

- **Node.js 16+** - Runtime
- **Express 4.18** - Web framework
- **SQL Server** - Database
- **mssql** - SQL Server driver
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin support

---

## 📂 Project Structure

```
healthycolors/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── mealsController.js
│   │   ├── exercisesController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification
│   │   └── admin.middleware.js
│   ├── routes/                # API routes
│   ├── .env                   # Environment config
│   ├── server.js              # Entry point
│   └── package.json
│
├── components/                # React components
│   ├── user/                  # User features
│   │   ├── DashboardHome.tsx
│   │   ├── CalorieCalculator.tsx
│   │   ├── MealSuggestionsNew.tsx
│   │   ├── ExercisePlansNew.tsx
│   │   ├── SleepTracker.tsx
│   │   ├── WaterReminder.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── Chatbot.tsx
│   │   └── Feedback.tsx
│   │
│   ├── admin/                 # Admin features
│   │   ├── AdminHome.tsx
│   │   ├── UserManagement.tsx
│   │   ├── MealManagement.tsx
│   │   ├── ExerciseManagement.tsx
│   │   ├── FeedbackReview.tsx
│   │   └── Statistics.tsx
│   │
│   ├── ui/                    # UI components (Shadcn)
│   ├── AuthContext.tsx        # Auth state management
│   ├── DataContext.tsx        # Data state management
│   └── ...
│
├── src/
│   └── services/
│       └── api.ts             # API client & endpoints
│
├── styles/
│   └── globals.css            # Global styles & Tailwind config
│
├── .env                       # Frontend environment
├── App.tsx                    # Main app component
├── SQL_QUICK_START.sql        # Database schema
└── package.json
```

---

## 🗄️ Database Schema

### 9 Tables

1. **Users** - Thông tin người dùng
2. **Meals** - Thực đơn mẫu (admin)
3. **UserMeals** - Thực đơn cá nhân (user copies)
4. **Exercises** - Bài tập mẫu (admin)
5. **UserExercises** - Bài tập cá nhân (user copies)
6. **SleepRecords** - Ghi chép giấc ngủ
7. **WaterLogs** - Nhật ký uống nước
8. **ActivityLogs** - Nhật ký hoạt động
9. **Feedback** - Phản hồi người dùng

### 2 Stored Procedures

- `SP_CopyMealToUser` - Copy meal từ admin sang user
- `SP_CopyExerciseToUser` - Copy exercise từ admin sang user
- `SP_GetUserStatistics` - Lấy thống kê user

**Chi tiết:** Xem [SQL_SERVER_SCHEMA.md](./SQL_SERVER_SCHEMA.md)

---

## 🔌 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Tất cả protected endpoints yêu cầu JWT token:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 🔐 Authentication

```http
POST   /api/auth/register         # Đăng ký
POST   /api/auth/login            # Đăng nhập
GET    /api/auth/profile          # Lấy profile
PUT    /api/auth/profile          # Cập nhật profile
POST   /api/auth/change-password  # Đổi mật khẩu
```

#### 🍽️ Meals

```http
GET    /api/meals/admin           # Lấy meals của admin
GET    /api/meals/user            # Lấy meals cá nhân
POST   /api/meals/copy/:id        # Copy meal từ admin
POST   /api/meals                 # Tạo meal mới
PUT    /api/meals/:id             # Cập nhật meal
DELETE /api/meals/:id             # Xóa meal
```

#### 🏋️ Exercises

```http
GET    /api/exercises/admin       # Lấy exercises của admin
GET    /api/exercises/user        # Lấy exercises cá nhân
POST   /api/exercises/copy/:id    # Copy exercise từ admin
POST   /api/exercises             # Tạo exercise mới
PUT    /api/exercises/:id         # Cập nhật exercise
DELETE /api/exercises/:id         # Xóa exercise
```

#### 📊 User Data

```http
GET    /api/user/statistics       # Thống kê user
GET    /api/user/sleep            # Sleep records
POST   /api/user/sleep            # Thêm sleep record
GET    /api/user/water            # Water logs
POST   /api/user/water            # Thêm water log
GET    /api/user/activity         # Activity logs
POST   /api/user/activity         # Thêm activity log
```

#### 👨‍💼 Admin (requires admin role)

```http
GET    /api/admin/statistics      # Dashboard stats
GET    /api/admin/users           # Danh sách users
POST   /api/admin/meals           # Tạo admin meal
PUT    /api/admin/meals/:id       # Cập nhật admin meal
DELETE /api/admin/meals/:id       # Xóa admin meal
POST   /api/admin/exercises       # Tạo admin exercise
PUT    /api/admin/exercises/:id   # Cập nhật admin exercise
DELETE /api/admin/exercises/:id   # Xóa admin exercise
```

#### 💬 Feedback

```http
POST   /api/feedback              # Gửi feedback
GET    /api/feedback/my-feedback  # Feedback của user
GET    /api/feedback/all          # Tất cả feedback (admin)
PUT    /api/feedback/:id          # Cập nhật feedback (admin)
DELETE /api/feedback/:id          # Xóa feedback (admin)
```

**API Details:** Xem [backend/README.md](./backend/README.md)

---

## 🎨 Design System

### Colors

- **Primary:** `#00C78C` - Xanh ngọc
- **Accent:** `#00E6A0` - Xanh nhạt
- **Background:** `#FFFFFF` - Trắng
- **Secondary:** `#F5F5F5` - Xám nhạt

### Typography

- **Font Family:** Poppins
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Design Philosophy

Flat design hiện đại lấy cảm hứng từ Apple Health với:
- Clean & minimal interface
- Consistent spacing & alignment
- Smooth transitions & animations
- Clear visual hierarchy

---

## 📚 Documentation

- [📖 Quick Start Guide](./QUICK_START.md) - Hướng dẫn bắt đầu nhanh
- [🔧 Backend Implementation](./BACKEND_IMPLEMENTATION_GUIDE.md) - Chi tiết backend
- [🗄️ Database Schema](./SQL_SERVER_SCHEMA.md) - Cấu trúc database
- [📋 Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Tổng kết implementation
- [🔍 Project Review](./components/ProjectReview.tsx) - Review tổng quan

---

## 🔧 Development

### Running in Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Building for Production

```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Backend (backend/.env):**
```env
PORT=3000
DB_SERVER=localhost
DB_DATABASE=CNPM
DB_USER=sa
DB_PASSWORD=YourPassword
JWT_SECRET=your-secret-key
```

---

## 🧪 Testing

### Test API với curl

```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

**HealthyColors Development Team**

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + SQL Server
- Design: Flat Design Modern

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. Kiểm tra [Quick Start Guide](./QUICK_START.md)
2. Xem [Troubleshooting section](./QUICK_START.md#-troubleshooting)
3. Mở issue trên GitHub

---

## 🎯 Roadmap

- [x] ✅ Frontend hoàn chỉnh
- [x] ✅ Backend API
- [x] ✅ Database integration
- [x] ✅ JWT Authentication
- [x] ✅ Role-based access
- [ ] 🔜 Real AI Chatbot integration
- [ ] 🔜 Email service (password reset)
- [ ] 🔜 Data visualization improvements
- [ ] 🔜 Mobile responsive optimization
- [ ] 🔜 Production deployment

---

<div align="center">

**Made with ❤️ and 💚 by HealthyColors Team**

[⬆ Back to top](#-healthycolors---health-management-system)

</div>
