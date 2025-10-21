const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.Id,
      name: user.Name,
      email: user.Email,
      role: user.Role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * User Registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const checkQuery = `
      SELECT Id FROM Users 
      WHERE Email = @email
    `;
    const existingUser = await executeQuery(checkQuery, { email });

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertQuery = `
      INSERT INTO Users (Name, Email, PasswordHash, Role, Status, CreatedAt)
      OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email, INSERTED.Role, INSERTED.Status
      VALUES (@name, @email, @passwordHash, 'user', 'active', SYSUTCDATETIME())
    `;

    const result = await executeQuery(insertQuery, {
      name,
      email,
      passwordHash: hashedPassword
    });

    const newUser = result.recordset[0];

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.Id,
        name: newUser.Name,
        email: newUser.Email,
        role: newUser.Role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Registration failed',
      details: error.message
    });
  }
};

/**
 * User Login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    // Find user
    const query = `
      SELECT Id, Name, Email, PasswordHash, Role, Status
      FROM Users
      WHERE Email = @email
    `;
    const result = await executeQuery(query, { email });

    if (result.recordset.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const user = result.recordset[0];

    // Check if account is active
    if (user.Status !== 'active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is locked or inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed',
      details: error.message
    });
  }
};

/**
 * Get current user profile
 * Fixed to match SQL_QUICK_START.sql schema
 */
const getProfile = async (req, res) => {
  try {
    console.log('getProfile called, req.user:', req.user);
    
    const query = `
      SELECT Id, Name, Email, Role, Status, CreatedAt
      FROM dbo.Users
      WHERE Id = @userId
    `;
    
    console.log('Querying with userId:', req.user.userId);
    const result = await executeQuery(query, { userId: req.user.userId });

    if (result.recordset.length === 0) {
      console.log('User not found with ID:', req.user.userId);
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const user = result.recordset[0];
    console.log('User found:', user);

    res.json({
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        role: user.Role,
        status: user.Status,
        createdAt: user.CreatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get profile',
      details: error.message
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, height, weight } = req.body;

    const query = `
      UPDATE Users
      SET FullName = COALESCE(@fullName, FullName),
          DateOfBirth = COALESCE(@dateOfBirth, DateOfBirth),
          Gender = COALESCE(@gender, Gender),
          Height = COALESCE(@height, Height),
          Weight = COALESCE(@weight, Weight)
      OUTPUT INSERTED.UserId, INSERTED.Username, INSERTED.Email, INSERTED.FullName, INSERTED.DateOfBirth, INSERTED.Gender, INSERTED.Height, INSERTED.Weight
      WHERE UserId = @userId
    `;

    const result = await executeQuery(query, {
      userId: req.user.userId,
      fullName: fullName || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      height: height || null,
      weight: weight || null
    });

    res.json({
      message: 'Profile updated successfully',
      user: result.recordset[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile'
    });
  }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Current password and new password are required'
      });
    }

    // Get current password hash
    const query = 'SELECT PasswordHash FROM Users WHERE UserId = @userId';
    const result = await executeQuery(query, { userId: req.user.userId });

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.recordset[0].PasswordHash);

    if (!isValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await executeQuery(
      'UPDATE Users SET PasswordHash = @passwordHash WHERE UserId = @userId',
      { userId: req.user.userId, passwordHash: hashedPassword }
    );

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to change password'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
