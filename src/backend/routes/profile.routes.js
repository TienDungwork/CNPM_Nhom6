const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { getUserProfile, saveUserProfile } = require('../controllers/profileController');

// All routes require authentication
router.use(verifyToken);

// GET user profile
router.get('/', getUserProfile);

// POST/PUT save profile (creates if not exists, updates if exists)
router.post('/', saveUserProfile);
router.put('/', saveUserProfile);

module.exports = router;
