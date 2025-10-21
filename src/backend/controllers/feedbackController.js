const { executeQuery } = require('../config/database');

/**
 * Submit feedback (user)
 */
const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Message is required'
      });
    }

    const query = `
      INSERT INTO Feedback (UserId, Message, Status, CreatedAt)
      OUTPUT INSERTED.*
      VALUES (@userId, @message, 'new', SYSUTCDATETIME())
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      message
    });

    const inserted = result.recordset[0];
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: inserted.Id,
        userId: inserted.UserId,
        message: inserted.Message,
        status: inserted.Status,
        createdAt: inserted.CreatedAt
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit feedback'
    });
  }
};

/**
 * Get user's own feedback
 */
const getUserFeedback = async (req, res) => {
  try {
    const query = `
      SELECT Id, UserId, Message, Status, CreatedAt
      FROM Feedback
      WHERE UserId = @userId
      ORDER BY CreatedAt DESC
    `;

    const result = await executeQuery(query, { userId: req.user.userId });

    const feedback = result.recordset.map(f => ({
      id: f.Id,
      userId: f.UserId,
      message: f.Message,
      status: f.Status,
      createdAt: f.CreatedAt
    }));

    res.json({
      feedback: feedback
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get feedback'
    });
  }
};

/**
 * Get all feedback (admin)
 */
const getAllFeedback = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT f.Id, f.UserId, f.Message, f.Status, f.CreatedAt,
             u.Name as Username, u.Email
      FROM Feedback f
      INNER JOIN Users u ON f.UserId = u.Id
    `;

    const params = {};

    if (status) {
      query += ' WHERE f.Status = @status';
      params.status = status;
    }

    query += ' ORDER BY f.CreatedAt DESC';

    const result = await executeQuery(query, params);

    // Map to camelCase
    const feedback = result.recordset.map(f => ({
      id: f.Id,
      userId: f.UserId,
      username: f.Username,
      email: f.Email,
      message: f.Message,
      status: f.Status,
      createdAt: f.CreatedAt
    }));

    res.json({
      feedback: feedback,
      total: feedback.length
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get feedback'
    });
  }
};

/**
 * Update feedback status/response (admin)
 */
const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE Feedback
      SET Status = COALESCE(@status, Status)
      OUTPUT INSERTED.*
      WHERE Id = @feedbackId
    `;

    const result = await executeQuery(query, {
      feedbackId,
      status: status || null
    });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Feedback not found'
      });
    }

    const updated = result.recordset[0];
    res.json({
      message: 'Feedback updated successfully',
      feedback: {
        id: updated.Id,
        userId: updated.UserId,
        message: updated.Message,
        status: updated.Status,
        createdAt: updated.CreatedAt
      }
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update feedback'
    });
  }
};

/**
 * Delete feedback (admin)
 */
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const query = `
      DELETE FROM Feedback
      WHERE Id = @feedbackId
    `;

    const result = await executeQuery(query, { feedbackId });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Feedback not found'
      });
    }

    res.json({
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete feedback'
    });
  }
};

module.exports = {
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback
};
