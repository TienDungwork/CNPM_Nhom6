const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Check if using SQL Authentication (có DB_USER) or Windows Authentication  
const useSqlAuth = process.env.DB_USER && process.env.DB_USER.trim() !== '';

const config = useSqlAuth ? {
  // SQL Authentication
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'CNPM',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
} : {
  // Windows Authentication với connection string
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'CNPM',
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    useUTC: false,
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  // Thêm authentication
  authentication: {
    type: 'ntlm',
    options: {
      domain: '',
      userName: '',
      password: ''
    }
  }
};

let pool = null;

/**
 * Get database connection pool
 * @returns {Promise<sql.ConnectionPool>}
 */
const getPool = async () => {
  if (!pool) {
    try {
      const authType = useSqlAuth ? 'SQL Authentication' : 'Windows Authentication';
      console.log('🔐 Authentication:', authType);
      console.log('🖥️  Server:', config.server);
      console.log('🗄️  Database:', config.database);
      if (useSqlAuth) {
        console.log('👤 User:', config.user);
      }
      
      pool = await sql.connect(config);
      console.log('✅ Connected to SQL Server database:', config.database);
    } catch (error) {
      console.error('❌ Database connection error:', error.message);
      throw error;
    }
  }
  return pool;
};

/**
 * Execute a query with parameters
 * @param {string} query - SQL query
 * @param {Object|Array} params - Query parameters (object or array of {name, type, value})
 * @returns {Promise<any>}
 */
const executeQuery = async (query, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Support both object and array format
    if (Array.isArray(params)) {
      // Array format: [{name, type, value}]
      params.forEach(param => {
        if (param.type) {
          // With explicit type - get the type from sql module
          const sqlType = sql[param.type];
          if (!sqlType) {
            console.warn(`Unknown SQL type: ${param.type}, using auto-detect`);
            request.input(param.name, param.value);
          } else {
            request.input(param.name, sqlType, param.value);
          }
        } else {
          // Without type (auto-detect)
          request.input(param.name, param.value);
        }
      });
    } else {
      // Object format: {key: value}
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

/**
 * Execute a stored procedure
 * @param {string} procedureName - Stored procedure name
 * @param {Object} params - Procedure parameters
 * @returns {Promise<any>}
 */
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('Procedure execution error:', error.message);
    throw error;
  }
};

/**
 * Close database connection
 */
const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = {
  sql,
  getPool,
  executeQuery,
  executeProcedure,
  closeConnection
};
