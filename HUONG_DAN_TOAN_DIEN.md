# 📚 HƯỚNG DẪN TOÀN DIỆN - HEALTHYCOLORS SYSTEM

## 📖 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Cấu trúc thư mục chi tiết](#2-cấu-trúc-thư-mục-chi-tiết)
3. [Database Schema & SQL](#3-database-schema--sql)
4. [Backend API - Controllers](#4-backend-api---controllers)
5. [Frontend Components](#5-frontend-components)
6. [Luồng dữ liệu & Authentication](#6-luồng-dữ-liệu--authentication)
7. [Cách sửa lỗi thường gặp](#7-cách-sửa-lỗi-thường-gặp)
8. [Test & Debugging](#8-test--debugging)

---

## 1. TỔNG QUAN HỆ THỐNG

### 🎯 Kiến trúc: 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (React + TypeScript + Vite)                  │
│  - Port: 3000                                           │
│  - UI Components, State Management, Routing             │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST API
                        │ (axios)
┌───────────────────────▼─────────────────────────────────┐
│  BACKEND (Node.js + Express)                           │
│  - Port: 5000                                          │
│  - Controllers, Middleware, Routes, Business Logic     │
└───────────────────────┬─────────────────────────────────┘
                        │ SQL Queries
                        │ (mssql package)
┌───────────────────────▼─────────────────────────────────┐
│  DATABASE (SQL Server)                                 │
│  - Port: 1433                                          │
│  - Tables, Stored Procedures, Views                    │
└─────────────────────────────────────────────────────────┘
```

### 📦 Tech Stack

**Frontend:**
- React 18.3 + TypeScript 5.6
- Vite (build tool)
- Tailwind CSS v4
- Shadcn/UI (component library)
- Recharts (charts)
- Axios (HTTP client)
- React Router v7

**Backend:**
- Node.js 16+
- Express 4.18
- JWT (authentication)
- bcrypt (password hashing)
- mssql (SQL Server driver)

**Database:**
- SQL Server 2019+
- 9 tables
- Stored procedures
- Indexes

---

## 2. CẤU TRÚC THƯ MỤC CHI TIẾT

```
D:\TLU\CNPM\HealthCare/
│
├── 📁 src/
│   ├── 📁 backend/                          # ⚙️ BACKEND API
│   │   ├── 📁 config/
│   │   │   └── database.js                  # ✅ Kết nối SQL Server
│   │   │
│   │   ├── 📁 controllers/                  # 🎯 Business Logic
│   │   │   ├── authController.js            # Đăng ký, đăng nhập, profile
│   │   │   ├── mealsController.js           # CRUD meals
│   │   │   ├── exercisesController.js       # CRUD exercises
│   │   │   ├── activityController.js        # Log meals/exercises/water/sleep
│   │   │   ├── planningController.js        # Daily plans (FIXED TIME issues)
│   │   │   ├── profileController.js         # User profile
│   │   │   ├── userController.js            # User statistics
│   │   │   ├── adminController.js           # Admin operations
│   │   │   └── feedbackController.js        # Feedback system
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── auth.middleware.js           # JWT verification (verifyToken)
│   │   │   └── admin.middleware.js          # Check admin role
│   │   │
│   │   ├── 📁 routes/                       # 🛣️ API Routes
│   │   │   ├── auth.routes.js               # /api/auth/*
│   │   │   ├── meals.routes.js              # /api/meals/*
│   │   │   ├── exercises.routes.js          # /api/exercises/*
│   │   │   ├── activity.routes.js           # /api/activity/*
│   │   │   ├── planning.routes.js           # /api/planning/*
│   │   │   ├── profile.routes.js            # /api/profile/*
│   │   │   ├── user.routes.js               # /api/user/*
│   │   │   ├── admin.routes.js              # /api/admin/*
│   │   │   └── feedback.routes.js           # /api/feedback/*
│   │   │
│   │   ├── server.js                        # 🚀 Entry point
│   │   ├── package.json                     # Dependencies
│   │   ├── .env                            # ⚠️ Config (không commit)
│   │   │
│   │   └── 📁 test scripts/                # 🧪 Testing
│   │       ├── test-sleep-dashboard.js      # Test sleep integration
│   │       ├── test-sleep-tracker.js        # Test sleep APIs
│   │       ├── test-auto-complete.js        # Test plan auto-complete
│   │       └── test-planning-quick.js       # Test planning APIs
│   │
│   ├── 📁 components/                       # 🎨 REACT COMPONENTS
│   │   ├── 📁 user/                         # User Features
│   │   │   ├── DashboardHome.tsx            # Dashboard tổng quan
│   │   │   ├── CalorieCalculator.tsx        # Tính calories
│   │   │   ├── MealSuggestionsNew.tsx       # Gợi ý thực đơn
│   │   │   ├── ExercisePlansNew.tsx         # Kế hoạch tập luyện
│   │   │   ├── DailyPlanner.tsx             # ✅ Lập kế hoạch hàng ngày
│   │   │   ├── SleepTracker.tsx             # ✅ Theo dõi giấc ngủ
│   │   │   ├── WaterReminder.tsx            # Nhắc uống nước
│   │   │   ├── ActivityLog.tsx              # ✅ Nhật ký hoạt động
│   │   │   ├── Chatbot.tsx                  # AI chatbot
│   │   │   └── Feedback.tsx                 # Gửi feedback
│   │   │
│   │   ├── 📁 admin/                        # Admin Features
│   │   │   ├── AdminHome.tsx                # Admin dashboard
│   │   │   ├── UserManagement.tsx           # Quản lý users
│   │   │   ├── MealManagement.tsx           # Quản lý meals
│   │   │   ├── ExerciseManagement.tsx       # Quản lý exercises
│   │   │   ├── FeedbackReview.tsx           # Xem feedback
│   │   │   └── Statistics.tsx               # Thống kê
│   │   │
│   │   ├── 📁 ui/                           # Shadcn/UI Components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ... (40+ components)
│   │   │
│   │   ├── AuthContext.tsx                  # ✅ Auth state (JWT, user info)
│   │   ├── DataContext.tsx                  # Data state management
│   │   ├── Header.tsx                       # Navigation header
│   │   ├── Footer.tsx                       # Footer
│   │   ├── LoginPage.tsx                    # Đăng nhập
│   │   ├── SignUpPage.tsx                   # Đăng ký
│   │   ├── UserDashboard.tsx                # User layout
│   │   └── AdminDashboard.tsx               # Admin layout
│   │
│   ├── 📁 services/
│   │   └── adminAPI.ts                      # API client functions
│   │
│   ├── 📁 styles/
│   │   └── globals.css                      # Global styles + Tailwind
│   │
│   ├── App.tsx                              # Main app component
│   ├── main.tsx                             # Entry point
│   ├── README.md                            # ✅ Documentation
│   ├── SQL_QUICK_START.sql                  # ✅ Database schema
│   └── QUICK_SQL_AUTH_SETUP.md              # SQL auth setup
│
├── index.html                               # HTML entry
├── package.json                             # Frontend dependencies
├── vite.config.ts                           # Vite configuration
├── tailwind.config.js                       # Tailwind config
├── tsconfig.json                            # TypeScript config
│
├── start-dev.ps1                            # ✅ PowerShell script để start
└── stop-dev.ps1                             # ✅ PowerShell script để stop
```

---

## 3. DATABASE SCHEMA & SQL

### 📊 9 Tables Chính

#### 1️⃣ **Users** - Người dùng
```sql
CREATE TABLE Users (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name NVARCHAR(100) NOT NULL,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,  -- bcrypt hash
  Role VARCHAR(10) CHECK (Role IN ('user','admin')),
  Status VARCHAR(20) DEFAULT 'active',
  CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
```
**Giải thích:**
- `Id`: UUID làm primary key
- `PasswordHash`: Mật khẩu được hash bằng bcrypt (KHÔNG lưu plain text)
- `Role`: Phân quyền user/admin
- `Status`: active/locked để khóa tài khoản

**Test users có sẵn:**
- `admin@test.com` / `123456` (admin)
- `test@example.com` / `Test123456` (user)

---

#### 2️⃣ **Meals** - Thực đơn mẫu (Admin tạo)
```sql
CREATE TABLE Meals (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name NVARCHAR(150) NOT NULL,
  Calories INT CHECK (Calories >= 0),
  Type VARCHAR(20) CHECK (Type IN ('breakfast','lunch','dinner','snack')),
  Protein INT DEFAULT 0,
  Carbs INT DEFAULT 0,
  Fat INT DEFAULT 0,
  PrepTime INT DEFAULT 15,
  Image NVARCHAR(500),
  IngredientsJson NVARCHAR(MAX),  -- JSON array: ["ingredient1", "ingredient2"]
  StepsJson NVARCHAR(MAX),        -- JSON array: ["step1", "step2"]
  Source VARCHAR(10) DEFAULT 'admin',
  CreatorId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
  Status VARCHAR(10) DEFAULT 'public',
  CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
```
**Giải thích:**
- Admin tạo meals này làm "template"
- Users có thể copy về để customize
- `IngredientsJson` & `StepsJson`: Lưu dạng JSON string
- `Status`: public/hidden để ẩn/hiện

---

#### 3️⃣ **UserMeals** - Thực đơn cá nhân (User)
```sql
CREATE TABLE UserMeals (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
  BaseMealId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Meals(Id) ON DELETE SET NULL,
  Name NVARCHAR(150),
  Calories INT,
  -- ... giống Meals table
  Source VARCHAR(10) CHECK (Source IN ('copy','custom')),
  CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
```
**Giải thích:**
- Users copy từ admin hoặc tạo custom
- `BaseMealId`: Link về meal gốc (nếu là copy)
- `Source`: 'copy' (từ admin) hoặc 'custom' (tự tạo)
- ON DELETE CASCADE: Xóa user → xóa hết meals của user đó

---

#### 4️⃣ **Exercises** - Bài tập mẫu (Admin)
```sql
CREATE TABLE Exercises (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Title NVARCHAR(150),
  MuscleGroup NVARCHAR(80),  -- "Chest", "Back", "Legs"...
  Duration INT,              -- minutes
  Difficulty VARCHAR(20) CHECK (Difficulty IN ('Beginner','Intermediate','Advanced')),
  CaloriesBurned INT DEFAULT 100,
  Image NVARCHAR(500),
  Description NVARCHAR(500),
  StepsJson NVARCHAR(MAX),
  Source VARCHAR(10) DEFAULT 'admin',
  Status VARCHAR(10) DEFAULT 'public',
  CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
```

---

#### 5️⃣ **UserExercises** - Bài tập cá nhân (User)
```sql
CREATE TABLE UserExercises (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
  BaseExerciseId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Exercises(Id),
  -- ... giống Exercises
  Source VARCHAR(10) CHECK (Source IN ('copy','custom'))
);
```

---

#### 6️⃣ **SleepLogs** - Ghi chép giấc ngủ ✅ (MỚI)
```sql
CREATE TABLE SleepLogs (
  SleepID INT IDENTITY(1,1) PRIMARY KEY,
  UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
  SleepDate DATE NOT NULL,
  Duration DECIMAL(4,2),     -- hours (e.g., 7.5)
  Quality NVARCHAR(20) CHECK (Quality IN ('excellent','good','fair','poor')),
  Notes NVARCHAR(500),
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```
**Giải thích:**
- Mỗi ngày user log giấc ngủ
- `Duration`: Số giờ ngủ (kiểu DECIMAL để hỗ trợ 7.5h, 6.25h...)
- `Quality`: Chất lượng giấc ngủ (4 mức)
- Dashboard dùng để hiển thị "Sleep Duration" và "Sleep Quality"

---

#### 7️⃣ **ActivityLogs** - Nhật ký hoạt động ✅
```sql
CREATE TABLE ActivityLogs (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
  Date DATE NOT NULL,
  MealsJson NVARCHAR(MAX),      -- JSON: [{ mealId, servings, time }]
  ExercisesJson NVARCHAR(MAX),  -- JSON: [{ exerciseId, duration, caloriesBurned }]
  WaterJson NVARCHAR(MAX),      -- JSON: [{ time, cups }]
  SleepJson NVARCHAR(MAX),      -- DEPRECATED - Dùng SleepLogs thay thế
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```
**Giải thích:**
- Mỗi user có 1 row per date
- Lưu tất cả activities của ngày đó dạng JSON
- **Quan trọng:** `SleepJson` đã deprecated, giờ dùng `SleepLogs` table riêng

---

#### 8️⃣ **DailyPlans** - Kế hoạch hàng ngày ✅
```sql
CREATE TABLE DailyPlans (
  PlanID INT IDENTITY(1,1) PRIMARY KEY,
  UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
  PlannedDate DATE NOT NULL,
  PlannedTime VARCHAR(8),           -- ✅ FIXED: Dùng VARCHAR(8) thay vì TIME
  ActivityType NVARCHAR(20) CHECK (ActivityType IN ('meal','exercise','sleep')),
  Title NVARCHAR(200),
  Description NVARCHAR(500),
  Notes NVARCHAR(500),
  IsCompleted BIT DEFAULT 0,
  MealID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Meals(Id),     -- ✅ FIXED: GUID
  ExerciseID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Exercises(Id), -- ✅ FIXED: GUID
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```
**Giải thích - QUAN TRỌNG:**
- User tạo plans trước (ví dụ: "Ăn sáng lúc 7:00")
- Khi log activity thực tế → tự động mark plan là completed ✅
- **PlannedTime**: Dùng VARCHAR(8) format "HH:MM:SS" thay vì TIME type
  - Lý do: TIME type trong SQL Server trả về Date object "1970-01-01T..."
  - Giải pháp: `CONVERT(VARCHAR(8), PlannedTime, 108)` trong queries
- **MealID/ExerciseID**: UNIQUEIDENTIFIER (GUID) để match với Meals/Exercises tables
  - **Đã fix schema mismatch:** Trước đây là INT, gây lỗi 500

**Auto-complete logic:**
```javascript
// Trong activityController.js - logMeal()
if (mealId) {
  await executeQuery(`
    UPDATE DailyPlans 
    SET IsCompleted = 1, UpdatedAt = GETDATE()
    WHERE UserID = @userId 
      AND PlannedDate = @today 
      AND ActivityType = 'meal'
      AND MealID = @mealId
      AND IsCompleted = 0
  `, { userId, today, mealId });
}
```

---

#### 9️⃣ **Feedback** - Phản hồi
```sql
CREATE TABLE Feedback (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(Id),
  Subject NVARCHAR(200),
  Message NVARCHAR(MAX),
  Status VARCHAR(20) DEFAULT 'pending',
  AdminResponse NVARCHAR(MAX),
  CreatedAt DATETIME2 DEFAULT GETDATE()
);
```

---

### 🔧 Stored Procedures (Tùy chọn)

```sql
-- Copy meal từ admin về user
CREATE PROCEDURE SP_CopyMealToUser
  @UserId UNIQUEIDENTIFIER,
  @MealId UNIQUEIDENTIFIER
AS BEGIN
  INSERT INTO UserMeals (UserId, BaseMealId, Name, Calories, ...)
  SELECT @UserId, Id, Name, Calories, ...
  FROM Meals
  WHERE Id = @MealId;
END;
```

---

## 4. BACKEND API - CONTROLLERS

### 📁 config/database.js - Kết nối SQL Server

```javascript
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'CNPM',
  user: process.env.DB_USER || 'nodejs_app',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// ✅ executeQuery hỗ trợ 2 formats:
// 1. Object: { userId: '123', name: 'John' }
// 2. Array: [{ name: 'userId', type: 'UniqueIdentifier', value: '123' }]
async function executeQuery(query, params = {}) {
  const pool = await getConnection();
  const request = pool.request();
  
  // Format 1: Object (tự động detect type)
  if (!Array.isArray(params)) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }
  // Format 2: Array với type specification
  else {
    for (const param of params) {
      const sqlType = sql[param.type]; // sql.UniqueIdentifier, sql.Int, etc
      if (!sqlType) {
        throw new Error(`Invalid SQL type: ${param.type}`);
      }
      request.input(param.name, sqlType, param.value);
    }
  }
  
  return await request.query(query);
}

module.exports = { executeQuery, sql };
```

**Cách dùng:**
```javascript
// Cách 1: Object (đơn giản)
await executeQuery('SELECT * FROM Users WHERE Id = @userId', {
  userId: '108D2581-E14A-4A17-8C26-9509C94B26D1'
});

// Cách 2: Array (chỉ rõ type - dùng cho GUID, Date, Time)
await executeQuery('INSERT INTO DailyPlans (...) VALUES (@userId, @date, @time, @mealId)', [
  { name: 'userId', type: 'UniqueIdentifier', value: userId },
  { name: 'date', type: 'Date', value: date },
  { name: 'time', type: 'VarChar', value: '14:00:00' },  // ✅ TIME phải dùng VarChar
  { name: 'mealId', type: 'UniqueIdentifier', value: mealId }
]);
```

---

### 📁 controllers/activityController.js ✅ (QUAN TRỌNG)

#### **getTodayActivity** - Lấy dữ liệu Dashboard
```javascript
const getTodayActivity = async (req, res) => {
  const userId = req.user.userId;  // ✅ Từ JWT middleware
  const today = new Date().toISOString().split('T')[0];  // "2025-10-21"
  
  // 1. Lấy ActivityLogs
  const activityQuery = `
    SELECT Id, Date, MealsJson, ExercisesJson, WaterJson
    FROM ActivityLogs
    WHERE UserId = @userId AND Date = @today
  `;
  const activityResult = await executeQuery(activityQuery, { userId, today });
  
  // 2. ✅ Lấy Sleep từ SleepLogs table (MỚI - đã fix)
  const sleepQuery = `
    SELECT TOP 1 Duration, Quality, Notes
    FROM SleepLogs
    WHERE UserID = @userId AND SleepDate = @today
    ORDER BY CreatedAt DESC
  `;
  const sleepResult = await executeQuery(sleepQuery, { userId, today });
  
  let sleepData = null;
  if (sleepResult.recordset.length > 0) {
    const sleep = sleepResult.recordset[0];
    sleepData = {
      duration: sleep.Duration,
      quality: sleep.Quality,
      notes: sleep.Notes
    };
  }
  
  // 3. Combine & return
  if (activityResult.recordset.length === 0) {
    return res.json({
      date: today,
      meals: [],
      exercises: [],
      sleep: sleepData,  // ✅ Vẫn trả về sleep nếu có
      water: []
    });
  }
  
  const activity = activityResult.recordset[0];
  res.json({
    id: activity.Id,
    date: activity.Date,
    meals: JSON.parse(activity.MealsJson || '[]'),
    exercises: JSON.parse(activity.ExercisesJson || '[]'),
    sleep: sleepData,  // ✅ Từ SleepLogs, không dùng SleepJson
    water: JSON.parse(activity.WaterJson || '[]')
  });
};
```

**Giải thích:**
- Dashboard gọi API này để lấy tất cả data
- Sleep data được lấy riêng từ `SleepLogs` table
- Trước đây có bug: Chỉ lấy từ `ActivityLogs.SleepJson` → không sync
- ✅ Đã fix: Query thêm từ `SleepLogs` → hiển thị đúng

---

#### **logSleep** - Ghi chép giấc ngủ
```javascript
const logSleep = async (req, res) => {
  const userId = req.user.userId;
  const { sleepDate, duration, quality, notes } = req.body;
  
  if (!sleepDate || !duration) {
    return res.status(400).json({ error: 'Sleep date and duration are required' });
  }
  
  const query = `
    INSERT INTO SleepLogs (UserID, SleepDate, Duration, Quality, Notes)
    OUTPUT INSERTED.SleepID as sleepId, INSERTED.Duration as duration, 
           INSERTED.Quality as quality
    VALUES (@userId, @sleepDate, @duration, @quality, @notes)
  `;
  
  const result = await executeQuery(query, {
    userId,
    sleepDate,
    duration,
    quality: quality || null,
    notes: notes || null
  });
  
  res.status(201).json({
    message: 'Sleep logged successfully',
    ...result.recordset[0]
  });
};
```

---

#### **logMeal** - Ghi meal + Auto-complete plan ✅
```javascript
const logMeal = async (req, res) => {
  const userId = req.user.userId;
  const { date, mealId, servings, notes } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Get/Create ActivityLogs
  let activityLog = await executeQuery(
    'SELECT * FROM ActivityLogs WHERE UserId = @userId AND Date = @today',
    { userId, today }
  );
  
  // 2. Update MealsJson
  let meals = activityLog.length > 0 
    ? JSON.parse(activityLog[0].MealsJson || '[]') 
    : [];
  
  meals.push({
    mealId,
    servings,
    time: new Date().toTimeString().split(' ')[0],
    notes
  });
  
  if (activityLog.length > 0) {
    await executeQuery(
      'UPDATE ActivityLogs SET MealsJson = @mealsJson WHERE Id = @id',
      { mealsJson: JSON.stringify(meals), id: activityLog[0].Id }
    );
  } else {
    await executeQuery(
      'INSERT INTO ActivityLogs (UserId, Date, MealsJson) VALUES (@userId, @today, @mealsJson)',
      { userId, today, mealsJson: JSON.stringify(meals) }
    );
  }
  
  // 3. ✅ AUTO-COMPLETE PLAN (MỚI - đã fix)
  if (mealId) {
    try {
      const updatePlanQuery = `
        UPDATE DailyPlans
        SET IsCompleted = 1, UpdatedAt = GETDATE()
        WHERE UserID = @userId 
          AND PlannedDate = @today 
          AND ActivityType = 'meal'
          AND MealID = @mealId
          AND IsCompleted = 0
      `;
      await executeQuery(updatePlanQuery, { userId, today, mealId });
    } catch (err) {
      console.warn('Failed to auto-complete plan:', err.message);
    }
  }
  
  res.json({ message: 'Meal logged successfully' });
};
```

**Giải thích:**
- Khi user log một meal → Tự động tìm plan có MealID tương ứng
- Nếu tìm thấy → Mark `IsCompleted = 1`
- Frontend sẽ thấy plan chuyển sang màu xanh ✅

---

### 📁 controllers/planningController.js ✅ (FIXED)

#### **createPlan** - Tạo kế hoạch
```javascript
const createPlan = async (req, res) => {
  const userId = req.user.userId;
  const { date, time, activityType, title, description, notes, mealId, exerciseId } = req.body;
  
  console.log('📝 Creating plan:', { userId, date, time, activityType, title, mealId, exerciseId });
  
  const query = `
    INSERT INTO DailyPlans (UserID, PlannedDate, PlannedTime, ActivityType, Title, Description, Notes, MealID, ExerciseID)
    OUTPUT 
      INSERTED.PlanID as id,
      INSERTED.PlannedDate as date,
      CONVERT(VARCHAR(8), INSERTED.PlannedTime, 108) as time,  -- ✅ CONVERT TIME to HH:MM:SS
      INSERTED.ActivityType as activityType,
      INSERTED.Title as title,
      INSERTED.Description as description,
      INSERTED.Notes as notes,
      INSERTED.IsCompleted as completed,
      INSERTED.MealID as mealId,
      INSERTED.ExerciseID as exerciseId
    VALUES (@userId, @date, @time, @activityType, @title, @description, @notes, @mealId, @exerciseId)
  `;
  
  // ✅ IMPORTANT: Dùng Array format với type specification
  const result = await executeQuery(query, [
    { name: 'userId', type: 'UniqueIdentifier', value: userId },
    { name: 'date', type: 'Date', value: date },
    { name: 'time', type: 'VarChar', value: time },  // ✅ VarChar thay vì Time
    { name: 'activityType', type: 'NVarChar', value: activityType },
    { name: 'title', type: 'NVarChar', value: title },
    { name: 'description', type: 'NVarChar', value: description || null },
    { name: 'notes', type: 'NVarChar', value: notes || null },
    { name: 'mealId', type: 'UniqueIdentifier', value: mealId || null },  // ✅ GUID
    { name: 'exerciseId', type: 'UniqueIdentifier', value: exerciseId || null }  // ✅ GUID
  ]);
  
  res.status(201).json({
    message: 'Plan created successfully',
    plan: result.recordset[0]
  });
};
```

**Giải thích - QUAN TRỌNG:**

**❌ Các lỗi trước đây:**
1. `time` dùng type 'Time' → Validation failed
2. `PlannedTime` trả về Date object "1970-01-01T14:00:00.000Z"
3. `MealID/ExerciseID` dùng type 'Int' → Mismatch với Meals/Exercises.Id (GUID)

**✅ Giải pháp:**
1. `time` dùng type 'VarChar' với format "HH:MM:SS"
2. Dùng `CONVERT(VARCHAR(8), PlannedTime, 108)` trong OUTPUT
3. `MealID/ExerciseID` dùng type 'UniqueIdentifier'
4. Database schema đã fix: MealID/ExerciseID từ INT → UNIQUEIDENTIFIER

---

### 📁 middleware/auth.middleware.js

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // ✅ { userId, name, email, role }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
```

**Giải thích:**
- Tất cả protected routes đều dùng middleware này
- JWT payload chứa: `{ userId, name, email, role }`
- ✅ Lưu ý: Dùng `req.user.userId` KHÔNG phải `req.user.id`

---

## 5. FRONTEND COMPONENTS

### 📁 components/AuthContext.tsx - Quản lý Auth State

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  
  useEffect(() => {
    if (token) {
      // Decode JWT để lấy user info
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, [token]);
  
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 📁 components/user/DashboardHome.tsx - Dashboard

```typescript
const DashboardHome = () => {
  const [todayActivity, setTodayActivity] = useState({
    meals: [],
    exercises: [],
    sleep: null,  // ✅ { duration, quality, notes }
    water: []
  });
  
  useEffect(() => {
    fetchTodayActivity();
  }, []);
  
  const fetchTodayActivity = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/activity/today', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTodayActivity(response.data);
  };
  
  return (
    <div className="dashboard">
      {/* Sleep Duration */}
      <Card>
        <CardTitle>Sleep Duration</CardTitle>
        <div className="text-3xl font-bold">
          {todayActivity.sleep?.duration || 0} hrs
        </div>
        <p className="text-sm text-gray-500">Goal: 8 hours</p>
      </Card>
      
      {/* Sleep Quality */}
      <Card>
        <CardTitle>Sleep Quality</CardTitle>
        <div className="text-xl">
          {todayActivity.sleep ? todayActivity.sleep.quality : 'No data'}
        </div>
      </Card>
      
      {/* Today's Summary */}
      <Card>
        <CardTitle>Today's Summary</CardTitle>
        <div>Meals Logged: {todayActivity.meals.length}</div>
        <div>Water Cups: {todayActivity.water.length}</div>
        <div>Workouts: {todayActivity.exercises.length}</div>
        <div>Sleep Quality: {todayActivity.sleep?.quality || '--'}</div>
      </Card>
    </div>
  );
};
```

---

### 📁 components/user/DailyPlanner.tsx ✅

```typescript
const DailyPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',  // HH:MM format
    activityType: 'meal',
    title: '',
    mealId: null,
    exerciseId: null
  });
  
  const createPlan = async () => {
    const token = localStorage.getItem('token');
    
    // ✅ Thêm ":00" seconds vào time
    const planData = {
      ...formData,
      time: formData.time + ':00',  // "12:00" → "12:00:00"
      mealId: formData.mealId ? parseInt(formData.mealId) : null,  // ❌ Cũ: parseInt
      exerciseId: formData.exerciseId ? parseInt(formData.exerciseId) : null  // ❌ Cũ: parseInt
    };
    
    // ✅ MỚI: Không cần parseInt vì giờ là GUID
    const planData = {
      ...formData,
      time: formData.time + ':00'
      // mealId và exerciseId giữ nguyên (đã là GUID string)
    };
    
    await axios.post('http://localhost:5000/api/planning', planData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    fetchPlans();
  };
  
  return (
    <div>
      <Dialog>
        <DialogContent>
          <Label>Time</Label>
          <Input 
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
          
          {formData.activityType === 'meal' && (
            <Select 
              onValueChange={(value) => setFormData({ ...formData, mealId: value })}
            >
              {meals.map(meal => (
                <SelectItem value={meal.id}>{meal.name}</SelectItem>
              ))}
            </Select>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Plans List */}
      {plans.map(plan => (
        <Card key={plan.id} className={plan.completed ? 'bg-green-50' : ''}>
          <div>{plan.title}</div>
          <div>{plan.time}</div>  {/* ✅ Hiển thị "14:00:00" */}
          {plan.completed && <Badge>Completed ✅</Badge>}
        </Card>
      ))}
    </div>
  );
};
```

---

## 6. LUỒNG DỮ LIỆU & AUTHENTICATION

### 🔐 Authentication Flow

```
1. User nhập email/password → LoginPage
   ↓
2. POST /api/auth/login { email, password }
   ↓
3. Backend: 
   - Tìm user trong database
   - Verify password (bcrypt.compare)
   - Tạo JWT token
   - Return { token, user: { id, name, email, role }}
   ↓
4. Frontend:
   - Lưu token vào localStorage
   - Set AuthContext
   - Redirect to /dashboard
   ↓
5. Mọi request sau đó:
   - Thêm header: Authorization: Bearer TOKEN
   - Backend verify JWT → req.user = decoded
```

---

### 📊 Dashboard Data Flow

```
1. DashboardHome component mount
   ↓
2. useEffect → fetchTodayActivity()
   ↓
3. GET /api/activity/today
   Headers: Authorization: Bearer TOKEN
   ↓
4. Backend:
   - verifyToken middleware → req.user.userId
   - Query ActivityLogs WHERE UserId = @userId AND Date = today
   - Query SleepLogs WHERE UserID = @userId AND SleepDate = today ✅
   - Combine results
   - Return JSON
   ↓
5. Frontend:
   - Parse response
   - setState(todayActivity)
   - Render UI
```

---

### 🎯 Plan Auto-Complete Flow ✅

```
1. User tạo plan: "Ăn sáng lúc 7:00 - Meal: Oatmeal"
   DailyPlans: { PlanID: 1, MealID: 'ABC-123', IsCompleted: 0 }
   ↓
2. User log meal: "Log Oatmeal - 1 serving"
   POST /api/activity/log-meal { mealId: 'ABC-123' }
   ↓
3. Backend logMeal():
   - Insert vào ActivityLogs.MealsJson
   - Tìm plan: WHERE MealID = 'ABC-123' AND IsCompleted = 0
   - UPDATE DailyPlans SET IsCompleted = 1 ✅
   ↓
4. Frontend refresh plans → Thấy plan màu xanh ✅
```

---

## 7. CÁCH SỬA LỖI THƯỜNG GẶP

### ❌ Lỗi 500: "Validation failed for parameter 'time'"

**Nguyên nhân:**
- SQL Server TIME type validation strict
- Frontend gửi "HH:MM" nhưng cần "HH:MM:SS"

**Cách sửa:**
```typescript
// Frontend: DailyPlanner.tsx
const planData = {
  ...formData,
  time: formData.time + ':00'  // ✅ Thêm seconds
};
```

```javascript
// Backend: planningController.js
const result = await executeQuery(query, [
  { name: 'time', type: 'VarChar', value: time }  // ✅ Dùng VarChar thay vì Time
]);
```

---

### ❌ TIME hiển thị "1970-01-01T14:00:00.000Z"

**Nguyên nhân:**
- SQL Server TIME type trả về Date object

**Cách sửa:**
```javascript
// Backend: planningController.js
const query = `
  SELECT 
    CONVERT(VARCHAR(8), PlannedTime, 108) as time  -- ✅ Format HH:MM:SS
  FROM DailyPlans
`;
```

---

### ❌ Sleep data không hiển thị trong Dashboard

**Nguyên nhân:**
- Dashboard chỉ lấy từ `ActivityLogs.SleepJson` (deprecated)
- Sleep data nằm trong `SleepLogs` table riêng

**Cách sửa:**
```javascript
// Backend: activityController.js - getTodayActivity()
// ✅ Thêm query SleepLogs
const sleepQuery = `
  SELECT TOP 1 Duration, Quality, Notes
  FROM SleepLogs
  WHERE UserID = @userId AND SleepDate = @today
  ORDER BY CreatedAt DESC
`;
const sleepResult = await executeQuery(sleepQuery, { userId, today });

// Combine với ActivityLogs
res.json({
  meals: ...,
  exercises: ...,
  sleep: sleepResult.recordset[0] || null,  // ✅
  water: ...
});
```

---

### ❌ Auto-complete plan không hoạt động

**Nguyên nhân:**
- Schema mismatch: `DailyPlans.MealID` là INT nhưng `Meals.Id` là GUID
- Query không match được

**Cách sửa:**
```sql
-- 1. Fix database schema
ALTER TABLE DailyPlans DROP COLUMN MealID;
ALTER TABLE DailyPlans ADD MealID UNIQUEIDENTIFIER NULL;
ALTER TABLE DailyPlans ADD FOREIGN KEY (MealID) REFERENCES Meals(Id);

ALTER TABLE DailyPlans DROP COLUMN ExerciseID;
ALTER TABLE DailyPlans ADD ExerciseID UNIQUEIDENTIFIER NULL;
ALTER TABLE DailyPlans ADD FOREIGN KEY (ExerciseID) REFERENCES Exercises(Id);
```

```javascript
// 2. Update controller
await executeQuery(updatePlanQuery, { 
  userId, 
  today, 
  mealId  // ✅ Giữ nguyên GUID string, không parseInt()
});
```

---

### ❌ JWT "Invalid token" hoặc "req.user.id is undefined"

**Nguyên nhân:**
- Middleware dùng `req.user.id` nhưng JWT payload có `userId`

**Cách sửa:**
```javascript
// Backend: authController.js - login()
const token = jwt.sign(
  { 
    userId: user.Id,  // ✅ Dùng userId
    name: user.Name,
    email: user.Email,
    role: user.Role
  },
  process.env.JWT_SECRET
);
```

```javascript
// Backend: planningController.js
const userId = req.user.userId;  // ✅ Không phải req.user.id
```

---

## 8. TEST & DEBUGGING

### 🧪 Test Scripts

**1. Test Sleep Dashboard Integration:**
```bash
cd D:\TLU\CNPM\HealthCare\src\backend
node test-sleep-dashboard.js
```
Tests:
- ✅ Login admin
- ✅ GET /activity/today (sleep data có không?)
- ✅ GET /activity/sleep/today
- ✅ GET /activity/sleep/weekly
- ✅ POST /activity/log-sleep

**2. Test Auto-Complete:**
```bash
node test-auto-complete.js
```
Tests:
- ✅ Tạo plan với mealId
- ✅ Log meal
- ✅ Check plan IsCompleted = 1

**3. Test Planning API:**
```bash
node test-planning-quick.js
```
Tests:
- ✅ Login
- ✅ Create plan
- ✅ TIME format đúng

---

### 🔍 Debugging Tips

**1. Check Backend Logs:**
```javascript
// Thêm console.log trong controller
console.log('📝 Creating plan:', { userId, date, time, mealId });
console.log('✅ Plan created:', result.recordset[0]);
```

**2. Test API trực tiếp (PowerShell):**
```powershell
# Login
$token = (Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body (@{email='admin@test.com';password='123456'} | ConvertTo-Json) -ContentType 'application/json').token

# Test endpoint
Invoke-RestMethod -Uri 'http://localhost:5000/api/activity/today' -Headers @{Authorization="Bearer $token"} | ConvertTo-Json
```

**3. Check Database:**
```sql
-- Check user ID
SELECT Id, Name, Email FROM Users WHERE Email = 'admin@test.com';

-- Check today's sleep
SELECT * FROM SleepLogs 
WHERE UserID = '108D2581-E14A-4A17-8C26-9509C94B26D1' 
AND SleepDate = '2025-10-21';

-- Check plans
SELECT PlanID, Title, PlannedTime, IsCompleted, MealID 
FROM DailyPlans 
WHERE UserID = '...' AND PlannedDate = '2025-10-21';
```

**4. Browser DevTools:**
- F12 → Network tab
- Check API requests/responses
- Console errors
- Application → Local Storage (xem token)

---

### 🚀 Start Server

**PowerShell Script:**
```powershell
# D:\TLU\CNPM\HealthCare\start-dev.ps1
# Check SQL Server running
# Start backend (port 5000)
# Start frontend (port 3000)
.\start-dev.ps1
```

**Manual:**
```bash
# Terminal 1 - Backend
cd D:\TLU\CNPM\HealthCare\src\backend
node server.js

# Terminal 2 - Frontend
cd D:\TLU\CNPM\HealthCare
npm run dev
```

---

## 📝 CHECKLIST KHI VẤN ĐÁP

Khi gặp vấn đề, kiểm tra theo thứ tự:

1. ✅ **Server có chạy không?**
   ```powershell
   Invoke-RestMethod http://localhost:5000/api/health
   ```

2. ✅ **Token có hợp lệ không?**
   - Check localStorage trong browser
   - Decode JWT tại jwt.io
   - Token expire sau 7 days

3. ✅ **SQL Server có chạy không?**
   - Services → SQL Server (MSSQLSERVER)
   - sqlcmd -S localhost -U sa -P password

4. ✅ **Database schema đúng chưa?**
   - MealID/ExerciseID phải là UNIQUEIDENTIFIER
   - SleepLogs table có tồn tại không?

5. ✅ **Code đã restart chưa?**
   - Stop Node processes
   - Restart với `.\start-dev.ps1`

6. ✅ **Logs có gì?**
   - Backend console
   - Browser console (F12)
   - SQL Server error log

---

## 🎓 KẾT LUẬN

**File quan trọng nhất:**
1. `src/backend/server.js` - Entry point
2. `src/backend/config/database.js` - Database connection
3. `src/backend/controllers/activityController.js` - Dashboard data
4. `src/backend/controllers/planningController.js` - Daily plans
5. `src/components/AuthContext.tsx` - Authentication
6. `src/components/user/DashboardHome.tsx` - Dashboard UI
7. `src/SQL_QUICK_START.sql` - Database schema

**Những fix quan trọng đã làm:**
- ✅ TIME format: VARCHAR(8) + CONVERT 108
- ✅ Sleep data: Query từ SleepLogs table
- ✅ Auto-complete: UPDATE DailyPlans khi log activity
- ✅ Schema fix: MealID/ExerciseID từ INT → GUID
- ✅ Middleware: req.user.userId không phải .id

**Test accounts:**
- Admin: admin@test.com / 123456
- User: test@example.com / Test123456

---

Made with ❤️ for CNPM Team - Good luck with vấn đáp! 🚀
