SET QUOTED_IDENTIFIER ON;
GO

DELETE FROM Users WHERE Email = 'test@example.com';

INSERT INTO Users (Id, Name, Email, PasswordHash, Role, Status, CreatedAt)
VALUES (
    NEWID(),
    'Test User',
    'test@example.com',
    '$2b$10$oXQl8CaGvi5Z9qw5nXvgqeBQx2MTnUqvMdktC9Y6XqUQ5Z7P8FbMO',
    'user',
    'active',
    GETDATE()
);

SELECT * FROM Users WHERE Email = 'test@example.com';
