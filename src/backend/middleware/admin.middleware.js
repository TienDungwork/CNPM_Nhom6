const { verifyToken, requireRole } = require('./auth.middleware');

/**
 * Combined middleware for admin routes
 * First verify token, then check for admin role
 */
const requireAdmin = [
  verifyToken,
  requireRole('admin')
];

module.exports = {
  requireAdmin
};
