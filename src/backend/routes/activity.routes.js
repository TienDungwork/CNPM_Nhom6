const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  getTodayActivity,
  getWeeklyActivity,
  logMeal,
  logExercise,
  logWater,
  getTodayWater,
  logSleep,
  getTodaySleep,
  getWeeklySleep
} = require('../controllers/activityController');

// All routes require authentication
router.use(verifyToken);

// GET routes
router.get('/today', getTodayActivity);
router.get('/weekly', getWeeklyActivity);
router.get('/water/today', getTodayWater);
router.get('/sleep/today', getTodaySleep);
router.get('/sleep/weekly', getWeeklySleep);

// POST routes
router.post('/log-meal', logMeal);
router.post('/log-exercise', logExercise);
router.post('/log-water', logWater);
router.post('/log-sleep', logSleep);

module.exports = router;
