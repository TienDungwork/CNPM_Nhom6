const { executeQuery, executeProcedure } = require('../config/database');

/**
 * Get all public admin meals (for users to view)
 */
const getAdminMeals = async (req, res) => {
  try {
    const query = `
      SELECT Id, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, Image, 
             IngredientsJson, StepsJson, Source, Status, CreatedAt
      FROM Meals
      WHERE Status = 'public'
      ORDER BY CreatedAt DESC
    `;
    const result = await executeQuery(query);

    // Map PascalCase to camelCase
    const meals = result.recordset.map(m => ({
      id: m.Id,
      name: m.Name,
      calories: m.Calories,
      type: m.Type,
      protein: m.Protein,
      carbs: m.Carbs,
      fat: m.Fat,
      prepTime: m.PrepTime,
      image: m.Image,
      ingredients: m.IngredientsJson ? JSON.parse(m.IngredientsJson) : [],
      steps: m.StepsJson ? JSON.parse(m.StepsJson) : [],
      source: m.Source,
      status: m.Status,
      createdAt: m.CreatedAt
    }));

    res.json({ meals });
  } catch (error) {
    console.error('Get admin meals error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get meals'
    });
  }
};

/**
 * Get user's personal meals + public admin meals
 */
const getUserMeals = async (req, res) => {
  try {
    // Get public admin meals
    const adminQuery = `
      SELECT Id, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, Image,
             IngredientsJson, StepsJson, 'admin' as Source, CreatedAt
      FROM Meals
      WHERE Status = 'public'
    `;
    
    // Get user's custom meals
    const userQuery = `
      SELECT Id, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, Image,
             IngredientsJson, StepsJson, Source, CreatedAt
      FROM UserMeals
      WHERE UserId = @userId
    `;

    const [adminResult, userResult] = await Promise.all([
      executeQuery(adminQuery),
      executeQuery(userQuery, { userId: req.user.userId })
    ]);

    // Combine and map to camelCase
    const allMeals = [...adminResult.recordset, ...userResult.recordset].map(m => ({
      id: m.Id,
      name: m.Name,
      calories: m.Calories,
      type: m.Type,
      protein: m.Protein,
      carbs: m.Carbs,
      fat: m.Fat,
      prepTime: m.PrepTime,
      image: m.Image,
      ingredients: m.IngredientsJson ? JSON.parse(m.IngredientsJson) : [],
      steps: m.StepsJson ? JSON.parse(m.StepsJson) : [],
      source: m.Source,
      createdAt: m.CreatedAt
    }));

    res.json({ meals: allMeals });
  } catch (error) {
    console.error('Get user meals error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user meals'
    });
  }
};

/**
 * Copy admin meal to user's personal collection
 */
const copyMealToUser = async (req, res) => {
  try {
    const { mealId } = req.params;

    await executeProcedure('SP_CopyMealToUser', {
      UserId: req.user.userId,
      MealId: mealId
    });

    res.json({
      message: 'Meal copied successfully',
      success: true
    });
  } catch (error) {
    console.error('Copy meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to copy meal'
    });
  }
};

/**
 * Create new user meal
 */
const createUserMeal = async (req, res) => {
  try {
    const { name, calories, type, protein, carbs, fat, prepTime, ingredientsJson, stepsJson, image } = req.body;

    if (!name || !type || calories === undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, type, and calories are required'
      });
    }

    const query = `
      INSERT INTO UserMeals (UserId, Name, Calories, Type, Protein, Carbs, Fat, PrepTime, Image, IngredientsJson, StepsJson, Source, CreatedAt)
      OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Calories, INSERTED.Type, INSERTED.Protein, INSERTED.Carbs, INSERTED.Fat
      VALUES (@userId, @name, @calories, @type, @protein, @carbs, @fat, @prepTime, @image, @ingredientsJson, @stepsJson, 'custom', GETDATE())
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      name,
      calories,
      type,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      prepTime: prepTime || 15,
      image: image || null,
      ingredientsJson: ingredientsJson || null,
      stepsJson: stepsJson || null
    });

    res.status(201).json({
      message: 'Meal created successfully',
      meal: result.recordset[0]
    });
  } catch (error) {
    console.error('Create user meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create meal'
    });
  }
};

/**
 * Update user meal
 */
const updateUserMeal = async (req, res) => {
  try {
    const { userMealId } = req.params;
    const { name, calories, type, protein, carbs, fat, prepTime, ingredientsJson, stepsJson } = req.body;

    const query = `
      UPDATE UserMeals
      SET Name = COALESCE(@name, Name),
          Calories = COALESCE(@calories, Calories),
          Type = COALESCE(@type, Type),
          Protein = COALESCE(@protein, Protein),
          Carbs = COALESCE(@carbs, Carbs),
          Fat = COALESCE(@fat, Fat),
          PrepTime = COALESCE(@prepTime, PrepTime),
          IngredientsJson = COALESCE(@ingredientsJson, IngredientsJson),
          StepsJson = COALESCE(@stepsJson, StepsJson)
      OUTPUT INSERTED.*
      WHERE Id = @userMealId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      userMealId,
      name: name || null,
      calories: calories !== undefined ? calories : null,
      type: type || null,
      protein: protein !== undefined ? protein : null,
      carbs: carbs !== undefined ? carbs : null,
      fat: fat !== undefined ? fat : null,
      prepTime: prepTime !== undefined ? prepTime : null,
      ingredientsJson: ingredientsJson || null,
      stepsJson: stepsJson || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Meal not found or access denied'
      });
    }

    res.json({
      message: 'Meal updated successfully',
      meal: result.recordset[0]
    });
  } catch (error) {
    console.error('Update user meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update meal'
    });
  }
};

/**
 * Delete user meal
 */
const deleteUserMeal = async (req, res) => {
  try {
    const { userMealId } = req.params;

    const query = `
      DELETE FROM UserMeals
      WHERE Id = @userMealId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      userMealId
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Meal not found or access denied'
      });
    }

    res.json({
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete user meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete meal'
    });
  }
};

module.exports = {
  getAdminMeals,
  getUserMeals,
  copyMealToUser,
  createUserMeal,
  updateUserMeal,
  deleteUserMeal
};
