const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// User routes
router.post('/', verifyToken, feedbackController.submitFeedback);
router.get('/my-feedback', verifyToken, feedbackController.getUserFeedback);

// Admin routes
router.get('/all', requireAdmin, feedbackController.getAllFeedback);
router.put('/:feedbackId', requireAdmin, feedbackController.updateFeedback);
router.delete('/:feedbackId', requireAdmin, feedbackController.deleteFeedback);

module.exports = router;
