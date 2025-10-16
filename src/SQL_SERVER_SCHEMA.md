# HealthyColors - SQL Server Database Schema

## Database: CNPM (localhost)

This document describes the complete SQL Server database schema for the HealthyColors health management system, designed to support user-admin data separation, content management, and activity tracking.

---

## 📋 **TABLE OF CONTENTS**

1. [Database Overview](#database-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Stored Procedures](#stored-procedures)
5. [API Endpoints Mapping](#api-endpoints-mapping)
6. [Data Flow Logic](#data-flow-logic)
7. [Sample Queries](#sample-queries)

---

## 🗄️ **DATABASE OVERVIEW**

**Database Name:** `CNPM`  
**SQL Server Version:** SQL Server 2019+  
**Collation:** SQL_Latin1_General_CP1_CI_AS  
**Purpose:** Full-stack health management with user-admin separation

### Key Features:
- ✅ User authentication & authorization (User/Admin roles)
- ✅ Content separation (Admin meals vs User copies)
- ✅ CRUD operations with data isolation
- ✅ Activity tracking & analytics
- ✅ Feedback management system

---

## 🔗 **ENTITY RELATIONSHIP DIAGRAM**

\`\`\`
Users (1) ----< (n) UserMeals
Users (1) ----< (n) UserExercises
Users (1) ----< (n) SleepRecords
Users (1) ----< (n) WaterLogs
Users (1) ----< (n) ActivityLogs
Users (1) ----< (n) Feedback

Meals (1) ----< (n) UserMeals (via BaseMealId)
Exercises (1) ----< (n) UserExercises (via BaseExerciseId)
\`\`\`

---

## 📊 **TABLE DEFINITIONS**

### 1. **Users** - User Account Management

Stores all user accounts (both regular users and admins).

\`\`\`sql
CREATE TABLE dbo.Users (
  Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  Name          NVARCHAR(100)    NOT NULL,
  Email         NVARCHAR(255)    NOT NULL UNIQUE,
  PasswordHash  NVARCHAR(255)    NOT NULL,
  Role          VARCHAR(10)      NOT NULL CHECK (Role IN ('user','admin')),
  Status        VARCHAR(20)      NOT NULL DEFAULT 'active' CHECK (Status IN ('active','locked')),
  CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Users_Email (Email),
  INDEX IX_Users_Role (Role)
);
\`\`\`

**Fields:**
- `Id`: Unique user identifier (GUID)
- `Name`: User's full name
- `Email`: Unique email for login
- `PasswordHash`: Hashed password (use bcrypt/argon2)
- `Role`: 'user' or 'admin'
- `Status`: 'active' or 'locked' (admin can lock accounts)
- `CreatedAt`: Account creation timestamp (UTC)

---

### 2. **Meals** - Admin Meal Database

Master meal database maintained by administrators.

\`\`\`sql
CREATE TABLE dbo.Meals (
  Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  Name         NVARCHAR(150)    NOT NULL,
  Calories     INT              NOT NULL CHECK (Calories >= 0),
  Type         VARCHAR(20)      NOT NULL CHECK (Type IN ('breakfast','lunch','dinner','snack')),
  Protein      INT              NOT NULL DEFAULT 0 CHECK (Protein >= 0),
  Carbs        INT              NOT NULL DEFAULT 0 CHECK (Carbs >= 0),
  Fat          INT              NOT NULL DEFAULT 0 CHECK (Fat >= 0),
  PrepTime     INT              NOT NULL DEFAULT 15 CHECK (PrepTime > 0),
  Image        NVARCHAR(500)    NULL,
  IngredientsJson NVARCHAR(MAX) NULL,     -- JSON array: ["ingredient1", "ingredient2"]
  StepsJson    NVARCHAR(MAX)    NULL,     -- JSON array: ["step1", "step2"]
  Source       VARCHAR(10)      NOT NULL DEFAULT 'admin' CHECK (Source IN ('admin')),
  CreatorId    UNIQUEIDENTIFIER NULL  REFERENCES dbo.Users(Id),
  Status       VARCHAR(10)      NOT NULL DEFAULT 'public' CHECK (Status IN ('public','hidden')),
  CreatedAt    DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Meals_Type (Type),
  INDEX IX_Meals_Status (Status)
);
\`\`\`

**Fields:**
- `IngredientsJson`: Stored as JSON string (e.g., `["Quinoa", "Chickpeas", "Avocado"]`)
- `StepsJson`: Cooking steps as JSON array
- `Status`: 'public' (visible to users) or 'hidden' (admin only)

---

### 3. **UserMeals** - User Meal Copies & Custom Meals

User's personal meal collection (copied from admin or custom-created).

\`\`\`sql
CREATE TABLE dbo.UserMeals (
  Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId        UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  BaseMealId    UNIQUEIDENTIFIER NULL  REFERENCES dbo.Meals(Id) ON DELETE SET NULL,
  Name          NVARCHAR(150)    NOT NULL,
  Calories      INT              NOT NULL CHECK (Calories >= 0),
  Type          VARCHAR(20)      NOT NULL CHECK (Type IN ('breakfast','lunch','dinner','snack')),
  Protein       INT              NOT NULL DEFAULT 0,
  Carbs         INT              NOT NULL DEFAULT 0,
  Fat           INT              NOT NULL DEFAULT 0,
  PrepTime      INT              NOT NULL DEFAULT 15,
  Image         NVARCHAR(500)    NULL,
  IngredientsJson NVARCHAR(MAX)  NULL,
  StepsJson     NVARCHAR(MAX)    NULL,
  Source        VARCHAR(10)      NOT NULL CHECK (Source IN ('copy','custom')),
  CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_UserMeals_User (UserId),
  INDEX IX_UserMeals_Base (BaseMealId)
);
\`\`\`

**Key Logic:**
- `BaseMealId`: Links to original admin meal (NULL if custom)
- `Source`: 'copy' (from admin) or 'custom' (user-created)
- User can edit/delete their copies WITHOUT affecting admin meals

---

### 4. **Exercises** - Admin Exercise Database

Master exercise database maintained by administrators.

\`\`\`sql
CREATE TABLE dbo.Exercises (
  Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  Title         NVARCHAR(150)    NOT NULL,
  MuscleGroup   NVARCHAR(80)     NOT NULL,
  Duration      INT              NOT NULL CHECK (Duration > 0),
  Difficulty    VARCHAR(20)      NOT NULL CHECK (Difficulty IN ('Beginner','Intermediate','Advanced')),
  CaloriesBurned INT             NOT NULL DEFAULT 100,
  Image         NVARCHAR(500)    NULL,
  Description   NVARCHAR(500)    NULL,
  StepsJson     NVARCHAR(MAX)    NULL,  -- JSON array of instructions
  Source        VARCHAR(10)      NOT NULL DEFAULT 'admin' CHECK (Source IN ('admin')),
  CreatorId     UNIQUEIDENTIFIER NULL  REFERENCES dbo.Users(Id),
  Status        VARCHAR(10)      NOT NULL DEFAULT 'public' CHECK (Status IN ('public','hidden')),
  CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Exercises_Difficulty (Difficulty),
  INDEX IX_Exercises_Status (Status)
);
\`\`\`

---

### 5. **UserExercises** - User Exercise Copies & Custom Exercises

User's personal exercise collection.

\`\`\`sql
CREATE TABLE dbo.UserExercises (
  Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId          UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  BaseExerciseId  UNIQUEIDENTIFIER NULL  REFERENCES dbo.Exercises(Id) ON DELETE SET NULL,
  Title           NVARCHAR(150)    NOT NULL,
  MuscleGroup     NVARCHAR(80)     NOT NULL,
  Duration        INT              NOT NULL CHECK (Duration > 0),
  Difficulty      VARCHAR(20)      NOT NULL CHECK (Difficulty IN ('Beginner','Intermediate','Advanced')),
  CaloriesBurned  INT              NOT NULL DEFAULT 100,
  Image           NVARCHAR(500)    NULL,
  Description     NVARCHAR(500)    NULL,
  StepsJson       NVARCHAR(MAX)    NULL,
  Source          VARCHAR(10)      NOT NULL CHECK (Source IN ('copy','custom')),
  CreatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_UserExercises_User (UserId),
  INDEX IX_UserExercises_Base (BaseExerciseId)
);
\`\`\`

---

### 6. **SleepRecords** - Sleep Tracking

Records user sleep data.

\`\`\`sql
CREATE TABLE dbo.SleepRecords (
  Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId      UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  BedTime     DATETIME2        NOT NULL,
  WakeTime    DATETIME2        NOT NULL,
  DurationMin AS (DATEDIFF(MINUTE, BedTime, WakeTime)) PERSISTED,
  CreatedAt   DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Sleep_UserDate (UserId, BedTime)
);
\`\`\`

**Computed Column:**
- `DurationMin`: Automatically calculated sleep duration

---

### 7. **WaterLogs** - Water Intake Tracking

\`\`\`sql
CREATE TABLE dbo.WaterLogs (
  Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId     UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  IntakeTime DATETIME2        NOT NULL,
  AmountMl   INT              NOT NULL CHECK (AmountMl > 0),
  
  INDEX IX_Water_UserTime (UserId, IntakeTime)
);
\`\`\`

---

### 8. **ActivityLogs** - Daily Activity Aggregation

Daily snapshot of user activities (meals, exercises, sleep, water).

\`\`\`sql
CREATE TABLE dbo.ActivityLogs (
  Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId       UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  [Date]       DATE             NOT NULL,
  MealsJson    NVARCHAR(MAX)    NULL,     -- JSON: [{"name": "...", "calories": 450}]
  ExercisesJson NVARCHAR(MAX)   NULL,     -- JSON: [{"title": "...", "duration": 30}]
  SleepJson    NVARCHAR(MAX)    NULL,     -- JSON: {"bedTime": "...", "duration": 480}
  WaterJson    NVARCHAR(MAX)    NULL,     -- JSON: {"totalMl": 2000, "logs": [...]}
  
  CONSTRAINT UQ_Activity_UserDate UNIQUE(UserId, [Date]),
  INDEX IX_Activity_Date ([Date])
);
\`\`\`

**Purpose:** Pre-aggregated daily summary for fast dashboard loading.

---

### 9. **Feedback** - User Feedback System

\`\`\`sql
CREATE TABLE dbo.Feedback (
  Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId     UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  Message    NVARCHAR(2000)   NOT NULL,
  Status     VARCHAR(12)      NOT NULL DEFAULT 'new' CHECK (Status IN ('new','in_progress','done')),
  CreatedAt  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Feedback_Status (Status),
  INDEX IX_Feedback_User (UserId)
);
\`\`\`

---

## 🔄 **STORED PROCEDURES**

### SP_CopyMealToUser
Copies an admin meal to user's personal collection.

\`\`\`sql
CREATE PROCEDURE dbo.SP_CopyMealToUser
  @UserId UNIQUEIDENTIFIER,
  @MealId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  
  INSERT INTO dbo.UserMeals (UserId, BaseMealId, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, Image, IngredientsJson, StepsJson, Source)
  SELECT 
    @UserId, 
    Id, 
    Name, 
    Calories, 
    Type, 
    Protein, 
    Carbs, 
    Fat, 
    PrepTime, 
    Image, 
    IngredientsJson, 
    StepsJson, 
    'copy'
  FROM dbo.Meals
  WHERE Id = @MealId AND Status = 'public';
END;
\`\`\`

### SP_CopyExerciseToUser
Copies an admin exercise to user's collection.

\`\`\`sql
CREATE PROCEDURE dbo.SP_CopyExerciseToUser
  @UserId UNIQUEIDENTIFIER,
  @ExerciseId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  
  INSERT INTO dbo.UserExercises (UserId, BaseExerciseId, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, Image, Description, StepsJson, Source)
  SELECT 
    @UserId, 
    Id, 
    Title, 
    MuscleGroup, 
    Duration, 
    Difficulty, 
    CaloriesBurned, 
    Image, 
    Description, 
    StepsJson, 
    'copy'
  FROM dbo.Exercises
  WHERE Id = @ExerciseId AND Status = 'public';
END;
\`\`\`

### SP_GetUserStatistics
Returns user statistics for admin dashboard.

\`\`\`sql
CREATE PROCEDURE dbo.SP_GetUserStatistics
AS
BEGIN
  SET NOCOUNT ON;
  
  SELECT 
    (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'user') AS TotalUsers,
    (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'user' AND Status = 'active') AS ActiveUsers,
    (SELECT COUNT(*) FROM dbo.Feedback) AS TotalFeedbacks,
    (SELECT COUNT(*) FROM dbo.Feedback WHERE Status = 'new') AS PendingFeedbacks,
    (SELECT COUNT(*) FROM dbo.Meals) AS TotalMeals,
    (SELECT COUNT(*) FROM dbo.Exercises) AS TotalExercises,
    (SELECT AVG(DurationMin) FROM dbo.SleepRecords WHERE BedTime >= DATEADD(day, -30, GETDATE())) AS AvgSleepMin30Days,
    (SELECT AVG(DailyWater) FROM (
      SELECT SUM(AmountMl) AS DailyWater 
      FROM dbo.WaterLogs 
      WHERE IntakeTime >= DATEADD(day, -30, GETDATE()) 
      GROUP BY UserId, CAST(IntakeTime AS DATE)
    ) AS WaterStats) AS AvgWaterMl30Days;
END;
\`\`\`

---

## 🌐 **API ENDPOINTS MAPPING**

### Authentication
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/auth/signup` | POST | Users | Create new user account |
| `/auth/login` | POST | Users | Authenticate user |
| `/auth/forgot-password` | POST | Users | Password reset |

### User - Meals
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/meals` | GET | Meals | Get all public meals |
| `/me/meals` | GET | UserMeals | Get user's personal meals |
| `/me/meals` | POST | UserMeals | Create custom meal |
| `/me/meals/:id` | PATCH | UserMeals | Update user meal |
| `/me/meals/:id` | DELETE | UserMeals | Delete user meal |
| `/me/meals/copy/:mealId` | POST | UserMeals | Copy admin meal → SP_CopyMealToUser |

### User - Exercises
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/exercises` | GET | Exercises | Get all public exercises |
| `/me/exercises` | GET | UserExercises | Get user's exercises |
| `/me/exercises` | POST | UserExercises | Create custom exercise |
| `/me/exercises/:id` | PATCH | UserExercises | Update user exercise |
| `/me/exercises/:id` | DELETE | UserExercises | Delete user exercise |
| `/me/exercises/copy/:exerciseId` | POST | UserExercises | Copy admin exercise → SP_CopyExerciseToUser |

### User - Tracking
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/me/sleep` | POST | SleepRecords | Log sleep data |
| `/me/sleep?range=week` | GET | SleepRecords | Get sleep history |
| `/me/water` | POST | WaterLogs | Log water intake |
| `/me/water/today` | GET | WaterLogs | Get today's water logs |
| `/me/activity/:date` | GET | ActivityLogs | Get daily activity summary |

### User - Feedback
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/feedback` | POST | Feedback | Submit feedback |

### Admin - User Management
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/admin/users` | GET | Users | List all users |
| `/admin/users` | POST | Users | Create user account |
| `/admin/users/:id` | PATCH | Users | Update user (role, status) |
| `/admin/users/:id` | DELETE | Users | Delete user |

### Admin - Content Management
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/admin/meals` | GET | Meals | List all meals |
| `/admin/meals` | POST | Meals | Create meal |
| `/admin/meals/:id` | PATCH | Meals | Update meal |
| `/admin/meals/:id` | DELETE | Meals | Delete meal |
| `/admin/exercises` | GET | Exercises | List all exercises |
| `/admin/exercises` | POST | Exercises | Create exercise |
| `/admin/exercises/:id` | PATCH | Exercises | Update exercise |
| `/admin/exercises/:id` | DELETE | Exercises | Delete exercise |

### Admin - Feedback
| Endpoint | Method | Table | Description |
|----------|--------|-------|-------------|
| `/admin/feedback` | GET | Feedback | Get all feedback |
| `/admin/feedback/:id` | PATCH | Feedback | Update status |

### Admin - Statistics
| Endpoint | Method | Procedure | Description |
|----------|--------|-----------|-------------|
| `/admin/statistics` | GET | SP_GetUserStatistics | Dashboard stats |

---

## 🔀 **DATA FLOW LOGIC**

### 1. User Adds Meal from Admin Database

\`\`\`
User clicks "Add to My Meals" on admin meal
  ↓
Frontend: POST /me/meals/copy/:mealId
  ↓
Backend: EXEC SP_CopyMealToUser @UserId, @MealId
  ↓
UserMeals table: New row created with Source='copy', BaseMealId=mealId
  ↓
User sees meal in "My Meals" tab
  ↓
User edits meal → only UserMeals row updated (admin Meals unchanged)
\`\`\`

### 2. Admin Updates Public Meal

\`\`\`
Admin edits meal in Meal Management
  ↓
Backend: UPDATE Meals SET ... WHERE Id = @MealId
  ↓
Admin Meals table updated
  ↓
User copies (UserMeals) NOT affected (data independence)
  ↓
New users copying this meal get updated version
\`\`\`

### 3. Activity Log Aggregation

\`\`\`
User completes workout
  ↓
Frontend: POST /me/exercises/complete
  ↓
Backend: Check if ActivityLogs entry exists for today
  ↓
IF NOT EXISTS:
  INSERT INTO ActivityLogs (UserId, Date, ExercisesJson)
ELSE:
  UPDATE ActivityLogs SET ExercisesJson = ... WHERE UserId AND Date = TODAY
  ↓
Dashboard shows aggregated data from ActivityLogs
\`\`\`

---

## 📝 **SAMPLE QUERIES**

### Get User's Total Meals (Admin + Personal)
\`\`\`sql
-- Count of meals user has access to
SELECT 
  (SELECT COUNT(*) FROM Meals WHERE Status = 'public') AS PublicMeals,
  (SELECT COUNT(*) FROM UserMeals WHERE UserId = @UserId) AS PersonalMeals,
  (SELECT COUNT(*) FROM Meals WHERE Status = 'public') + 
  (SELECT COUNT(*) FROM UserMeals WHERE UserId = @UserId) AS TotalAvailable;
\`\`\`

### Get Most Popular Meals (by user copies)
\`\`\`sql
SELECT 
  m.Name,
  m.Calories,
  COUNT(um.Id) AS UserCopies
FROM Meals m
LEFT JOIN UserMeals um ON m.Id = um.BaseMealId
WHERE m.Status = 'public'
GROUP BY m.Id, m.Name, m.Calories
ORDER BY UserCopies DESC;
\`\`\`

### Calculate User's Weekly Calorie Intake
\`\`\`sql
SELECT 
  CAST(al.[Date] AS DATE) AS [Date],
  JSON_VALUE(al.MealsJson, '$[0].calories') AS TotalCalories
FROM ActivityLogs al
WHERE al.UserId = @UserId 
  AND al.[Date] >= DATEADD(day, -7, GETDATE())
ORDER BY al.[Date];
\`\`\`

### Admin Dashboard: User Activity Heatmap
\`\`\`sql
SELECT 
  u.Name,
  COUNT(DISTINCT al.[Date]) AS ActiveDays,
  AVG(sr.DurationMin) AS AvgSleepMin,
  SUM(wl.AmountMl) AS TotalWater
FROM Users u
LEFT JOIN ActivityLogs al ON u.Id = al.UserId AND al.[Date] >= DATEADD(day, -30, GETDATE())
LEFT JOIN SleepRecords sr ON u.Id = sr.UserId AND sr.BedTime >= DATEADD(day, -30, GETDATE())
LEFT JOIN WaterLogs wl ON u.Id = wl.UserId AND wl.IntakeTime >= DATEADD(day, -30, GETDATE())
WHERE u.Role = 'user'
GROUP BY u.Id, u.Name
ORDER BY ActiveDays DESC;
\`\`\`

---

## 🛠️ **INSTALLATION SCRIPT**

Run this on SQL Server Management Studio (SSMS):

\`\`\`sql
-- Create database
IF DB_ID('CNPM') IS NULL 
  CREATE DATABASE CNPM;
GO

USE CNPM;
GO

-- Run all CREATE TABLE statements from above
-- Run all CREATE PROCEDURE statements
-- Insert sample data (optional)

-- Sample Admin User
INSERT INTO Users (Name, Email, PasswordHash, Role, Status)
VALUES ('Admin', 'admin@healthycolors.com', 'hashed_password_here', 'admin', 'active');

-- Sample Meals
INSERT INTO Meals (Name, Calories, Type, Protein, Carbs, Fat, PrepTime, IngredientsJson, StepsJson, Status)
VALUES 
  ('Quinoa Buddha Bowl', 450, 'lunch', 18, 62, 12, 25, 
   '["Quinoa", "Chickpeas", "Avocado"]', 
   '["Cook quinoa", "Roast chickpeas", "Assemble"]', 
   'public');
\`\`\`

---

## 📌 **NOTES**

1. **Password Security:** Use bcrypt or argon2 for hashing. Never store plain text.
2. **JSON Storage:** IngredientsJson and StepsJson use NVARCHAR(MAX) for flexibility. Consider JSON validation in application layer.
3. **Cascading Deletes:** User deletion removes all related data (UserMeals, UserExercises, etc.)
4. **Soft Deletes:** Consider adding `IsDeleted` flag instead of hard deletes for audit trails.
5. **Performance:** Add indexes on frequently queried fields (UserId, Date, Status).
6. **Backup Strategy:** Implement daily backups for production environment.

---

**Generated:** October 2025  
**Version:** 1.0  
**Contact:** HealthyColors Dev Team
