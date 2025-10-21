const { executeQuery } = require('./config/database.js');

(async () => {
  try {
    // Check sleep logs
    const sleepLogs = await executeQuery('SELECT TOP 5 * FROM SleepLogs ORDER BY CreatedAt DESC');
    console.log('📊 Recent Sleep Logs:');
    sleepLogs.recordset.forEach(log => {
      console.log(`  - Date: ${log.SleepDate}, Duration: ${log.Duration}h, Quality: ${log.Quality}, UserID: ${log.UserID}`);
    });
    
    // Check today's sleep for test user
    const today = new Date().toISOString().split('T')[0];
    const testUserId = 'DBCFAD16-E437-425F-AB21-6C2E7AED6269';
    
    const todaySleep = await executeQuery(
      'SELECT * FROM SleepLogs WHERE UserID = @userId AND SleepDate = @today',
      { userId: testUserId, today: today }
    );
    
    console.log(`\n🌙 Today's sleep for test user (${today}):`);
    if (todaySleep.recordset.length > 0) {
      console.log('  ✅ Found:', JSON.stringify(todaySleep.recordset[0], null, 2));
    } else {
      console.log('  ❌ No sleep data for today');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
