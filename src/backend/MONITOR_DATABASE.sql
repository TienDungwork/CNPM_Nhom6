-- =============================================
-- DATABASE MONITORING & CHANGE TRACKING SCRIPT
-- HealthyColors CNPM Database
-- Based on SQL_QUICK_START.sql structure
-- =============================================

USE CNPM;
GO

PRINT '==========================================';
PRINT 'DATABASE CHANGE TRACKING & MONITORING';
PRINT '==========================================';
PRINT '';

-- =============================================
-- 1. OVERVIEW - Database Info
-- =============================================
PRINT '1. DATABASE OVERVIEW';
PRINT '------------------------------------------';

SELECT 
    DB_NAME() AS DatabaseName,
    SUSER_SNAME() AS CurrentUser,
    GETDATE() AS CurrentDateTime;
GO

PRINT '';

-- =============================================
-- 2. ALL TABLES - Row Counts
-- =============================================
PRINT '2. ALL TABLES WITH ROW COUNTS';
PRINT '------------------------------------------';

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM dbo.Users
UNION ALL
SELECT 'Meals', COUNT(*) FROM dbo.Meals
UNION ALL
SELECT 'Exercises', COUNT(*) FROM dbo.Exercises
UNION ALL
SELECT 'UserMeals', COUNT(*) FROM dbo.UserMeals
UNION ALL
SELECT 'UserExercises', COUNT(*) FROM dbo.UserExercises
UNION ALL
SELECT 'SleepRecords', COUNT(*) FROM dbo.SleepRecords
UNION ALL
SELECT 'WaterLogs', COUNT(*) FROM dbo.WaterLogs
UNION ALL
SELECT 'ActivityLogs', COUNT(*) FROM dbo.ActivityLogs
UNION ALL
SELECT 'Feedback', COUNT(*) FROM dbo.Feedback;
GO

PRINT '';

-- =============================================
-- 3. USERS TABLE - All Records
-- =============================================
PRINT '3. USERS TABLE - ALL RECORDS';
PRINT '------------------------------------------';

SELECT 
    Id,
    Name,
    Email,
    Role,
    Status,
    CreatedAt
FROM dbo.Users
ORDER BY CreatedAt DESC;
GO

PRINT '';

-- =============================================
-- 4. RECENT USERS - Last 24 Hours
-- =============================================
PRINT '4. NEW USERS (LAST 24 HOURS)';
PRINT '------------------------------------------';

SELECT 
    Id,
    Name,
    Email,
    Role,
    Status,
    CreatedAt
FROM dbo.Users
WHERE CreatedAt >= DATEADD(HOUR, -24, GETDATE())
ORDER BY CreatedAt DESC;
GO

PRINT '';

-- =============================================
-- 5. MEALS TABLE - Summary by Type
-- =============================================
PRINT '5. MEALS TABLE - SUMMARY';
PRINT '------------------------------------------';

SELECT 
    Type AS MealType,
    COUNT(*) AS TotalMeals,
    AVG(Calories) AS AvgCalories,
    MIN(Calories) AS MinCalories,
    MAX(Calories) AS MaxCalories,
    Status
FROM dbo.Meals
GROUP BY Type, Status
ORDER BY TotalMeals DESC;
GO

PRINT '';

-- =============================================
-- 6. EXERCISES TABLE - Summary
-- =============================================
PRINT '6. EXERCISES TABLE - SUMMARY';
PRINT '------------------------------------------';

SELECT 
    Difficulty,
    COUNT(*) AS TotalExercises,
    AVG(Duration) AS AvgDuration,
    AVG(CaloriesBurned) AS AvgCaloriesBurned,
    Status
FROM dbo.Exercises
GROUP BY Difficulty, Status
ORDER BY TotalExercises DESC;
GO

PRINT '';

-- =============================================
-- 7. USER MEALS - Recent Activity
-- =============================================
PRINT '7. USER MEALS (LAST 7 DAYS)';
PRINT '------------------------------------------';

SELECT TOP 10
    u.Name AS UserName,
    um.Name AS MealName,
    um.Calories,
    um.Type,
    um.Source,
    um.CreatedAt
FROM dbo.UserMeals um
JOIN dbo.Users u ON um.UserId = u.Id
WHERE um.CreatedAt >= DATEADD(DAY, -7, GETDATE())
ORDER BY um.CreatedAt DESC;
GO

PRINT '';

-- =============================================
-- 8. USER EXERCISES - Recent Activity
-- =============================================
PRINT '8. USER EXERCISES (LAST 7 DAYS)';
PRINT '------------------------------------------';

SELECT TOP 10
    u.Name AS UserName,
    ue.Title AS ExerciseTitle,
    ue.Duration,
    ue.CaloriesBurned,
    ue.Difficulty,
    ue.Source,
    ue.CreatedAt
FROM dbo.UserExercises ue
JOIN dbo.Users u ON ue.UserId = u.Id
WHERE ue.CreatedAt >= DATEADD(DAY, -7, GETDATE())
ORDER BY ue.CreatedAt DESC;
GO

PRINT '';

-- =============================================
-- 9. SLEEP RECORDS (LAST 7 DAYS)
-- =============================================
PRINT '9. SLEEP RECORDS (LAST 7 DAYS)';
PRINT '------------------------------------------';

SELECT TOP 10
    u.Name AS UserName,
    sr.BedTime,
    sr.WakeTime,
    sr.DurationMin,
    sr.CreatedAt
FROM dbo.SleepRecords sr
JOIN dbo.Users u ON sr.UserId = u.Id
WHERE sr.BedTime >= DATEADD(DAY, -7, GETDATE())
ORDER BY sr.BedTime DESC;
GO

PRINT '';

-- =============================================
-- 10. WATER LOGS (LAST 7 DAYS)
-- =============================================
PRINT '10. WATER LOGS (LAST 7 DAYS)';
PRINT '------------------------------------------';

SELECT 
    u.Name AS UserName,
    COUNT(*) AS LogCount,
    SUM(wl.AmountMl) AS TotalWaterML,
    AVG(wl.AmountMl) AS AvgAmountPerLog
FROM dbo.WaterLogs wl
JOIN dbo.Users u ON wl.UserId = u.Id
WHERE wl.IntakeTime >= DATEADD(DAY, -7, GETDATE())
GROUP BY u.Name
ORDER BY TotalWaterML DESC;
GO

PRINT '';

-- =============================================
-- 11. ACTIVITY LOGS (LAST 7 DAYS)
-- =============================================
PRINT '11. ACTIVITY LOGS (LAST 7 DAYS)';
PRINT '------------------------------------------';

SELECT TOP 20
    u.Name AS UserName,
    al.[Date],
    CASE 
        WHEN al.MealsJson IS NOT NULL THEN 'Has Meals'
        ELSE 'No Meals'
    END AS MealsStatus,
    CASE 
        WHEN al.ExercisesJson IS NOT NULL THEN 'Has Exercises'
        ELSE 'No Exercises'
    END AS ExercisesStatus
FROM dbo.ActivityLogs al
JOIN dbo.Users u ON al.UserId = u.Id
WHERE al.[Date] >= DATEADD(DAY, -7, GETDATE())
ORDER BY al.[Date] DESC;
GO

PRINT '';

-- =============================================
-- 12. FEEDBACK - All Records
-- =============================================
PRINT '12. FEEDBACK - ALL RECORDS';
PRINT '------------------------------------------';

SELECT 
    u.Name AS UserName,
    f.Message,
    f.Status,
    f.CreatedAt
FROM dbo.Feedback f
JOIN dbo.Users u ON f.UserId = u.Id
ORDER BY f.CreatedAt DESC;
GO

PRINT '';

-- =============================================
-- 13. STATISTICS SUMMARY
-- =============================================
PRINT '13. DATABASE STATISTICS SUMMARY';
PRINT '------------------------------------------';

SELECT 
    'Total Users' AS Metric,
    COUNT(*) AS [Value],
    'users' AS Unit
FROM dbo.Users

UNION ALL

SELECT 
    'Active Users',
    COUNT(*),
    'users'
FROM dbo.Users
WHERE Status = 'active'

UNION ALL

SELECT 
    'Admin Users',
    COUNT(*),
    'users'
FROM dbo.Users
WHERE Role = 'admin'

UNION ALL

SELECT 
    'Total Meals',
    COUNT(*),
    'meals'
FROM dbo.Meals

UNION ALL

SELECT 
    'Total Exercises',
    COUNT(*),
    'exercises'
FROM dbo.Exercises

UNION ALL

SELECT 
    'User Meals (Last 7 Days)',
    COUNT(*),
    'logs'
FROM dbo.UserMeals
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE())

UNION ALL

SELECT 
    'User Exercises (Last 7 Days)',
    COUNT(*),
    'logs'
FROM dbo.UserExercises
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE())

UNION ALL

SELECT 
    'Total Feedback',
    COUNT(*),
    'feedbacks'
FROM dbo.Feedback;
GO

PRINT '';

-- =============================================
-- 14. DATA INTEGRITY CHECKS
-- =============================================
PRINT '14. DATA INTEGRITY CHECKS';
PRINT '------------------------------------------';

-- Check for orphaned UserMeals
DECLARE @OrphanedMeals INT;
SELECT @OrphanedMeals = COUNT(*) 
FROM dbo.UserMeals um 
WHERE NOT EXISTS (SELECT 1 FROM dbo.Users u WHERE u.Id = um.UserId);

IF @OrphanedMeals > 0
    PRINT 'WARNING: Found ' + CAST(@OrphanedMeals AS VARCHAR) + ' orphaned UserMeals';
ELSE
    PRINT 'OK: No orphaned UserMeals';

-- Check for orphaned UserExercises
DECLARE @OrphanedExercises INT;
SELECT @OrphanedExercises = COUNT(*) 
FROM dbo.UserExercises ue 
WHERE NOT EXISTS (SELECT 1 FROM dbo.Users u WHERE u.Id = ue.UserId);

IF @OrphanedExercises > 0
    PRINT 'WARNING: Found ' + CAST(@OrphanedExercises AS VARCHAR) + ' orphaned UserExercises';
ELSE
    PRINT 'OK: No orphaned UserExercises';
GO

PRINT '';
PRINT '==========================================';
PRINT 'MONITORING COMPLETE!';
PRINT '==========================================';
PRINT '';
PRINT 'Run this script anytime to check database status.';
PRINT '';

-- =============================================
-- Create stored procedure for quick monitoring
-- =============================================
GO

IF OBJECT_ID('dbo.SP_MonitorDatabase', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_MonitorDatabase;
GO

CREATE PROCEDURE dbo.SP_MonitorDatabase
AS
BEGIN
    SET NOCOUNT ON;
    
    PRINT '==========================================';
    PRINT 'QUICK DATABASE MONITORING';
    PRINT '==========================================';
    
    -- Table counts
    SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM dbo.Users
    UNION ALL
    SELECT 'Meals', COUNT(*) FROM dbo.Meals
    UNION ALL
    SELECT 'Exercises', COUNT(*) FROM dbo.Exercises
    UNION ALL
    SELECT 'UserMeals', COUNT(*) FROM dbo.UserMeals
    UNION ALL
    SELECT 'UserExercises', COUNT(*) FROM dbo.UserExercises
    UNION ALL
    SELECT 'Feedback', COUNT(*) FROM dbo.Feedback;
    
    -- Recent users (24 hours)
    PRINT '';
    PRINT 'NEW USERS (Last 24 Hours):';
    SELECT Name, Email, Role, CreatedAt 
    FROM dbo.Users 
    WHERE CreatedAt >= DATEADD(HOUR, -24, GETDATE())
    ORDER BY CreatedAt DESC;
    
    PRINT '';
    PRINT 'Monitoring complete!';
END;
GO

PRINT '';
PRINT 'Stored procedure created: dbo.SP_MonitorDatabase';
PRINT 'Usage: EXEC dbo.SP_MonitorDatabase';
PRINT '';
