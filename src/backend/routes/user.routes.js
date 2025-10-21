const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(verifyToken);

// Statistics
router.get('/statistics', userController.getUserStatistics);

// Sleep records
router.get('/sleep', userController.getSleepRecords);
router.post('/sleep', userController.createSleepRecord);
router.put('/sleep/:sleepRecordId', userController.updateSleepRecord);
router.delete('/sleep/:sleepRecordId', userController.deleteSleepRecord);

// Water logs
router.get('/water', userController.getWaterLogs);
router.post('/water', userController.createWaterLog);
router.delete('/water/:waterLogId', userController.deleteWaterLog);

// Activity logs
router.get('/activity', userController.getActivityLogs);
router.post('/activity', userController.upsertActivityLog);

module.exports = router;
