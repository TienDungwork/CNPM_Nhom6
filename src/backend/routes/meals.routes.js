const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');
const { verifyToken } = require('../middleware/auth.middleware');

// All meal routes require authentication
router.use(verifyToken);

// Get admin meals
router.get('/admin', mealsController.getAdminMeals);

// Get user meals
router.get('/user', mealsController.getUserMeals);

// Copy admin meal to user
router.post('/copy/:mealId', mealsController.copyMealToUser);

// Create user meal
router.post('/', mealsController.createUserMeal);

// Update user meal
router.put('/:userMealId', mealsController.updateUserMeal);

// Delete user meal
router.delete('/:userMealId', mealsController.deleteUserMeal);

module.exports = router;
