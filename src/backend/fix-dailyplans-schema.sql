-- Fix DailyPlans table to use UNIQUEIDENTIFIER for MealID and ExerciseID
-- This matches the Meals.Id and Exercises.Id column types

USE CNPM;
GO

SET QUOTED_IDENTIFIER ON;
GO

-- First, drop any existing foreign key constraints if they exist
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_DailyPlans_Meals')
    ALTER TABLE DailyPlans DROP CONSTRAINT FK_DailyPlans_Meals;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_DailyPlans_Exercises')
    ALTER TABLE DailyPlans DROP CONSTRAINT FK_DailyPlans_Exercises;

-- Drop existing indexes on these columns
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_DailyPlans_MealID' AND object_id = OBJECT_ID('DailyPlans'))
    DROP INDEX IX_DailyPlans_MealID ON DailyPlans;

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_DailyPlans_ExerciseID' AND object_id = OBJECT_ID('DailyPlans'))
    DROP INDEX IX_DailyPlans_ExerciseID ON DailyPlans;

-- Drop and recreate the columns with correct type
ALTER TABLE DailyPlans DROP COLUMN MealID;
ALTER TABLE DailyPlans DROP COLUMN ExerciseID;

ALTER TABLE DailyPlans ADD MealID UNIQUEIDENTIFIER NULL;
ALTER TABLE DailyPlans ADD ExerciseID UNIQUEIDENTIFIER NULL;

-- Recreate indexes
CREATE INDEX IX_DailyPlans_MealID ON DailyPlans(MealID) WHERE MealID IS NOT NULL;
CREATE INDEX IX_DailyPlans_ExerciseID ON DailyPlans(ExerciseID) WHERE MealID IS NOT NULL;

-- Add foreign key constraints (optional, for data integrity)
ALTER TABLE DailyPlans 
ADD CONSTRAINT FK_DailyPlans_Meals 
FOREIGN KEY (MealID) REFERENCES Meals(Id);

ALTER TABLE DailyPlans 
ADD CONSTRAINT FK_DailyPlans_Exercises 
FOREIGN KEY (ExerciseID) REFERENCES Exercises(Id);

PRINT 'DailyPlans table updated successfully!';
PRINT 'MealID and ExerciseID now use UNIQUEIDENTIFIER type.';
GO
