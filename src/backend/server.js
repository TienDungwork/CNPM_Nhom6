const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getPool } = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const mealsRoutes = require('./routes/meals.routes');
const exercisesRoutes = require('./routes/exercises.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const activityRoutes = require('./routes/activity.routes');
const profileRoutes = require('./routes/profile.routes');
const planningRoutes = require('./routes/planning.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.1.145:3000', // Cho phép truy cập từ địa chỉ IP mạng
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/ // Cho phép tất cả địa chỉ IP trong mạng LAN
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HealthyColors API is running',
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const { executeQuery } = require('./config/database');
    
    // Test query
    const result = await executeQuery('SELECT DB_NAME() as CurrentDatabase, @@VERSION as Version');
    
    // Check tables
    const tablesResult = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_NAME
    `);
    
    const requiredTables = ['Users', 'Meals', 'Exercises', 'UserMeals', 'UserExercises', 
                           'SleepRecords', 'WaterLogs', 'ActivityLogs', 'Feedback'];
    const existingTables = tablesResult.recordset.map(t => t.TABLE_NAME);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    res.json({
      status: 'Connected',
      database: result.recordset[0].CurrentDatabase,
      sqlVersion: result.recordset[0].Version.split('\n')[0],
      tables: {
        total: existingTables.length,
        existing: existingTables,
        missing: missingTables,
        isComplete: missingTables.length === 0
      },
      message: missingTables.length === 0 
        ? 'Database schema is complete' 
        : `Missing ${missingTables.length} tables. Run SQL_QUICK_START.sql`
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Cannot connect to database',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/planning', planningRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Test database connection before starting server
const startServer = async () => {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const pool = await getPool();
    console.log('✅ Database connected successfully!');
    console.log('📊 Database:', process.env.DB_DATABASE || 'CNPM');
    console.log('');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0'; // Lắng nghe trên tất cả địa chỉ mạng
    app.listen(PORT, HOST, () => {
      console.log(`🚀 HealthyColors Backend API running on port ${PORT}`);
      console.log(`📡 API URL (Local): http://localhost:${PORT}/api`);
      console.log(`📡 API URL (Network): http://192.168.1.145:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('💡 TIP: Run "node test-db-connection.js" to verify database schema');
    });
  } catch (error) {
    console.error('');
    console.error('❌ CRITICAL ERROR: Cannot connect to database!');
    console.error('📋 Error details:', error.message);
    console.error('');
    console.error('🔧 Please check:');
    console.error('   1. SQL Server is running');
    console.error('   2. Database credentials in .env file are correct');
    console.error('   3. Database "CNPM" exists');
    console.error('   4. Run "node test-db-connection.js" for detailed diagnostics');
    console.error('');
    process.exit(1);
  }
};

startServer();

module.exports = app;
