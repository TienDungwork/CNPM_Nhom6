const { executeQuery, executeProcedure } = require('../config/database');

/**
 * Get user statistics
 */
const getUserStatistics = async (req, res) => {
  try {
    const result = await executeProcedure('SP_GetUserStatistics', {
      UserId: req.user.userId
    });

    res.json({
      statistics: result.recordset[0] || {
        TotalMeals: 0,
        TotalExercises: 0,
        TotalSleepRecords: 0,
        TotalWaterLogs: 0,
        TotalActivityDays: 0
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get statistics'
    });
  }
};

/**
 * Get sleep records
 */
const getSleepRecords = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT SleepRecordId, UserId, SleepDate, SleepStartTime, SleepEndTime, Duration, Quality, Notes, CreatedAt
      FROM SleepRecords
      WHERE UserId = @userId
    `;

    const params = { userId: req.user.userId };

    if (startDate) {
      query += ' AND SleepDate >= @startDate';
      params.startDate = startDate;
    }

    if (endDate) {
      query += ' AND SleepDate <= @endDate';
      params.endDate = endDate;
    }

    query += ' ORDER BY SleepDate DESC';

    const result = await executeQuery(query, params);

    res.json({
      sleepRecords: result.recordset
    });
  } catch (error) {
    console.error('Get sleep records error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get sleep records'
    });
  }
};

/**
 * Create sleep record
 */
const createSleepRecord = async (req, res) => {
  try {
    const { sleepDate, sleepStartTime, sleepEndTime, duration, quality, notes } = req.body;

    if (!sleepDate || !sleepStartTime || !sleepEndTime) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Sleep date, start time, and end time are required'
      });
    }

    const query = `
      INSERT INTO SleepRecords (UserId, SleepDate, SleepStartTime, SleepEndTime, Duration, Quality, Notes, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@userId, @sleepDate, @sleepStartTime, @sleepEndTime, @duration, @quality, @notes, GETDATE())
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      sleepDate,
      sleepStartTime,
      sleepEndTime,
      duration: duration || null,
      quality: quality || null,
      notes: notes || null
    });

    res.status(201).json({
      message: 'Sleep record created successfully',
      sleepRecord: result.recordset[0]
    });
  } catch (error) {
    console.error('Create sleep record error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create sleep record'
    });
  }
};

/**
 * Update sleep record
 */
const updateSleepRecord = async (req, res) => {
  try {
    const { sleepRecordId } = req.params;
    const { sleepDate, sleepStartTime, sleepEndTime, duration, quality, notes } = req.body;

    const query = `
      UPDATE SleepRecords
      SET SleepDate = COALESCE(@sleepDate, SleepDate),
          SleepStartTime = COALESCE(@sleepStartTime, SleepStartTime),
          SleepEndTime = COALESCE(@sleepEndTime, SleepEndTime),
          Duration = COALESCE(@duration, Duration),
          Quality = COALESCE(@quality, Quality),
          Notes = COALESCE(@notes, Notes)
      OUTPUT INSERTED.*
      WHERE SleepRecordId = @sleepRecordId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      sleepRecordId,
      sleepDate: sleepDate || null,
      sleepStartTime: sleepStartTime || null,
      sleepEndTime: sleepEndTime || null,
      duration: duration !== undefined ? duration : null,
      quality: quality || null,
      notes: notes || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sleep record not found or access denied'
      });
    }

    res.json({
      message: 'Sleep record updated successfully',
      sleepRecord: result.recordset[0]
    });
  } catch (error) {
    console.error('Update sleep record error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update sleep record'
    });
  }
};

/**
 * Delete sleep record
 */
const deleteSleepRecord = async (req, res) => {
  try {
    const { sleepRecordId } = req.params;

    const query = `
      DELETE FROM SleepRecords
      WHERE SleepRecordId = @sleepRecordId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      sleepRecordId
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sleep record not found or access denied'
      });
    }

    res.json({
      message: 'Sleep record deleted successfully'
    });
  } catch (error) {
    console.error('Delete sleep record error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete sleep record'
    });
  }
};

/**
 * Get water logs
 */
const getWaterLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT WaterLogId, UserId, LogDate, AmountMl, Notes, CreatedAt
      FROM WaterLogs
      WHERE UserId = @userId
    `;

    const params = { userId: req.user.userId };

    if (startDate) {
      query += ' AND LogDate >= @startDate';
      params.startDate = startDate;
    }

    if (endDate) {
      query += ' AND LogDate <= @endDate';
      params.endDate = endDate;
    }

    query += ' ORDER BY LogDate DESC, CreatedAt DESC';

    const result = await executeQuery(query, params);

    res.json({
      waterLogs: result.recordset
    });
  } catch (error) {
    console.error('Get water logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get water logs'
    });
  }
};

/**
 * Create water log
 */
const createWaterLog = async (req, res) => {
  try {
    const { logDate, amountMl, notes } = req.body;

    if (!logDate || !amountMl) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Log date and amount are required'
      });
    }

    const query = `
      INSERT INTO WaterLogs (UserId, LogDate, AmountMl, Notes, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@userId, @logDate, @amountMl, @notes, GETDATE())
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      logDate,
      amountMl,
      notes: notes || null
    });

    res.status(201).json({
      message: 'Water log created successfully',
      waterLog: result.recordset[0]
    });
  } catch (error) {
    console.error('Create water log error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create water log'
    });
  }
};

/**
 * Delete water log
 */
const deleteWaterLog = async (req, res) => {
  try {
    const { waterLogId } = req.params;

    const query = `
      DELETE FROM WaterLogs
      WHERE WaterLogId = @waterLogId AND UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      waterLogId
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Water log not found or access denied'
      });
    }

    res.json({
      message: 'Water log deleted successfully'
    });
  } catch (error) {
    console.error('Delete water log error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete water log'
    });
  }
};

/**
 * Get activity logs
 */
const getActivityLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT ActivityLogId, UserId, LogDate, TotalCalories, TotalExerciseMinutes, TotalWaterMl, SleepHours, Notes, CreatedAt
      FROM ActivityLogs
      WHERE UserId = @userId
    `;

    const params = { userId: req.user.userId };

    if (startDate) {
      query += ' AND LogDate >= @startDate';
      params.startDate = startDate;
    }

    if (endDate) {
      query += ' AND LogDate <= @endDate';
      params.endDate = endDate;
    }

    query += ' ORDER BY LogDate DESC';

    const result = await executeQuery(query, params);

    res.json({
      activityLogs: result.recordset
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get activity logs'
    });
  }
};

/**
 * Create or update activity log
 */
const upsertActivityLog = async (req, res) => {
  try {
    const { logDate, totalCalories, totalExerciseMinutes, totalWaterMl, sleepHours, notes } = req.body;

    if (!logDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Log date is required'
      });
    }

    // Check if activity log exists for this date
    const checkQuery = `
      SELECT ActivityLogId FROM ActivityLogs
      WHERE UserId = @userId AND LogDate = @logDate
    `;
    const existing = await executeQuery(checkQuery, { userId: req.user.userId, logDate });

    let query;
    if (existing.recordset.length > 0) {
      // Update existing
      query = `
        UPDATE ActivityLogs
        SET TotalCalories = COALESCE(@totalCalories, TotalCalories),
            TotalExerciseMinutes = COALESCE(@totalExerciseMinutes, TotalExerciseMinutes),
            TotalWaterMl = COALESCE(@totalWaterMl, TotalWaterMl),
            SleepHours = COALESCE(@sleepHours, SleepHours),
            Notes = COALESCE(@notes, Notes)
        OUTPUT INSERTED.*
        WHERE UserId = @userId AND LogDate = @logDate
      `;
    } else {
      // Create new
      query = `
        INSERT INTO ActivityLogs (UserId, LogDate, TotalCalories, TotalExerciseMinutes, TotalWaterMl, SleepHours, Notes, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@userId, @logDate, @totalCalories, @totalExerciseMinutes, @totalWaterMl, @sleepHours, @notes, GETDATE())
      `;
    }

    const result = await executeQuery(query, {
      userId: req.user.userId,
      logDate,
      totalCalories: totalCalories || 0,
      totalExerciseMinutes: totalExerciseMinutes || 0,
      totalWaterMl: totalWaterMl || 0,
      sleepHours: sleepHours || 0,
      notes: notes || null
    });

    res.json({
      message: existing.recordset.length > 0 ? 'Activity log updated successfully' : 'Activity log created successfully',
      activityLog: result.recordset[0]
    });
  } catch (error) {
    console.error('Upsert activity log error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save activity log'
    });
  }
};

module.exports = {
  getUserStatistics,
  getSleepRecords,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord,
  getWaterLogs,
  createWaterLog,
  deleteWaterLog,
  getActivityLogs,
  upsertActivityLog
};
