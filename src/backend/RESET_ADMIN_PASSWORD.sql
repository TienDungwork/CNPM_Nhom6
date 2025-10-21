-- =============================================
-- RESET ADMIN PASSWORD
-- HealthyColors CNPM Database
-- =============================================

USE CNPM;
GO

PRINT '==========================================';
PRINT 'RESET ADMIN PASSWORD';
PRINT '==========================================';
PRINT '';

-- Show current admin users
PRINT 'Current admin users:';
SELECT Id, Name, Email, Role, Status, CreatedAt 
FROM dbo.Users 
WHERE Role = 'admin';

PRINT '';
PRINT 'IMPORTANT: You need to hash the new password using bcrypt.';
PRINT 'Steps to reset admin password:';
PRINT '1. Generate bcrypt hash using Node.js or online tool';
PRINT '2. Update the PasswordHash below';
PRINT '3. Run the UPDATE statement';
PRINT '';

-- =============================================
-- METHOD 1: Use Node.js to generate hash
-- =============================================
PRINT 'METHOD 1: Generate hash with Node.js';
PRINT '------------------------------------------';
PRINT 'Run this in PowerShell/Terminal:';
PRINT '';
PRINT 'node -e "const bcrypt = require(''bcrypt''); bcrypt.hash(''NewPassword123'', 10).then(hash => console.log(hash));"';
PRINT '';
PRINT 'Replace ''NewPassword123'' with your desired password';
PRINT '';

-- =============================================
-- METHOD 2: Use backend API endpoint
-- =============================================
PRINT 'METHOD 2: Create new admin via backend API';
PRINT '------------------------------------------';
PRINT 'Run this PowerShell command:';
PRINT '';
PRINT '$body = @{name="New Admin";email="newadmin@test.com";password="Admin123!";role="admin"} | ConvertTo-Json';
PRINT 'Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body';
PRINT '';

-- =============================================
-- METHOD 3: Manual UPDATE (after generating hash)
-- =============================================
PRINT 'METHOD 3: Direct UPDATE (use generated hash)';
PRINT '------------------------------------------';
PRINT 'After generating hash, run:';
PRINT '';
PRINT 'UPDATE dbo.Users';
PRINT 'SET PasswordHash = ''$2a$10$YOUR_GENERATED_HASH_HERE''';
PRINT 'WHERE Email = ''admin@healthycolors.com'';';
PRINT '';

-- =============================================
-- QUICK FIX: Delete old admin and create new one via API
-- =============================================
PRINT '==========================================';
PRINT 'RECOMMENDED: Create new admin via API';
PRINT '==========================================';
PRINT '';
PRINT 'This is the easiest way:';
PRINT '1. Delete old admin (optional)';
PRINT '2. Create new admin via register API with role="admin"';
PRINT '';
PRINT 'PowerShell command:';
PRINT '';
PRINT '$adminData = @{';
PRINT '    name = "Admin User"';
PRINT '    email = "admin@test.com"';
PRINT '    password = "Admin123!"';
PRINT '} | ConvertTo-Json';
PRINT '';
PRINT 'Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $adminData';
PRINT '';
PRINT 'Then manually update role to admin in database:';
PRINT '';
PRINT 'UPDATE dbo.Users SET Role = ''admin'' WHERE Email = ''admin@test.com'';';
PRINT '';

GO

-- =============================================
-- Optional: Delete old admin (UNCOMMENT TO USE)
-- =============================================
-- DELETE FROM dbo.Users WHERE Email = 'admin@healthycolors.com';
-- PRINT 'Old admin deleted';
-- GO

PRINT '==========================================';
PRINT 'SCRIPT COMPLETE';
PRINT '==========================================';
