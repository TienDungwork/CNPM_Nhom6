const { executeQuery, executeProcedure } = require('../config/database');

/**
 * Get all public admin exercises (for users to view)
 */
const getAdminExercises = async (req, res) => {
  try {
    const query = `
      SELECT Id, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, 
             Image, Description, StepsJson, Source, Status, CreatedAt
      FROM Exercises
      WHERE Status = 'public'
      ORDER BY CreatedAt DESC
    `;
    const result = await executeQuery(query);

    // Map PascalCase to camelCase
    const exercises = result.recordset.map(e => ({
      id: e.Id,
      title: e.Title,
      muscleGroup: e.MuscleGroup,
      duration: e.Duration,
      difficulty: e.Difficulty,
      caloriesBurned: e.CaloriesBurned,
      image: e.Image,
      description: e.Description,
      steps: e.StepsJson ? JSON.parse(e.StepsJson) : [],
      source: e.Source,
      status: e.Status,
      createdAt: e.CreatedAt
    }));

    res.json({ exercises });
  } catch (error) {
    console.error('Get admin exercises error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get exercises'
    });
  }
};

/**
 * Get user's personal exercises + public admin exercises
 */
const getUserExercises = async (req, res) => {
  try {
    // Get public admin exercises
    const adminQuery = `
      SELECT Id, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned,
             Image, Description, StepsJson, 'admin' as Source, CreatedAt
      FROM Exercises
      WHERE Status = 'public'
    `;
    
    // Get user's custom exercises
    const userQuery = `
      SELECT Id, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned,
             Image, Description, StepsJson, Source, CreatedAt
      FROM UserExercises
      WHERE UserId = @userId
    `;

    const [adminResult, userResult] = await Promise.all([
      executeQuery(adminQuery),
      executeQuery(userQuery, { userId: req.user.userId })
    ]);

    // Combine and map to camelCase
    const allExercises = [...adminResult.recordset, ...userResult.recordset].map(e => ({
      id: e.Id,
      title: e.Title,
      muscleGroup: e.MuscleGroup,
      duration: e.Duration,
      difficulty: e.Difficulty,
      caloriesBurned: e.CaloriesBurned,
      image: e.Image,
      description: e.Description,
      steps: e.StepsJson ? JSON.parse(e.StepsJson) : [],
      source: e.Source,
      createdAt: e.CreatedAt
    }));

    res.json({ exercises: allExercises });
  } catch (error) {
    console.error('Get user exercises error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user exercises'
    });
  }
};

/**
 * Copy admin exercise to user's personal collection
 */
const copyExerciseToUser = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    await executeProcedure('SP_CopyExerciseToUser', {
      UserId: req.user.userId,
      ExerciseId: exerciseId
    });

    res.json({
      message: 'Exercise copied successfully',
      success: true
    });
  } catch (error) {
    console.error('Copy exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to copy exercise'
    });
  }
};

/**
 * Create new user exercise
 */
const createUserExercise = async (req, res) => {
  try {
    const { title, muscleGroup, duration, difficulty, caloriesBurned, description, stepsJson, image } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title and duration are required'
      });
    }

    const query = `
      INSERT INTO UserExercises (UserId, Title, MuscleGroup, Duration, Difficulty, CaloriesBurned, Description, Image, StepsJson, Source, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@userId, @title, @muscleGroup, @duration, @difficulty, @caloriesBurned, @description, @image, @stepsJson, 'custom', GETDATE())
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      title,
      muscleGroup: muscleGroup || 'General',
      duration,
      difficulty: difficulty || 'Beginner',
      caloriesBurned: caloriesBurned || 100,
      description: description || null,
      image: image || null,
      stepsJson: stepsJson || null
    });

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise: result.recordset[0]
    });
  } catch (error) {
    console.error('Create user exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create exercise'
    });
  }
};

/**
 * Update user exercise
 */
const updateUserExercise = async (req, res) => {
  try {
    const { userExerciseId } = req.params;
    const { title, muscleGroup, duration, difficulty, caloriesBurned, description, stepsJson } = req.body;

    const query = `
      UPDATE UserExercises
      SET Title = COALESCE(@title, Title),
          MuscleGroup = COALESCE(@muscleGroup, MuscleGroup),
          Duration = COALESCE(@duration, Duration),
          Difficulty = COALESCE(@difficulty, Difficulty),
          CaloriesBurned = COALESCE(@caloriesBurned, CaloriesBurned),
          Description = COALESCE(@description, Description),
          StepsJson = COALESCE(@stepsJson, StepsJson)
      OUTPUT INSERTED.*
      WHERE Id = @userExerciseId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      userExerciseId,
      title: title || null,
      muscleGroup: muscleGroup || null,
      duration: duration !== undefined ? duration : null,
      difficulty: difficulty || null,
      caloriesBurned: caloriesBurned !== undefined ? caloriesBurned : null,
      description: description || null,
      stepsJson: stepsJson || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Exercise not found or access denied'
      });
    }

    res.json({
      message: 'Exercise updated successfully',
      exercise: result.recordset[0]
    });
  } catch (error) {
    console.error('Update user exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update exercise'
    });
  }
};

/**
 * Delete user exercise
 */
const deleteUserExercise = async (req, res) => {
  try {
    const { userExerciseId } = req.params;

    const query = `
      DELETE FROM UserExercises
      WHERE Id = @userExerciseId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      userExerciseId
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Exercise not found or access denied'
      });
    }

    res.json({
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    console.error('Delete user exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete exercise'
    });
  }
};

module.exports = {
  getAdminExercises,
  getUserExercises,
  copyExerciseToUser,
  createUserExercise,
  updateUserExercise,
  deleteUserExercise
};
