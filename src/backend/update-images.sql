-- Update images for Meals table
USE CNPM;
GO

-- Update meal images with Unsplash URLs
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' WHERE Name LIKE '%Buddha Bowl%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800' WHERE Name LIKE '%Overnight Oats%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800' WHERE Name LIKE '%Grilled Chicken%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' WHERE Name LIKE '%Salad%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' WHERE Name LIKE '%Burger%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800' WHERE Name LIKE '%Avocado Toast%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' WHERE Name LIKE '%Pizza%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800' WHERE Name LIKE '%Pancake%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800' WHERE Name LIKE '%Smoothie Bowl%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800' WHERE Name LIKE '%Sandwich%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800' WHERE Name LIKE '%Wrap%';
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800' WHERE Name LIKE '%Stir Fry%';

-- Fallback: Update any remaining meals without images
UPDATE Meals SET Image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' WHERE Image IS NULL OR Image = '';

-- Update exercise images with Unsplash URLs
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' WHERE Title LIKE '%Push%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800' WHERE Title LIKE '%Squat%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' WHERE Title LIKE '%Running%' OR Title LIKE '%Cardio%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800' WHERE Title LIKE '%Plank%' OR Title LIKE '%Core%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800' WHERE Title LIKE '%Yoga%' OR Title LIKE '%Stretch%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' WHERE Title LIKE '%Gym%' OR Title LIKE '%Weight%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800' WHERE Title LIKE '%Lunge%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800' WHERE Title LIKE '%Cycling%' OR Title LIKE '%Bike%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800' WHERE Title LIKE '%Jump%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800' WHERE Title LIKE '%Dumbbell%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800' WHERE Title LIKE '%Pull%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800' WHERE Title LIKE '%Abs%' OR Title LIKE '%Crunch%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800' WHERE Title LIKE '%Burpee%';
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800' WHERE Title LIKE '%HIIT%';

-- Fallback: Update any remaining exercises without images
UPDATE Exercises SET Image = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' WHERE Image IS NULL OR Image = '';

-- Verify results
SELECT 'Meals with images' AS Info, COUNT(*) AS Count FROM Meals WHERE Image IS NOT NULL AND Image != '';
SELECT 'Exercises with images' AS Info, COUNT(*) AS Count FROM Exercises WHERE Image IS NOT NULL AND Image != '';

-- Show sample data
SELECT TOP 3 Name, Image FROM Meals;
SELECT TOP 3 Title, Image FROM Exercises;

GO
