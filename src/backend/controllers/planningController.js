const { executeQuery } = require('../config/database');

// Get plans by date
exports.getPlansByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;

    const query = `
      SELECT 
        PlanID as id,
        PlannedDate as date,
        CONVERT(VARCHAR(8), PlannedTime, 108) as time,
        ActivityType as activityType,
        Title as title,
        Description as description,
        Notes as notes,
        IsCompleted as completed,
        MealID as mealId,
        ExerciseID as exerciseId,
        CreatedAt as createdAt
      FROM DailyPlans
      WHERE UserID = @userId AND PlannedDate = @date
      ORDER BY PlannedTime ASC
    `;

    const result = await executeQuery(query, [
      { name: 'userId', type: 'UniqueIdentifier', value: userId },
      { name: 'date', type: 'Date', value: date }
    ]);

    res.json({
      plans: result.recordset,
      date: date
    });
  } catch (error) {
    console.error('Get plans by date error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

// Get today's plans
exports.getTodayPlans = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    const query = `
      SELECT 
        PlanID as id,
        PlannedDate as date,
        CONVERT(VARCHAR(8), PlannedTime, 108) as time,
        ActivityType as activityType,
        Title as title,
        Description as description,
        Notes as notes,
        IsCompleted as completed,
        MealID as mealId,
        ExerciseID as exerciseId,
        CreatedAt as createdAt
      FROM DailyPlans
      WHERE UserID = @userId AND PlannedDate = @today
      ORDER BY PlannedTime ASC
    `;

    const result = await executeQuery(query, [
      { name: 'userId', type: 'UniqueIdentifier', value: userId },
      { name: 'today', type: 'Date', value: today }
    ]);

    // Get summary stats
    const plans = result.recordset;
    const totalPlans = plans.length;
    const completedPlans = plans.filter(p => p.completed).length;
    const completionPercentage = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

    res.json({
      plans: plans,
      summary: {
        total: totalPlans,
        completed: completedPlans,
        pending: totalPlans - completedPlans,
        completionPercentage: completionPercentage
      }
    });
  } catch (error) {
    console.error('Get today plans error:', error);
    res.status(500).json({ error: 'Failed to fetch today plans' });
  }
};

// Create a new plan
exports.createPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, time, activityType, title, description, notes, mealId, exerciseId } = req.body;

    console.log('📝 Creating plan:', { userId, date, time, activityType, title, mealId, exerciseId });

    if (!date || !time || !activityType || !title) {
      console.log('❌ Missing required fields:', { date, time, activityType, title });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO DailyPlans (UserID, PlannedDate, PlannedTime, ActivityType, Title, Description, Notes, MealID, ExerciseID)
      OUTPUT 
        INSERTED.PlanID as id, 
        INSERTED.PlannedDate as date, 
        CONVERT(VARCHAR(8), INSERTED.PlannedTime, 108) as time,
        INSERTED.ActivityType as activityType, 
        INSERTED.Title as title, 
        INSERTED.Description as description, 
        INSERTED.Notes as notes, 
        INSERTED.IsCompleted as completed, 
        INSERTED.MealID as mealId, 
        INSERTED.ExerciseID as exerciseId
      VALUES (@userId, @date, @time, @activityType, @title, @description, @notes, @mealId, @exerciseId)
    `;

    const result = await executeQuery(query, [
      { name: 'userId', type: 'UniqueIdentifier', value: userId },
      { name: 'date', type: 'Date', value: date },
      { name: 'time', type: 'VarChar', value: time }, // Use VarChar instead of Time
      { name: 'activityType', type: 'NVarChar', value: activityType },
      { name: 'title', type: 'NVarChar', value: title },
      { name: 'description', type: 'NVarChar', value: description || null },
      { name: 'notes', type: 'NVarChar', value: notes || null },
      { name: 'mealId', type: 'UniqueIdentifier', value: mealId || null },
      { name: 'exerciseId', type: 'UniqueIdentifier', value: exerciseId || null }
    ]);

    res.status(201).json({
      message: 'Plan created successfully',
      plan: result.recordset[0]
    });
  } catch (error) {
    console.error('Create plan error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create plan',
      details: error.message 
    });
  }
};

// Update plan status
exports.updatePlanStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planId } = req.params;
    const { completed } = req.body;

    const query = `
      UPDATE DailyPlans
      SET IsCompleted = @completed
      WHERE PlanID = @planId AND UserID = @userId
    `;

    await executeQuery(query, [
      { name: 'completed', type: 'Bit', value: completed },
      { name: 'planId', type: 'Int', value: parseInt(planId) },
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    res.json({ message: 'Plan status updated' });
  } catch (error) {
    console.error('Update plan status error:', error);
    res.status(500).json({ error: 'Failed to update plan status' });
  }
};

// Execute a plan (mark complete and log activity)
exports.executePlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planId } = req.params;

    // Get plan details
    const getPlanQuery = `
      SELECT ActivityType, Title, MealID, ExerciseID, Description
      FROM DailyPlans
      WHERE PlanID = @planId AND UserID = @userId
    `;

    const planResult = await executeQuery(getPlanQuery, [
      { name: 'planId', type: 'Int', value: parseInt(planId) },
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    if (planResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.recordset[0];

    // Mark plan as completed
    const updateQuery = `
      UPDATE DailyPlans
      SET IsCompleted = 1
      WHERE PlanID = @planId AND UserID = @userId
    `;

    await executeQuery(updateQuery, [
      { name: 'planId', type: 'Int', value: parseInt(planId) },
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    // Log the activity based on type
    let logQuery = '';
    let logParams = [];

    switch (plan.ActivityType) {
      case 'meal':
        if (plan.MealID) {
          // Get meal details
          const mealQuery = `SELECT Name, Calories, Type FROM UserMeals WHERE MealID = @mealId`;
          const mealResult = await executeQuery(mealQuery, [
            { name: 'mealId', type: 'UniqueIdentifier', value: plan.MealID }
          ]);
          
          if (mealResult.recordset.length > 0) {
            const meal = mealResult.recordset[0];
            logQuery = `
              INSERT INTO UserMeals (UserID, MealID, MealName, Calories, Type, LoggedAt)
              VALUES (@userId, @mealId, @mealName, @calories, @type, GETDATE())
            `;
            logParams = [
              { name: 'userId', type: 'UniqueIdentifier', value: userId },
              { name: 'mealId', type: 'UniqueIdentifier', value: plan.MealID },
              { name: 'mealName', type: 'NVarChar', value: meal.Name },
              { name: 'calories', type: 'Int', value: meal.Calories },
              { name: 'type', type: 'NVarChar', value: meal.Type }
            ];
          }
        }
        break;

      case 'exercise':
        if (plan.ExerciseID) {
          // Get exercise details
          const exerciseQuery = `
            SELECT Title, Duration, CaloriesBurned FROM UserExercises WHERE ExerciseID = @exerciseId
          `;
          const exerciseResult = await executeQuery(exerciseQuery, [
            { name: 'exerciseId', type: 'UniqueIdentifier', value: plan.ExerciseID }
          ]);
          
          if (exerciseResult.recordset.length > 0) {
            const exercise = exerciseResult.recordset[0];
            logQuery = `
              INSERT INTO UserExercises (UserID, ExerciseID, Title, Duration, CaloriesBurned, CompletedAt)
              VALUES (@userId, @exerciseId, @title, @duration, @calories, GETDATE())
            `;
            logParams = [
              { name: 'userId', type: 'UniqueIdentifier', value: userId },
              { name: 'exerciseId', type: 'UniqueIdentifier', value: plan.ExerciseID },
              { name: 'title', type: 'NVarChar', value: exercise.Title },
              { name: 'duration', type: 'Int', value: exercise.Duration },
              { name: 'calories', type: 'Int', value: exercise.CaloriesBurned }
            ];
          }
        }
        break;

      case 'water':
        logQuery = `
          INSERT INTO WaterLogs (UserID, AmountML, LoggedAt)
          VALUES (@userId, 250, GETDATE())
        `;
        logParams = [
          { name: 'userId', type: 'UniqueIdentifier', value: userId }
        ];
        break;
    }

    // Execute log query if applicable
    if (logQuery) {
      await executeQuery(logQuery, logParams);
    }

    res.json({
      message: 'Plan executed successfully',
      activityLogged: !!logQuery
    });
  } catch (error) {
    console.error('Execute plan error:', error);
    res.status(500).json({ error: 'Failed to execute plan' });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planId } = req.params;
    const { time, title, description, notes } = req.body;

    const query = `
      UPDATE DailyPlans
      SET PlannedTime = @time,
          Title = @title,
          Description = @description,
          Notes = @notes
      WHERE PlanID = @planId AND UserID = @userId
    `;

    await executeQuery(query, [
      { name: 'time', type: 'Time', value: time },
      { name: 'title', type: 'NVarChar', value: title },
      { name: 'description', type: 'NVarChar', value: description || null },
      { name: 'notes', type: 'NVarChar', value: notes || null },
      { name: 'planId', type: 'Int', value: parseInt(planId) },
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    res.json({ message: 'Plan updated successfully' });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
};

// Delete plan
exports.deletePlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planId } = req.params;

    const query = `
      DELETE FROM DailyPlans
      WHERE PlanID = @planId AND UserID = @userId
    `;

    await executeQuery(query, [
      { name: 'planId', type: 'Int', value: parseInt(planId) },
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};

// Get weekly summary
exports.getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT 
        CONVERT(date, PlannedDate) as date,
        COUNT(*) as totalPlans,
        SUM(CASE WHEN IsCompleted = 1 THEN 1 ELSE 0 END) as completedPlans,
        ActivityType as activityType
      FROM DailyPlans
      WHERE UserID = @userId 
        AND PlannedDate >= DATEADD(day, -7, GETDATE())
        AND PlannedDate <= GETDATE()
      GROUP BY CONVERT(date, PlannedDate), ActivityType
      ORDER BY date DESC
    `;

    const result = await executeQuery(query, [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]);

    res.json({
      weeklySummary: result.recordset
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
};
