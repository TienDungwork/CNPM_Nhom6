const { executeQuery } = require('../config/database');

/**
 * Get today's activity summary for dashboard
 */
const getTodayActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get activity logs
    const activityQuery = `
      SELECT 
        Id, Date, MealsJson, ExercisesJson, SleepJson, WaterJson
      FROM ActivityLogs
      WHERE UserId = @userId AND Date = @today
    `;

    const activityResult = await executeQuery(activityQuery, {
      userId: userId,
      today: today
    });

    // Get sleep data from SleepLogs table
    const sleepQuery = `
      SELECT TOP 1 Duration, Quality, Notes
      FROM SleepLogs
      WHERE UserID = @userId AND SleepDate = @today
      ORDER BY CreatedAt DESC
    `;

    const sleepResult = await executeQuery(sleepQuery, {
      userId: userId,
      today: today
    });

    let sleepData = null;
    if (sleepResult.recordset.length > 0) {
      const sleep = sleepResult.recordset[0];
      sleepData = {
        duration: sleep.Duration,
        quality: sleep.Quality,
        notes: sleep.Notes
      };
    }

    if (activityResult.recordset.length === 0) {
      // No activity for today, return empty data with sleep if available
      return res.json({
        date: today,
        meals: [],
        exercises: [],
        sleep: sleepData,
        water: []
      });
    }

    const activity = activityResult.recordset[0];
    
    res.json({
      id: activity.Id,
      date: activity.Date,
      meals: activity.MealsJson ? JSON.parse(activity.MealsJson) : [],
      exercises: activity.ExercisesJson ? JSON.parse(activity.ExercisesJson) : [],
      sleep: sleepData, // Use sleep data from SleepLogs table
      water: activity.WaterJson ? JSON.parse(activity.WaterJson) : []
    });
  } catch (error) {
    console.error('Get today activity error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch today activity'
    });
  }
};

/**
 * Get weekly activity data for charts
 */
const getWeeklyActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const query = `
      SELECT 
        Date, MealsJson, ExercisesJson, WaterJson
      FROM ActivityLogs
      WHERE UserId = @userId 
        AND Date >= @startDate 
        AND Date <= @endDate
      ORDER BY Date ASC
    `;

    const result = await executeQuery(query, {
      userId: userId,
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });

    const weeklyData = result.recordset.map(row => {
      const meals = row.MealsJson ? JSON.parse(row.MealsJson) : [];
      const water = row.WaterJson ? JSON.parse(row.WaterJson) : [];
      
      // Calculate total calories from meals
      const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      
      // Calculate total water cups (assuming 250ml per cup)
      const totalWaterCups = water.reduce((sum, w) => sum + (w.amountMl || 0), 0) / 250;

      return {
        date: row.Date,
        calories: totalCalories,
        water: Math.round(totalWaterCups)
      };
    });

    res.json({ weeklyData });
  } catch (error) {
    console.error('Get weekly activity error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch weekly activity'
    });
  }
};

/**
 * Log a meal (add to today's activity)
 */
const logMeal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    const { mealId, name, calories, type } = req.body;

    // Get or create today's activity log
    let getQuery = `
      SELECT Id, MealsJson 
      FROM ActivityLogs 
      WHERE UserId = @userId AND Date = @today
    `;

    let result = await executeQuery(getQuery, {
      userId: userId,
      today: today
    });

    const newMeal = {
      mealId,
      name,
      calories: parseInt(calories),
      type,
      loggedAt: new Date().toISOString()
    };

    if (result.recordset.length === 0) {
      // Create new activity log
      const createQuery = `
        INSERT INTO ActivityLogs (UserId, Date, MealsJson)
        VALUES (@userId, @today, @mealsJson)
      `;

      await executeQuery(createQuery, {
        userId: userId,
        today: today,
        mealsJson: JSON.stringify([newMeal])
      });
    } else {
      // Update existing activity log
      const existingMeals = result.recordset[0].MealsJson 
        ? JSON.parse(result.recordset[0].MealsJson) 
        : [];
      
      existingMeals.push(newMeal);

      const updateQuery = `
        UPDATE ActivityLogs 
        SET MealsJson = @mealsJson
        WHERE UserId = @userId AND Date = @today
      `;

      await executeQuery(updateQuery, {
        userId: userId,
        today: today,
        mealsJson: JSON.stringify(existingMeals)
      });
    }

    // Auto-complete related plan if exists
    if (mealId) {
      try {
        const updatePlanQuery = `
          UPDATE DailyPlans
          SET IsCompleted = 1, UpdatedAt = GETDATE()
          WHERE UserID = @userId 
            AND PlannedDate = @today 
            AND ActivityType = 'meal'
            AND MealID = @mealId
            AND IsCompleted = 0
        `;
        await executeQuery(updatePlanQuery, { userId, today, mealId });
      } catch (err) {
        console.warn('Failed to auto-complete plan:', err.message);
      }
    }

    res.json({
      message: 'Meal logged successfully',
      meal: newMeal
    });
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to log meal'
    });
  }
};

/**
 * Log an exercise (add to today's activity)
 */
const logExercise = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    const { exerciseId, title, duration, caloriesBurned } = req.body;

    // Get or create today's activity log
    let getQuery = `
      SELECT Id, ExercisesJson 
      FROM ActivityLogs 
      WHERE UserId = @userId AND Date = @today
    `;

    let result = await executeQuery(getQuery, {
      userId: userId,
      today: today
    });

    const newExercise = {
      exerciseId,
      title,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned),
      completedAt: new Date().toISOString()
    };

    if (result.recordset.length === 0) {
      // Create new activity log
      const createQuery = `
        INSERT INTO ActivityLogs (UserId, Date, ExercisesJson)
        VALUES (@userId, @today, @exercisesJson)
      `;

      await executeQuery(createQuery, {
        userId: userId,
        today: today,
        exercisesJson: JSON.stringify([newExercise])
      });
    } else {
      // Update existing activity log
      const existingExercises = result.recordset[0].ExercisesJson 
        ? JSON.parse(result.recordset[0].ExercisesJson) 
        : [];
      
      existingExercises.push(newExercise);

      const updateQuery = `
        UPDATE ActivityLogs 
        SET ExercisesJson = @exercisesJson
        WHERE UserId = @userId AND Date = @today
      `;

      await executeQuery(updateQuery, {
        userId: userId,
        today: today,
        exercisesJson: JSON.stringify(existingExercises)
      });
    }

    // Auto-complete related plan if exists
    if (exerciseId) {
      try {
        const updatePlanQuery = `
          UPDATE DailyPlans
          SET IsCompleted = 1, UpdatedAt = GETDATE()
          WHERE UserID = @userId 
            AND PlannedDate = @today 
            AND ActivityType = 'exercise'
            AND ExerciseID = @exerciseId
            AND IsCompleted = 0
        `;
        await executeQuery(updatePlanQuery, { userId, today, exerciseId });
      } catch (err) {
        console.warn('Failed to auto-complete plan:', err.message);
      }
    }

    res.json({
      message: 'Exercise logged successfully',
      exercise: newExercise
    });
  } catch (error) {
    console.error('Log exercise error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to log exercise'
    });
  }
};

/**
 * Log water intake
 */
const logWater = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amountMl } = req.body;

    const query = `
      INSERT INTO WaterLogs (UserId, IntakeTime, AmountMl)
      VALUES (@userId, @intakeTime, @amountMl)
    `;

    await executeQuery(query, {
      userId: userId,
      intakeTime: new Date(),
      amountMl: parseInt(amountMl)
    });

    res.json({
      message: 'Water intake logged successfully'
    });
  } catch (error) {
    console.error('Log water error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to log water intake'
    });
  }
};

/**
 * Get today's water intake total
 */
const getTodayWater = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = `
      SELECT SUM(AmountMl) as TotalMl
      FROM WaterLogs
      WHERE UserId = @userId 
        AND IntakeTime >= @startOfDay
    `;

    const result = await executeQuery(query, {
      userId: userId,
      startOfDay: today
    });

    const totalMl = result.recordset[0]?.TotalMl || 0;
    const totalCups = Math.round(totalMl / 250); // 250ml per cup

    res.json({
      totalMl,
      totalCups
    });
  } catch (error) {
    console.error('Get today water error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch water intake'
    });
  }
};

/**
 * Log sleep entry
 */
const logSleep = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sleepDate, duration, quality, notes } = req.body;

    if (!sleepDate || !duration) {
      return res.status(400).json({ error: 'Sleep date and duration are required' });
    }

    const query = `
      INSERT INTO SleepLogs (UserID, SleepDate, Duration, Quality, Notes)
      OUTPUT INSERTED.SleepID as sleepId, INSERTED.SleepDate as sleepDate, 
             INSERTED.Duration as duration, INSERTED.Quality as quality, 
             INSERTED.Notes as notes
      VALUES (@userId, @sleepDate, @duration, @quality, @notes)
    `;

    const result = await executeQuery(query, {
      userId,
      sleepDate,
      duration,
      quality: quality || null,
      notes: notes || null
    });

    res.status(201).json({
      message: 'Sleep logged successfully',
      ...result.recordset[0]
    });
  } catch (error) {
    console.error('Log sleep error:', error);
    res.status(500).json({ error: 'Failed to log sleep' });
  }
};

/**
 * Get today's sleep logs
 */
const getTodaySleep = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    const query = `
      SELECT SleepID as sleepId, SleepDate as sleepDate, Duration as duration, 
             Quality as quality, Notes as notes, CreatedAt as createdAt
      FROM SleepLogs
      WHERE UserID = @userId AND SleepDate = @today
      ORDER BY CreatedAt DESC
    `;

    const result = await executeQuery(query, { userId, today });

    // Return array directly for easier frontend consumption
    res.json(result.recordset);
  } catch (error) {
    console.error('Get today sleep error:', error);
    res.status(500).json({ error: 'Failed to fetch sleep data' });
  }
};

/**
 * Get weekly sleep summary
 */
const getWeeklySleep = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        SleepDate as sleepDate,
        SUM(Duration) as totalDuration,
        AVG(Duration) as avgDuration,
        COUNT(*) as entryCount
      FROM SleepLogs
      WHERE UserID = @userId 
        AND SleepDate >= DATEADD(day, -7, CAST(GETDATE() AS DATE))
      GROUP BY SleepDate
      ORDER BY SleepDate DESC
    `;

    const result = await executeQuery(query, { userId });

    const totalSleep = result.recordset.reduce((sum, day) => sum + day.totalDuration, 0);
    const avgDuration = result.recordset.length > 0 
      ? totalSleep / result.recordset.length 
      : 0;

    res.json({
      sleepLogs: result.recordset,
      summary: {
        totalSleep,
        avgDuration,
        daysWithData: result.recordset.length
      }
    });
  } catch (error) {
    console.error('Get weekly sleep error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly sleep data' });
  }
};

module.exports = {
  getTodayActivity,
  getWeeklyActivity,
  logMeal,
  logExercise,
  logWater,
  getTodayWater,
  logSleep,
  getTodaySleep,
  getWeeklySleep
};
