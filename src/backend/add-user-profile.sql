-- Add UserProfile table for storing health metrics and goals
USE CNPM;
GO

-- Check if table exists, drop if needed for fresh start
IF OBJECT_ID('dbo.UserProfile', 'U') IS NOT NULL
    DROP TABLE dbo.UserProfile;
GO

CREATE TABLE dbo.UserProfile (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    Age INT,
    Weight DECIMAL(5,2), -- kg, up to 999.99
    Height DECIMAL(5,2), -- cm, up to 999.99
    Gender VARCHAR(10), -- 'male' or 'female'
    ActivityLevel VARCHAR(20), -- 'sedentary', 'light', 'moderate', 'active', 'veryActive'
    Goal VARCHAR(20), -- 'lose', 'maintain', 'gain'
    BMR DECIMAL(7,2), -- Basal Metabolic Rate
    TDEE DECIMAL(7,2), -- Total Daily Energy Expenditure
    CalorieGoal DECIMAL(7,2), -- Daily calorie target based on goal
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- Create index for faster lookups
CREATE INDEX IX_UserProfile_UserId ON dbo.UserProfile(UserId);
GO

-- Insert sample profile for existing test user
DECLARE @TestUserId UNIQUEIDENTIFIER;
SELECT TOP 1 @TestUserId = Id FROM Users WHERE Email = '123@gmail.com';

IF @TestUserId IS NOT NULL
BEGIN
    INSERT INTO UserProfile (UserId, Age, Weight, Height, Gender, ActivityLevel, Goal, BMR, TDEE, CalorieGoal)
    VALUES (
        @TestUserId,
        25, -- age
        70, -- weight in kg
        170, -- height in cm
        'male',
        'moderate', -- exercise 3-5 days/week
        'maintain',
        1680, -- BMR calculated
        2604, -- TDEE = BMR * 1.55 (moderate)
        2604 -- CalorieGoal = TDEE (maintain)
    );
    
    PRINT 'Sample profile created for user 123@gmail.com';
END
ELSE
BEGIN
    PRINT 'Test user not found, skipping sample data';
END
GO

-- Verify
SELECT 
    u.Email,
    p.Age,
    p.Weight,
    p.Height,
    p.Gender,
    p.ActivityLevel,
    p.Goal,
    p.CalorieGoal
FROM UserProfile p
JOIN Users u ON p.UserId = u.Id;
GO

PRINT 'UserProfile table created successfully!';
