const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const planningController = require('../controllers/planningController');

// All routes require authentication
router.use(verifyToken);

// Get all plans for a specific date
router.get('/date/:date', planningController.getPlansByDate);

// Get today's plans
router.get('/today', planningController.getTodayPlans);

// Create a new plan
router.post('/', planningController.createPlan);

// Update plan status (complete/incomplete)
router.patch('/:planId/status', planningController.updatePlanStatus);

// Execute a plan (mark as completed and log the activity)
router.post('/:planId/execute', planningController.executePlan);

// Update plan details
router.put('/:planId', planningController.updatePlan);

// Delete a plan
router.delete('/:planId', planningController.deletePlan);

// Get weekly summary
router.get('/weekly-summary', planningController.getWeeklySummary);

module.exports = router;
