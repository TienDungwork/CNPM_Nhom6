-- Create DailyPlans table for planning system
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DailyPlans')
BEGIN
    CREATE TABLE DailyPlans (
        PlanID INT IDENTITY(1,1) PRIMARY KEY,
        UserID UNIQUEIDENTIFIER NOT NULL,
        PlannedDate DATE NOT NULL,
        PlannedTime TIME NOT NULL,
        ActivityType NVARCHAR(50) NOT NULL, -- 'meal', 'exercise', 'water', 'sleep'
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500),
        Notes NVARCHAR(1000),
        IsCompleted BIT DEFAULT 0,
        MealID INT NULL,
        ExerciseID INT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        
        FOREIGN KEY (UserID) REFERENCES Users(Id) ON DELETE CASCADE
    );

    -- Create index for better performance
    CREATE INDEX IX_DailyPlans_UserDate ON DailyPlans(UserID, PlannedDate);
    CREATE INDEX IX_DailyPlans_ActivityType ON DailyPlans(ActivityType);

    PRINT 'DailyPlans table created successfully';
END
ELSE
BEGIN
    PRINT 'DailyPlans table already exists';
END
GO

-- Sample data for testing (optional)
-- You can uncomment this to add sample plans
/*
DECLARE @TestUserId INT = 1; -- Replace with actual user ID

INSERT INTO DailyPlans (UserID, PlannedDate, PlannedTime, ActivityType, Title, Description, Notes, IsCompleted)
VALUES 
    (@TestUserId, CAST(GETDATE() AS DATE), '07:00:00', 'meal', 'Breakfast', 'Oatmeal with fruits', 'Remember to add protein', 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '09:00:00', 'exercise', 'Morning Run', '30 minutes cardio', 'Bring water bottle', 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '10:00:00', 'water', 'Hydration Break', 'Drink 2 cups of water', NULL, 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '12:30:00', 'meal', 'Lunch', 'Grilled chicken salad', NULL, 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '15:00:00', 'water', 'Afternoon Hydration', 'Drink water', NULL, 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '18:00:00', 'exercise', 'Gym Session', 'Weight training', 'Focus on upper body', 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '19:30:00', 'meal', 'Dinner', 'Salmon with vegetables', NULL, 0),
    (@TestUserId, CAST(GETDATE() AS DATE), '22:30:00', 'sleep', 'Bedtime', 'Sleep 8 hours', 'Turn off devices', 0);

PRINT 'Sample daily plans inserted';
*/
