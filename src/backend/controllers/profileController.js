const { executeQuery } = require('../config/database');

/**
 * Calculate BMR using Harris-Benedict Formula
 */
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

/**
 * Calculate calorie goal based on user's goal
 */
const calculateCalorieGoal = (tdee, goal) => {
  switch (goal) {
    case 'lose':
      return tdee - 500; // Deficit for weight loss
    case 'gain':
      return tdee + 500; // Surplus for weight gain
    case 'maintain':
    default:
      return tdee; // Maintenance
  }
};

/**
 * Get user profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        Id, UserId, Age, Weight, Height, Gender, 
        ActivityLevel, Goal, BMR, TDEE, CalorieGoal, UpdatedAt
      FROM UserProfile
      WHERE UserId = @userId
    `;
    
    const result = await executeQuery(query, { userId });
    
    if (result.recordset.length === 0) {
      return res.json({ 
        hasProfile: false,
        message: 'No profile found. Please complete your profile.'
      });
    }
    
    const profile = result.recordset[0];
    
    res.json({
      hasProfile: true,
      profile: {
        id: profile.Id,
        age: profile.Age,
        weight: profile.Weight,
        height: profile.Height,
        gender: profile.Gender,
        activityLevel: profile.ActivityLevel,
        goal: profile.Goal,
        bmr: profile.BMR,
        tdee: profile.TDEE,
        calorieGoal: profile.CalorieGoal,
        updatedAt: profile.UpdatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile'
    });
  }
};

/**
 * Create or update user profile
 */
const saveUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { age, weight, height, gender, activityLevel, goal } = req.body;
    
    // Validate required fields
    if (!age || !weight || !height || !gender || !activityLevel || !goal) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All fields are required'
      });
    }
    
    // Calculate metrics
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieGoal = calculateCalorieGoal(tdee, goal);
    
    // Check if profile exists
    const checkQuery = `SELECT Id FROM UserProfile WHERE UserId = @userId`;
    const checkResult = await executeQuery(checkQuery, { userId });
    
    if (checkResult.recordset.length === 0) {
      // Create new profile
      const insertQuery = `
        INSERT INTO UserProfile (
          UserId, Age, Weight, Height, Gender, ActivityLevel, Goal, 
          BMR, TDEE, CalorieGoal, UpdatedAt
        )
        VALUES (
          @userId, @age, @weight, @height, @gender, @activityLevel, @goal,
          @bmr, @tdee, @calorieGoal, GETDATE()
        )
      `;
      
      await executeQuery(insertQuery, {
        userId,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender,
        activityLevel,
        goal,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calorieGoal: Math.round(calorieGoal)
      });
      
      res.json({
        message: 'Profile created successfully',
        profile: {
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          gender,
          activityLevel,
          goal,
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          calorieGoal: Math.round(calorieGoal)
        }
      });
    } else {
      // Update existing profile
      const updateQuery = `
        UPDATE UserProfile
        SET Age = @age,
            Weight = @weight,
            Height = @height,
            Gender = @gender,
            ActivityLevel = @activityLevel,
            Goal = @goal,
            BMR = @bmr,
            TDEE = @tdee,
            CalorieGoal = @calorieGoal,
            UpdatedAt = GETDATE()
        WHERE UserId = @userId
      `;
      
      await executeQuery(updateQuery, {
        userId,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender,
        activityLevel,
        goal,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calorieGoal: Math.round(calorieGoal)
      });
      
      res.json({
        message: 'Profile updated successfully',
        profile: {
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          gender,
          activityLevel,
          goal,
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          calorieGoal: Math.round(calorieGoal)
        }
      });
    }
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save user profile'
    });
  }
};

module.exports = {
  getUserProfile,
  saveUserProfile
};
