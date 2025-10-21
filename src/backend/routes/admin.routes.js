const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/admin.middleware');

// All admin routes require admin authentication
router.use(requireAdmin);

// Dashboard statistics
router.get('/statistics', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);

// Meal management
router.get('/meals', adminController.getAllMeals);
router.post('/meals', adminController.createAdminMeal);
router.put('/meals/:mealId', adminController.updateAdminMeal);
router.delete('/meals/:mealId', adminController.deleteAdminMeal);

// Exercise management
router.get('/exercises', adminController.getAllExercises);
router.post('/exercises', adminController.createAdminExercise);
router.put('/exercises/:exerciseId', adminController.updateAdminExercise);
router.delete('/exercises/:exerciseId', adminController.deleteAdminExercise);

module.exports = router;
