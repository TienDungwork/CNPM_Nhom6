-- Create SleepLogs table for tracking user sleep
USE CNPM;
GO

-- Drop table if exists (for testing)
IF OBJECT_ID('SleepLogs', 'U') IS NOT NULL
    DROP TABLE SleepLogs;
GO

CREATE TABLE SleepLogs (
    SleepID INT IDENTITY(1,1) PRIMARY KEY,
    UserID UNIQUEIDENTIFIER NOT NULL,
    SleepDate DATE NOT NULL,
    Duration DECIMAL(4,2) NOT NULL, -- Hours (e.g., 7.5)
    Quality NVARCHAR(20) NULL, -- 'poor', 'fair', 'good', 'excellent'
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_SleepLogs_Users FOREIGN KEY (UserID) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT CHK_Duration CHECK (Duration > 0 AND Duration <= 24),
    CONSTRAINT CHK_Quality CHECK (Quality IN ('poor', 'fair', 'good', 'excellent') OR Quality IS NULL)
);
GO

-- Create indexes for better query performance
CREATE INDEX IX_SleepLogs_UserID ON SleepLogs(UserID);
CREATE INDEX IX_SleepLogs_SleepDate ON SleepLogs(SleepDate);
CREATE INDEX IX_SleepLogs_UserID_SleepDate ON SleepLogs(UserID, SleepDate);
GO

PRINT '✅ SleepLogs table created successfully!';
GO
