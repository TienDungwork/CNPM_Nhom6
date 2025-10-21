/**
 * Test Database Connection Script
 * Chạy file này để kiểm tra kết nối SQL Server
 * 
 * Cách chạy: node test-db-connection.js
 */

const { getPool, executeQuery } = require('./config/database');

async function testDatabaseConnection() {
  console.log('🔍 Đang kiểm tra kết nối SQL Server...\n');
  
  try {
    // 1. Test kết nối cơ bản
    console.log('📡 Bước 1: Thử kết nối đến SQL Server...');
    const pool = await getPool();
    console.log('✅ Kết nối thành công!\n');
    
    // 2. Test query đơn giản
    console.log('📊 Bước 2: Thử chạy query SELECT...');
    const result = await executeQuery('SELECT @@VERSION as Version, DB_NAME() as CurrentDatabase');
    console.log('✅ Query thành công!');
    console.log('📌 SQL Server Version:', result.recordset[0].Version.split('\n')[0]);
    console.log('📌 Current Database:', result.recordset[0].CurrentDatabase);
    console.log();
    
    // 3. Kiểm tra các bảng trong database
    console.log('📋 Bước 3: Kiểm tra các bảng trong database...');
    const tablesResult = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_NAME
    `);
    
    if (tablesResult.recordset.length > 0) {
      console.log('✅ Tìm thấy', tablesResult.recordset.length, 'bảng:');
      tablesResult.recordset.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.TABLE_NAME}`);
      });
      console.log();
      
      // 4. Kiểm tra bảng Users (quan trọng)
      console.log('👥 Bước 4: Kiểm tra bảng Users...');
      const usersCheck = tablesResult.recordset.find(t => t.TABLE_NAME === 'Users');
      
      if (usersCheck) {
        const userCount = await executeQuery('SELECT COUNT(*) as TotalUsers FROM Users');
        console.log('✅ Bảng Users tồn tại');
        console.log('📊 Số lượng users:', userCount.recordset[0].TotalUsers);
        
        // Kiểm tra cấu trúc bảng Users
        const columnsResult = await executeQuery(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = 'Users'
          ORDER BY ORDINAL_POSITION
        `);
        console.log('📋 Cấu trúc bảng Users:');
        columnsResult.recordset.forEach(col => {
          console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'NO' ? '- Required' : ''}`);
        });
      } else {
        console.log('⚠️  CẢNH BÁO: Bảng Users không tồn tại!');
        console.log('   Bạn cần chạy file SQL_QUICK_START.sql để tạo database schema');
      }
      console.log();
      
      // 5. Kiểm tra các bảng quan trọng khác
      console.log('🔍 Bước 5: Kiểm tra các bảng quan trọng...');
      const requiredTables = ['Users', 'Meals', 'Exercises', 'UserMeals', 'UserExercises', 
                              'SleepRecords', 'WaterLogs', 'ActivityLogs', 'Feedback'];
      const missingTables = [];
      
      requiredTables.forEach(tableName => {
        const exists = tablesResult.recordset.find(t => t.TABLE_NAME === tableName);
        if (exists) {
          console.log(`   ✅ ${tableName}`);
        } else {
          console.log(`   ❌ ${tableName} - THIẾU`);
          missingTables.push(tableName);
        }
      });
      
      if (missingTables.length > 0) {
        console.log('\n⚠️  CẢNH BÁO: Thiếu', missingTables.length, 'bảng:', missingTables.join(', '));
        console.log('   👉 Chạy file SQL_QUICK_START.sql để tạo đầy đủ schema');
      } else {
        console.log('\n✅ Tất cả các bảng quan trọng đều tồn tại!');
      }
      
    } else {
      console.log('⚠️  Database rỗng - không có bảng nào!');
      console.log('   👉 Bạn cần chạy file SQL_QUICK_START.sql để tạo database schema');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 KẾT LUẬN: Backend ĐÃ KẾT NỐI THÀNH CÔNG với SQL Server!');
    console.log('='.repeat(60));
    console.log('✅ Bạn có thể bắt đầu sử dụng API');
    console.log('📡 Khởi động server: npm run dev');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ LỖI KẾT NỐI DATABASE!');
    console.log('='.repeat(60));
    console.error('Chi tiết lỗi:', error.message);
    console.log('\n📋 HƯỚNG DẪN SỬA LỖI:\n');
    
    if (error.message.includes('Login failed') || error.message.includes('password')) {
      console.log('🔐 Lỗi đăng nhập SQL Server:');
      console.log('   1. Kiểm tra file .env:');
      console.log('      - DB_USER=sa');
      console.log('      - DB_PASSWORD=<mật khẩu SQL Server của bạn>');
      console.log('   2. Đảm bảo SQL Server Authentication được bật');
      console.log('   3. User "sa" phải có quyền truy cập database');
    } else if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.log('🔌 Lỗi kết nối SQL Server:');
      console.log('   1. Kiểm tra SQL Server đã chạy chưa:');
      console.log('      - Mở SQL Server Configuration Manager');
      console.log('      - Đảm bảo SQL Server service đang chạy');
      console.log('   2. Kiểm tra file .env:');
      console.log('      - DB_SERVER=localhost (hoặc tên server của bạn)');
      console.log('      - DB_PORT=1433');
      console.log('   3. Kiểm tra firewall không chặn port 1433');
    } else if (error.message.includes('database')) {
      console.log('🗄️  Lỗi database:');
      console.log('   1. Database "CNPM" chưa tồn tại');
      console.log('   2. Tạo database:');
      console.log('      - Mở SQL Server Management Studio (SSMS)');
      console.log('      - CREATE DATABASE CNPM');
      console.log('      - Hoặc chạy file SQL_QUICK_START.sql');
    }
    
    console.log('\n💡 TIP: Kiểm tra lại thông tin trong file .env');
    console.log('='.repeat(60) + '\n');
    
    process.exit(1);
  }
}

// Chạy test
testDatabaseConnection();
