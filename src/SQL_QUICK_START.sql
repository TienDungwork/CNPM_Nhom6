-- =============================================
-- HealthyColors CNPM Database - Quick Start
-- SQL Server 2019+ 
-- Run this script in SQL Server Management Studio
-- =============================================

-- ===== STEP 1: CREATE DATABASE =====
IF DB_ID('CNPM') IS NULL 
  CREATE DATABASE CNPM;
GO

USE CNPM;
GO

-- ===== STEP 2: CREATE TABLES =====

-- Users Table
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

-- Meals Table (Admin Content)
CREATE TABLE dbo.Meals (
  Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  Name            NVARCHAR(150)    NOT NULL,
  Calories        INT              NOT NULL CHECK (Calories >= 0),
  Type            VARCHAR(20)      NOT NULL CHECK (Type IN ('breakfast','lunch','dinner','snack')),
  Protein         INT              NOT NULL DEFAULT 0 CHECK (Protein >= 0),
  Carbs           INT              NOT NULL DEFAULT 0 CHECK (Carbs >= 0),
  Fat             INT              NOT NULL DEFAULT 0 CHECK (Fat >= 0),
  PrepTime        INT              NOT NULL DEFAULT 15 CHECK (PrepTime > 0),
  Image           NVARCHAR(500)    NULL,
  IngredientsJson NVARCHAR(MAX)    NULL,
  StepsJson       NVARCHAR(MAX)    NULL,
  Source          VARCHAR(10)      NOT NULL DEFAULT 'admin' CHECK (Source IN ('admin')),
  CreatorId       UNIQUEIDENTIFIER NULL  REFERENCES dbo.Users(Id),
  Status          VARCHAR(10)      NOT NULL DEFAULT 'public' CHECK (Status IN ('public','hidden')),
  CreatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Meals_Type (Type),
  INDEX IX_Meals_Status (Status)
);

-- UserMeals Table (User Copies & Custom)
CREATE TABLE dbo.UserMeals (
  Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId          UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  BaseMealId      UNIQUEIDENTIFIER NULL  REFERENCES dbo.Meals(Id) ON DELETE SET NULL,
  Name            NVARCHAR(150)    NOT NULL,
  Calories        INT              NOT NULL CHECK (Calories >= 0),
  Type            VARCHAR(20)      NOT NULL CHECK (Type IN ('breakfast','lunch','dinner','snack')),
  Protein         INT              NOT NULL DEFAULT 0,
  Carbs           INT              NOT NULL DEFAULT 0,
  Fat             INT              NOT NULL DEFAULT 0,
  PrepTime        INT              NOT NULL DEFAULT 15,
  Image           NVARCHAR(500)    NULL,
  IngredientsJson NVARCHAR(MAX)    NULL,
  StepsJson       NVARCHAR(MAX)    NULL,
  Source          VARCHAR(10)      NOT NULL CHECK (Source IN ('copy','custom')),
  CreatedAt       DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_UserMeals_User (UserId),
  INDEX IX_UserMeals_Base (BaseMealId)
);

-- Exercises Table (Admin Content)
CREATE TABLE dbo.Exercises (
  Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  Title          NVARCHAR(150)    NOT NULL,
  MuscleGroup    NVARCHAR(80)     NOT NULL,
  Duration       INT              NOT NULL CHECK (Duration > 0),
  Difficulty     VARCHAR(20)      NOT NULL CHECK (Difficulty IN ('Beginner','Intermediate','Advanced')),
  CaloriesBurned INT              NOT NULL DEFAULT 100,
  Image          NVARCHAR(500)    NULL,
  Description    NVARCHAR(500)    NULL,
  StepsJson      NVARCHAR(MAX)    NULL,
  Source         VARCHAR(10)      NOT NULL DEFAULT 'admin' CHECK (Source IN ('admin')),
  CreatorId      UNIQUEIDENTIFIER NULL  REFERENCES dbo.Users(Id),
  Status         VARCHAR(10)      NOT NULL DEFAULT 'public' CHECK (Status IN ('public','hidden')),
  CreatedAt      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Exercises_Difficulty (Difficulty),
  INDEX IX_Exercises_Status (Status)
);

-- UserExercises Table (User Copies & Custom)
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

-- SleepRecords Table
CREATE TABLE dbo.SleepRecords (
  Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId      UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  BedTime     DATETIME2        NOT NULL,
  WakeTime    DATETIME2        NOT NULL,
  DurationMin AS (DATEDIFF(MINUTE, BedTime, WakeTime)) PERSISTED,
  CreatedAt   DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Sleep_UserDate (UserId, BedTime)
);

-- WaterLogs Table
CREATE TABLE dbo.WaterLogs (
  Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId     UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  IntakeTime DATETIME2        NOT NULL,
  AmountMl   INT              NOT NULL CHECK (AmountMl > 0),
  
  INDEX IX_Water_UserTime (UserId, IntakeTime)
);

-- ActivityLogs Table
CREATE TABLE dbo.ActivityLogs (
  Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId        UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  [Date]        DATE             NOT NULL,
  MealsJson     NVARCHAR(MAX)    NULL,
  ExercisesJson NVARCHAR(MAX)    NULL,
  SleepJson     NVARCHAR(MAX)    NULL,
  WaterJson     NVARCHAR(MAX)    NULL,
  
  CONSTRAINT UQ_Activity_UserDate UNIQUE(UserId, [Date]),
  INDEX IX_Activity_Date ([Date])
);

-- Feedback Table
CREATE TABLE dbo.Feedback (
  Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId     UNIQUEIDENTIFIER NOT NULL REFERENCES dbo.Users(Id) ON DELETE CASCADE,
  Message    NVARCHAR(2000)   NOT NULL,
  Status     VARCHAR(12)      NOT NULL DEFAULT 'new' CHECK (Status IN ('new','in_progress','done')),
  CreatedAt  DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  
  INDEX IX_Feedback_Status (Status),
  INDEX IX_Feedback_User (UserId)
);

GO

-- ===== STEP 3: CREATE STORED PROCEDURES =====

-- Copy Meal to User
CREATE PROCEDURE dbo.SP_CopyMealToUser
  @UserId UNIQUEIDENTIFIER,
  @MealId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  
  INSERT INTO dbo.UserMeals (
    UserId, BaseMealId, Name, Calories, Type, Protein, Carbs, Fat, 
    PrepTime, Image, IngredientsJson, StepsJson, Source
  )
  SELECT 
    @UserId, Id, Name, Calories, Type, Protein, Carbs, Fat, 
    PrepTime, Image, IngredientsJson, StepsJson, 'copy'
  FROM dbo.Meals
  WHERE Id = @MealId AND Status = 'public';
END;
GO

-- Copy Exercise to User
CREATE PROCEDURE dbo.SP_CopyExerciseToUser
  @UserId UNIQUEIDENTIFIER,
  @ExerciseId UNIQUEIDENTIFIER
AS
BEGIN
  SET NOCOUNT ON;
  
  INSERT INTO dbo.UserExercises (
    UserId, BaseExerciseId, Title, MuscleGroup, Duration, Difficulty, 
    CaloriesBurned, Image, Description, StepsJson, Source
  )
  SELECT 
    @UserId, Id, Title, MuscleGroup, Duration, Difficulty, 
    CaloriesBurned, Image, Description, StepsJson, 'copy'
  FROM dbo.Exercises
  WHERE Id = @ExerciseId AND Status = 'public';
END;
GO

-- Get User Statistics
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
    (SELECT COUNT(*) FROM dbo.Exercises) AS TotalExercises;
END;
GO

-- ===== STEP 4: INSERT SAMPLE DATA =====

-- Sample Admin User (password: admin123)
INSERT INTO dbo.Users (Name, Email, PasswordHash, Role, Status)
VALUES ('Admin User', 'admin@healthycolors.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'admin', 'active');

-- Sample Regular User (password: user123)
INSERT INTO dbo.Users (Name, Email, PasswordHash, Role, Status)
VALUES ('John Doe', 'john@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'user', 'active');

-- Sample Meals
INSERT INTO dbo.Meals (Name, Calories, Type, Protein, Carbs, Fat, PrepTime, IngredientsJson, StepsJson, Status)
VALUES 
  ('Quinoa Buddha Bowl', 450, 'lunch', 18, 62, 12, 25, 
   '["Quinoa","Chickpeas","Avocado","Spinach","Cherry tomatoes","Olive oil","Lemon"]', 
   '["Cook quinoa according to package","Roast chickpeas with spices","Prepare vegetables","Assemble bowl with all ingredients","Drizzle with olive oil and lemon"]', 
   'public'),
   
  ('Overnight Oats with Berries', 320, 'breakfast', 12, 48, 8, 5, 
   '["Oats","Almond milk","Blueberries","Strawberries","Honey","Chia seeds","Almonds"]', 
   '["Mix oats with almond milk","Add chia seeds and honey","Refrigerate overnight","Top with fresh berries and almonds"]', 
   'public'),
   
  ('Grilled Chicken & Vegetables', 520, 'dinner', 45, 32, 18, 30, 
   '["Chicken breast","Broccoli","Bell peppers","Zucchini","Olive oil","Garlic","Herbs"]', 
   '["Marinate chicken with herbs and garlic","Grill chicken until cooked","Sauté vegetables","Serve together"]', 
   'public'),
   
  ('Greek Yogurt Parfait', 280, 'snack', 20, 35, 6, 5, 
   '["Greek yogurt","Granola","Mixed berries","Honey","Walnuts"]', 
   '["Layer yogurt in glass","Add granola and berries","Drizzle with honey","Top with walnuts"]', 
   'public');

-- Sample Exercises
INSERT INTO dbo.Exercises (Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, Description, StepsJson, Status)
VALUES 
  ('Full Body Strength', 'Full Body', 45, 'Intermediate', 320, 
   'Complete workout targeting all major muscle groups with compound movements', 
   '["Warm up for 5 minutes","Perform 10 squats","Do 10 push-ups","Complete 10 lunges each leg","Rest 60 seconds","Repeat for 3 sets","Cool down and stretch"]', 
   'public'),
   
  ('Morning Yoga Flow', 'Flexibility', 20, 'Beginner', 80, 
   'Gentle yoga sequence to start your day with energy and flexibility', 
   '["Begin in mountain pose","Sun salutation A","Warrior sequence","Triangle pose","Seated forward fold","Finish with savasana"]', 
   'public'),
   
  ('HIIT Cardio Blast', 'Cardio', 30, 'Advanced', 450, 
   'High-intensity interval training for maximum calorie burn', 
   '["Warm up jogging","30sec burpees","30sec rest","30sec jump squats","30sec rest","30sec mountain climbers","Repeat 5 rounds","Cool down"]', 
   'public'),
   
  ('Core Strengthening', 'Core', 15, 'Beginner', 100, 
   'Focused ab workout for building core strength', 
   '["Plank hold 30 seconds","Crunches 15 reps","Bicycle crunches 20 reps","Leg raises 10 reps","Rest 30 seconds","Repeat 3 times"]', 
   'public');

GO

-- ===== STEP 5: VERIFY INSTALLATION =====

-- Check table counts
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM dbo.Users
UNION ALL
SELECT 'Meals', COUNT(*) FROM dbo.Meals
UNION ALL
SELECT 'Exercises', COUNT(*) FROM dbo.Exercises;

GO

PRINT '========================================';
PRINT 'HealthyColors CNPM Database Setup Complete!';
PRINT '========================================';
PRINT 'Database: CNPM';
PRINT 'Tables Created: 9';
PRINT 'Stored Procedures: 3';
PRINT 'Sample Data: Loaded';
PRINT '========================================';
PRINT 'Next Steps:';
PRINT '1. Configure backend API connection';
PRINT '2. Update connection string in .env';
PRINT '3. Test API endpoints';
PRINT '========================================';

-- ===== OPTIONAL: USEFUL QUERIES =====

-- View all public meals
-- SELECT * FROM dbo.Meals WHERE Status = 'public';

-- View all public exercises
-- SELECT * FROM dbo.Exercises WHERE Status = 'public';

-- Get user statistics
-- EXEC dbo.SP_GetUserStatistics;

-- Test copy meal to user
-- DECLARE @UserId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Users WHERE Role = 'user');
-- DECLARE @MealId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Meals);
-- EXEC dbo.SP_CopyMealToUser @UserId, @MealId;
-- SELECT * FROM dbo.UserMeals WHERE UserId = @UserId;
