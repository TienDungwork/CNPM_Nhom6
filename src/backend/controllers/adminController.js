const { executeQuery } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Get all users
 * Matches SQL_QUICK_START.sql Users table schema
 */
const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT Id, Name, Email, Role, Status, CreatedAt
      FROM dbo.Users
      ORDER BY CreatedAt DESC
    `;
    const result = await executeQuery(query);

    // Convert PascalCase to camelCase for frontend
    const users = result.recordset.map(user => ({
      id: user.Id,
      name: user.Name,
      email: user.Email,
      role: user.Role,
      status: user.Status,
      createdAt: user.CreatedAt
    }));

    res.json({
      users: users,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get users'
    });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT Id, Name, Email, Role, Status, CreatedAt
      FROM dbo.Users
      WHERE Id = @userId
    `;
    const result = await executeQuery(query, { userId });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Convert PascalCase to camelCase
    const user = result.recordset[0];
    res.json({
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        role: user.Role,
        status: user.Status,
        createdAt: user.CreatedAt
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user'
    });
  }
};

/**
 * Create admin meal
 * Matches SQL_QUICK_START.sql Meals table schema
 */
const createAdminMeal = async (req, res) => {
  try {
    const { name, type, calories, protein, carbs, fat, prepTime, image, ingredients, steps } = req.body;

    if (!name || !type || calories === undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, type, and calories are required'
      });
    }

    // Validate type
    const validTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type must be one of: breakfast, lunch, dinner, snack'
      });
    }

    const query = `
      INSERT INTO dbo.Meals (
        Name, Calories, Type, Protein, Carbs, Fat, PrepTime, 
        Image, IngredientsJson, StepsJson, Source, Status, CreatorId
      )
      OUTPUT INSERTED.*
      VALUES (
        @name, @calories, @type, @protein, @carbs, @fat, @prepTime,
        @image, @ingredientsJson, @stepsJson, 'admin', 'public', @creatorId
      )
    `;

    const result = await executeQuery(query, {
      name,
      calories: parseInt(calories),
      type,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      prepTime: parseInt(prepTime) || 15,
      image: image || null,
      ingredientsJson: ingredients ? JSON.stringify(ingredients) : null,
      stepsJson: steps ? JSON.stringify(steps) : null,
      creatorId: req.user?.id || null
    });

    res.status(201).json({
      message: 'Meal created successfully',
      meal: result.recordset[0]
    });
  } catch (error) {
    console.error('Create admin meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create meal',
      details: error.message
    });
  }
};

/**
 * Update admin meal
 */
const updateAdminMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const { name, type, calories, protein, carbs, fat, prepTime, image, ingredients, steps, status } = req.body;

    const query = `
      UPDATE dbo.Meals
      SET Name = COALESCE(@name, Name),
          Type = COALESCE(@type, Type),
          Calories = COALESCE(@calories, Calories),
          Protein = COALESCE(@protein, Protein),
          Carbs = COALESCE(@carbs, Carbs),
          Fat = COALESCE(@fat, Fat),
          PrepTime = COALESCE(@prepTime, PrepTime),
          Image = COALESCE(@image, Image),
          IngredientsJson = COALESCE(@ingredientsJson, IngredientsJson),
          StepsJson = COALESCE(@stepsJson, StepsJson),
          Status = COALESCE(@status, Status)
      OUTPUT INSERTED.*
      WHERE Id = @mealId
    `;

    const result = await executeQuery(query, {
      mealId,
      name: name || null,
      type: type || null,
      calories: calories !== undefined ? parseInt(calories) : null,
      protein: protein !== undefined ? parseInt(protein) : null,
      carbs: carbs !== undefined ? parseInt(carbs) : null,
      fat: fat !== undefined ? parseInt(fat) : null,
      prepTime: prepTime !== undefined ? parseInt(prepTime) : null,
      image: image || null,
      ingredientsJson: ingredients ? JSON.stringify(ingredients) : null,
      stepsJson: steps ? JSON.stringify(steps) : null,
      status: status || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Meal not found'
      });
    }

    res.json({
      message: 'Meal updated successfully',
      meal: result.recordset[0]
    });
  } catch (error) {
    console.error('Update admin meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update meal'
    });
  }
};

/**
 * Delete admin meal
 */
const deleteAdminMeal = async (req, res) => {
  try {
    const { mealId } = req.params;

    const query = `
      DELETE FROM dbo.Meals
      WHERE Id = @mealId
    `;

    const result = await executeQuery(query, { mealId });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Meal not found'
      });
    }

    res.json({
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete meal'
    });
  }
};

/**
 * Create admin exercise
 * Matches SQL_QUICK_START.sql Exercises table schema
 */
const createAdminExercise = async (req, res) => {
  try {
    const { title, muscleGroup, duration, difficulty, caloriesBurned, image, description, steps } = req.body;

    if (!title || !muscleGroup) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title and muscle group are required'
      });
    }

    // Validate difficulty
    const validDifficulty = ['Beginner', 'Intermediate', 'Advanced'];
    if (difficulty && !validDifficulty.includes(difficulty)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Difficulty must be one of: Beginner, Intermediate, Advanced'
      });
    }

    const query = `
      INSERT INTO dbo.Exercises (
        Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, 
        Image, Description, StepsJson, Source, Status, CreatorId
      )
      OUTPUT INSERTED.*
      VALUES (
        @title, @muscleGroup, @duration, @difficulty, @caloriesBurned,
        @image, @description, @stepsJson, 'admin', 'public', @creatorId
      )
    `;

    const result = await executeQuery(query, {
      title,
      muscleGroup,
      duration: parseInt(duration) || 30,
      difficulty: difficulty || 'Beginner',
      caloriesBurned: parseInt(caloriesBurned) || 100,
      image: image || null,
      description: description || null,
      stepsJson: steps ? JSON.stringify(steps) : null,
      creatorId: req.user?.id || null
    });

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise: result.recordset[0]
    });
  } catch (error) {
    console.error('Create admin exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create exercise',
      details: error.message
    });
  }
};

/**
 * Update admin exercise
 */
const updateAdminExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { title, muscleGroup, duration, difficulty, caloriesBurned, image, description, steps, status } = req.body;

    const query = `
      UPDATE dbo.Exercises
      SET Title = COALESCE(@title, Title),
          MuscleGroup = COALESCE(@muscleGroup, MuscleGroup),
          Duration = COALESCE(@duration, Duration),
          Difficulty = COALESCE(@difficulty, Difficulty),
          CaloriesBurned = COALESCE(@caloriesBurned, CaloriesBurned),
          Image = COALESCE(@image, Image),
          Description = COALESCE(@description, Description),
          StepsJson = COALESCE(@stepsJson, StepsJson),
          Status = COALESCE(@status, Status)
      OUTPUT INSERTED.*
      WHERE Id = @exerciseId
    `;

    const result = await executeQuery(query, {
      exerciseId,
      title: title || null,
      muscleGroup: muscleGroup || null,
      duration: duration !== undefined ? parseInt(duration) : null,
      difficulty: difficulty || null,
      caloriesBurned: caloriesBurned !== undefined ? parseInt(caloriesBurned) : null,
      image: image || null,
      description: description || null,
      stepsJson: steps ? JSON.stringify(steps) : null,
      status: status || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Exercise not found'
      });
    }

    res.json({
      message: 'Exercise updated successfully',
      exercise: result.recordset[0]
    });
  } catch (error) {
    console.error('Update admin exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update exercise'
    });
  }
};

/**
 * Delete admin exercise
 */
const deleteAdminExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const query = `
      DELETE FROM dbo.Exercises
      WHERE Id = @exerciseId
    `;

    const result = await executeQuery(query, { exerciseId });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Exercise not found'
      });
    }

    res.json({
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete exercise'
    });
  }
};

/**
 * Get dashboard statistics
 * Uses SQL_QUICK_START.sql schema
 */
const getDashboardStats = async (req, res) => {
  try {
    const queries = {
      totalUsers: 'SELECT COUNT(*) as count FROM dbo.Users WHERE Role = @role',
      activeUsers: 'SELECT COUNT(*) as count FROM dbo.Users WHERE Role = @role AND Status = @status',
      totalMeals: 'SELECT COUNT(*) as count FROM dbo.Meals',
      totalExercises: 'SELECT COUNT(*) as count FROM dbo.Exercises',
      totalFeedback: 'SELECT COUNT(*) as count FROM dbo.Feedback',
      pendingFeedback: 'SELECT COUNT(*) as count FROM dbo.Feedback WHERE Status = @feedbackStatus'
    };

    const [usersResult, activeUsersResult, mealsResult, exercisesResult, feedbackResult, pendingFeedbackResult] = await Promise.all([
      executeQuery(queries.totalUsers, { role: 'user' }),
      executeQuery(queries.activeUsers, { role: 'user', status: 'active' }),
      executeQuery(queries.totalMeals),
      executeQuery(queries.totalExercises),
      executeQuery(queries.totalFeedback),
      executeQuery(queries.pendingFeedback, { feedbackStatus: 'new' })
    ]);

    res.json({
      statistics: {
        totalUsers: usersResult.recordset[0].count,
        activeUsers: activeUsersResult.recordset[0].count,
        totalMeals: mealsResult.recordset[0].count,
        totalExercises: exercisesResult.recordset[0].count,
        totalFeedback: feedbackResult.recordset[0].count,
        pendingFeedback: pendingFeedbackResult.recordset[0].count
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get dashboard statistics'
    });
  }
};

/**
 * Get all meals
 */
const getAllMeals = async (req, res) => {
  try {
    const query = `
      SELECT Id, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, 
             Image, IngredientsJson, StepsJson, Source, Status, CreatedAt
      FROM dbo.Meals
      ORDER BY CreatedAt DESC
    `;
    const result = await executeQuery(query);

    // Convert PascalCase to camelCase
    const meals = result.recordset.map(meal => ({
      id: meal.Id,
      name: meal.Name,
      calories: meal.Calories,
      type: meal.Type,
      protein: meal.Protein,
      carbs: meal.Carbs,
      fat: meal.Fat,
      prepTime: meal.PrepTime,
      image: meal.Image,
      ingredientsJson: meal.IngredientsJson,
      stepsJson: meal.StepsJson,
      source: meal.Source,
      status: meal.Status,
      createdAt: meal.CreatedAt
    }));

    res.json({
      meals: meals,
      total: meals.length
    });
  } catch (error) {
    console.error('Get all meals error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get meals'
    });
  }
};

/**
 * Get all exercises
 */
const getAllExercises = async (req, res) => {
  try {
    const query = `
      SELECT Id, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, 
             Image, Description, StepsJson, Source, Status, CreatedAt
      FROM dbo.Exercises
      ORDER BY CreatedAt DESC
    `;
    const result = await executeQuery(query);

    // Convert PascalCase to camelCase
    const exercises = result.recordset.map(exercise => ({
      id: exercise.Id,
      title: exercise.Title,
      muscleGroup: exercise.MuscleGroup,
      duration: exercise.Duration,
      difficulty: exercise.Difficulty,
      caloriesBurned: exercise.CaloriesBurned,
      image: exercise.Image,
      description: exercise.Description,
      stepsJson: exercise.StepsJson,
      source: exercise.Source,
      status: exercise.Status,
      createdAt: exercise.CreatedAt
    }));

    res.json({
      exercises: exercises,
      total: exercises.length
    });
  } catch (error) {
    console.error('Get all exercises error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get exercises'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllMeals,
  createAdminMeal,
  updateAdminMeal,
  deleteAdminMeal,
  getAllExercises,
  createAdminExercise,
  updateAdminExercise,
  deleteAdminExercise,
  getDashboardStats
};
