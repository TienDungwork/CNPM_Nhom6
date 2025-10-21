const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');
const { verifyToken } = require('../middleware/auth.middleware');

// All exercise routes require authentication
router.use(verifyToken);

// Get admin exercises
router.get('/admin', exercisesController.getAdminExercises);

// Get user exercises
router.get('/user', exercisesController.getUserExercises);

// Copy admin exercise to user
router.post('/copy/:exerciseId', exercisesController.copyExerciseToUser);

// Create user exercise
router.post('/', exercisesController.createUserExercise);

// Update user exercise
router.put('/:userExerciseId', exercisesController.updateUserExercise);

// Delete user exercise
router.delete('/:userExerciseId', exercisesController.deleteUserExercise);

module.exports = router;
