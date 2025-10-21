# 📊 BẢNG QUAN HỆ CƠ SỞ DỮ LIỆU - HEALTHYCOLORS SYSTEM

## 🎯 TỔNG QUAN

Hệ thống có **9 bảng chính** với các mối quan hệ Foreign Key được thiết kế theo mô hình **Normalized Database**.

## 📋 DANH SÁCH CÁC BẢNG

### 1. **Users** (Bảng gốc - Users)
```
👤 Users
├── Id (UNIQUEIDENTIFIER) - PRIMARY KEY
├── Name (NVARCHAR)
├── Email (NVARCHAR) - UNIQUE
├── PasswordHash (NVARCHAR)
├── Role (VARCHAR) - 'user'/'admin'
├── Status (VARCHAR) - 'active'/'locked'
└── CreatedAt (DATETIME2)
```

## 🔗 MỐI QUAN HỆ GIỮA CÁC BẢNG

```
                    👤 Users (Bảng gốc)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    🍽️ Meals        🏃 Exercises    💤 SleepLogs
    (Admin tạo)      (Admin tạo)     (User log)
        │               │               │
        ▼               ▼               │
   📝 UserMeals    📝 UserExercises    │
   (User copy)      (User copy)        │
        │               │               │
        └───────────────┼───────────────┘
                        ▼
              📅 DailyPlans (Kế hoạch)
                        │
                        ▼
              📊 ActivityLogs (Nhật ký)
                        │
                        ▼
              💬 Feedback (Đánh giá)
```

---

## 📝 CHI TIẾT QUAN HỆ

### 🔑 **Users** → Tất cả bảng khác
**Users** là bảng gốc, có quan hệ **1-to-Many** với tất cả bảng khác:

```sql
-- Quan hệ chính
Users (1) ──→ (Many) UserMeals
Users (1) ──→ (Many) UserExercises  
Users (1) ──→ (Many) SleepLogs
Users (1) ──→ (Many) ActivityLogs
Users (1) ──→ (Many) DailyPlans
Users (1) ──→ (Many) Feedback

-- Quan hệ phụ (Admin tạo content)
Users (1) ──→ (Many) Meals (thông qua CreatorId)
Users (1) ──→ (Many) Exercises (thông qua CreatorId)
```

---

### 🍽️ **Meals** (Admin Template) → **UserMeals** (User Copy)

```sql
Meals (1) ──→ (Many) UserMeals
```

**Foreign Key:**
```sql
UserMeals.BaseMealId → Meals.Id (ON DELETE SET NULL)
UserMeals.UserId → Users.Id (ON DELETE CASCADE)
```

**Ý nghĩa:**
- Admin tạo **Meals** làm template
- User copy thành **UserMeals** để customize
- Nếu xóa Admin meal → UserMeal vẫn tồn tại (SET NULL)
- Nếu xóa User → tất cả UserMeals của user đó bị xóa (CASCADE)

---

### 🏃 **Exercises** (Admin Template) → **UserExercises** (User Copy)

```sql
Exercises (1) ──→ (Many) UserExercises
```

**Foreign Key:**
```sql
UserExercises.BaseExerciseId → Exercises.Id (ON DELETE SET NULL)
UserExercises.UserId → Users.Id (ON DELETE CASCADE)
```

**Tương tự như Meals/UserMeals**

---

### 📅 **DailyPlans** (Kế hoạch) ← Liên kết với Meals & Exercises

```sql
DailyPlans.MealID → Meals.Id
DailyPlans.ExerciseID → Exercises.Id
DailyPlans.UserID → Users.Id
```

**Ý nghĩa:**
- User tạo plan: "Ăn Phở Bò lúc 7:00 sáng"
- `MealID` trỏ đến bảng **Meals** (không phải UserMeals)
- Khi user log meal thực tế → auto-complete plan

---

### 📊 **ActivityLogs** (Nhật ký hoạt động)

```sql
ActivityLogs.UserId → Users.Id
```

**Đặc biệt:**
- **KHÔNG có Foreign Key** trực tiếp đến Meals/Exercises
- Lưu data dạng **JSON** trong các cột:
  - `MealsJson`: `[{mealId, servings, time}]`
  - `ExercisesJson`: `[{exerciseId, duration, calories}]`
  - `WaterJson`: `[{time, cups}]`

---

### 💤 **SleepLogs** (Nhật ký giấc ngủ)

```sql
SleepLogs.UserID → Users.Id
```

**Độc lập hoàn toàn** - chỉ liên kết với Users

---

### 💬 **Feedback** (Đánh giá hệ thống)

```sql
Feedback.UserId → Users.Id
```

**Độc lập** - user gửi feedback về hệ thống

---

## 🎯 **CÁC KIỂU QUAN HỆ**

### **1-to-Many Relationships:**
- `Users → UserMeals` (1 user có nhiều meals)
- `Users → UserExercises` (1 user có nhiều exercises)
- `Users → SleepLogs` (1 user có nhiều sleep logs)
- `Users → ActivityLogs` (1 user có nhiều activity logs)
- `Users → DailyPlans` (1 user có nhiều plans)
- `Meals → UserMeals` (1 template meal → nhiều user copies)
- `Exercises → UserExercises` (1 template exercise → nhiều user copies)

### **Many-to-Many (thông qua JSON):**
- `ActivityLogs ↔ Meals` (trong MealsJson)
- `ActivityLogs ↔ Exercises` (trong ExercisesJson)

---

## 🔧 **CASCADE RULES**

### **ON DELETE CASCADE** (Xóa user → xóa hết data):
```sql
UserMeals.UserId → Users.Id (ON DELETE CASCADE)
UserExercises.UserId → Users.Id (ON DELETE CASCADE)
SleepLogs.UserID → Users.Id (ON DELETE CASCADE)
ActivityLogs.UserId → Users.Id (ON DELETE CASCADE)
DailyPlans.UserID → Users.Id (ON DELETE CASCADE)
Feedback.UserId → Users.Id (ON DELETE CASCADE)
```

### **ON DELETE SET NULL** (Xóa template → user copy vẫn tồn tại):
```sql
UserMeals.BaseMealId → Meals.Id (ON DELETE SET NULL)
UserExercises.BaseExerciseId → Exercises.Id (ON DELETE SET NULL)
```

---

## 📊 **QUERIES THƯỜNG DÙNG**

### **Lấy tất cả data của 1 user:**
```sql
-- User meals
SELECT * FROM UserMeals WHERE UserId = @userId;

-- User exercises  
SELECT * FROM UserExercises WHERE UserId = @userId;

-- Sleep logs
SELECT * FROM SleepLogs WHERE UserID = @userId;

-- Daily plans
SELECT * FROM DailyPlans WHERE UserID = @userId;

-- Activity logs
SELECT * FROM ActivityLogs WHERE UserId = @userId;
```

### **Dashboard data (JOIN queries):**
```sql
-- Today's activity với meal/exercise details
SELECT 
  al.*,
  u.Name as UserName
FROM ActivityLogs al
JOIN Users u ON al.UserId = u.Id  
WHERE al.UserId = @userId 
  AND al.Date = @today;
```

### **Planning với meal/exercise info:**
```sql
-- Plans với meal info
SELECT 
  dp.*,
  m.Name as MealName,
  m.Calories as MealCalories
FROM DailyPlans dp
LEFT JOIN Meals m ON dp.MealID = m.Id
WHERE dp.UserID = @userId 
  AND dp.PlannedDate = @date;
```

---

## 🎨 **DIAGRAM ERD (Text Format)**

```
┌─────────────┐
│    Users    │ ←── Bảng gốc (Primary)
│  Id (PK)    │
│  Name       │
│  Email      │
│  Role       │
└─────┬───────┘
      │ (1:Many)
      ├─────────────────────────────────────────┐
      │                                         │
      ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│   Meals     │ (1:Many)                 │ Exercises   │
│  Id (PK)    │ ──────────┐              │  Id (PK)    │
│  Name       │           │              │  Title      │
│ CreatorId   │ ──────────┼──────────────│ CreatorId   │ ──┐
└─────────────┘           │              └─────────────┘   │
      │                   │                      │         │
      │ (1:Many)          │                      │ (1:Many)│
      ▼                   ▼                      ▼         │
┌─────────────┐     ┌─────────────┐        ┌─────────────┐ │
│ UserMeals   │     │ DailyPlans  │        │UserExercises│ │
│  Id (PK)    │     │ PlanID (PK) │        │  Id (PK)    │ │
│ UserId (FK) │ ──┐ │ UserID (FK) │ ──┐    │ UserId (FK) │ │
│BaseMealId   │   │ │ MealID (FK) │   │    │BaseExerID   │ │
└─────────────┘   │ │ExerciseID   │   │    └─────────────┘ │
                  │ └─────────────┘   │                    │
                  │                   │                    │
                  └─────────┐         │    ┌───────────────┘
                           ▼         │    ▼               
                     ┌─────────────┐ │ ┌─────────────┐    
                     │ActivityLogs │ │ │ SleepLogs   │    
                     │  Id (PK)    │ │ │ SleepID(PK) │    
                     │ UserId (FK) │ │ │ UserID (FK) │    
                     │ MealsJson   │ │ │ Duration    │    
                     │ExercisesJsn │ │ │ Quality     │    
                     └─────────────┘ │ └─────────────┘    
                                     │                    
                                     ▼                    
                              ┌─────────────┐             
                              │  Feedback   │             
                              │  Id (PK)    │             
                              │ UserId (FK) │             
                              │ Message     │             
                              └─────────────┘             
```

---

## 📍 **VỊ TRÍ CÁC FILE**

### **Schema Definition:**
- **SQL Script:** `/src/SQL_QUICK_START.sql`
- **Documentation:** `/HUONG_DAN_TOAN_DIEN.md` (Section 3)

### **Database Monitoring:**
- **Monitor Script:** `/src/backend/MONITOR_DATABASE.sql`

### **Backend Implementation:**
- **Database Config:** `/src/backend/config/database.js`
- **Controllers:** `/src/backend/controllers/*.js`

---

## 🔍 **CÁCH KIỂM TRA QUAN HỆ**

### **Trong SQL Server Management Studio:**
```sql
-- Xem tất cả Foreign Keys
SELECT 
  fk.name AS ForeignKey,
  tp.name AS ParentTable,
  cp.name AS ParentColumn,
  tr.name AS ReferencedTable,
  cr.name AS ReferencedColumn
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id 
  AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id 
  AND fkc.referenced_object_id = cr.object_id
ORDER BY tp.name;
```

### **Trong VSCode (Database Explorer):**
1. Kết nối đến SQL Server
2. Expand database `CNPM`  
3. Expand `Tables`
4. Click chuột phải → `View Dependencies`

---

**🎯 TÓM TẮT:** Hệ thống có 9 bảng với **Users** làm trung tâm, các bảng khác liên kết thông qua Foreign Keys theo nguyên tắc **Normalized Database** đảm bảo tính toàn vẹn dữ liệu.