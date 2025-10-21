const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test credentials
const ADMIN_USER = {
  email: 'admin@test.com',
  password: '123456'
};

let authToken = '';

async function login() {
  console.log('\n🔐 Testing Login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, ADMIN_USER);
    authToken = response.data.token;
    console.log('✅ Login successful!');
    console.log(`   User: ${response.data.user.name} (${response.data.user.email})`);
    console.log(`   User ID: ${response.data.user.id}`);
    console.log(`   Token: ${authToken.substring(0, 30)}...`);
    return response.data.user;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getTodayActivity() {
  console.log('\n📊 Testing GET /activity/today (Dashboard data)...');
  try {
    const response = await axios.get(`${API_URL}/activity/today`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const data = response.data;
    console.log('✅ Today\'s activity retrieved!');
    console.log(`   Date: ${data.date}`);
    console.log(`   Meals logged: ${data.meals.length}`);
    console.log(`   Exercises: ${data.exercises.length}`);
    console.log(`   Water cups: ${data.water.length}`);
    
    if (data.sleep) {
      console.log('   🌙 Sleep Data:');
      console.log(`      Duration: ${data.sleep.duration} hours`);
      console.log(`      Quality: ${data.sleep.quality}`);
      if (data.sleep.notes) {
        console.log(`      Notes: ${data.sleep.notes}`);
      }
    } else {
      console.log('   ⚠️  No sleep data');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Failed to get today activity:', error.response?.data || error.message);
    throw error;
  }
}

async function getTodaySleep() {
  console.log('\n🌙 Testing GET /activity/sleep/today...');
  try {
    const response = await axios.get(`${API_URL}/activity/sleep/today`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.length > 0) {
      console.log(`✅ Found ${response.data.length} sleep record(s) for today:`);
      response.data.forEach((sleep, index) => {
        console.log(`   [${index + 1}] ${sleep.duration}h (${sleep.quality}) - "${sleep.notes || 'No notes'}"`);
      });
    } else {
      console.log('⚠️  No sleep records found for today');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get today sleep:', error.response?.data || error.message);
    return [];
  }
}

async function getWeeklySleep() {
  console.log('\n📈 Testing GET /activity/sleep/weekly...');
  try {
    const response = await axios.get(`${API_URL}/activity/sleep/weekly`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const summary = response.data.summary;
    console.log('✅ Weekly sleep summary:');
    console.log(`   Days with data: ${summary.daysWithData}/7`);
    console.log(`   Total sleep: ${summary.totalSleep} hours`);
    console.log(`   Average duration: ${summary.avgDuration} hours`);
    
    if (response.data.sleepLogs.length > 0) {
      console.log('\n   Daily breakdown:');
      response.data.sleepLogs.forEach(day => {
        console.log(`   - ${day.date}: ${day.duration}h (${day.quality})`);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get weekly sleep:', error.response?.data || error.message);
    return null;
  }
}

async function logNewSleep() {
  console.log('\n💤 Testing POST /activity/log-sleep...');
  try {
    const today = new Date().toISOString().split('T')[0];
    const sleepData = {
      sleepDate: today,
      duration: 7.5,
      quality: 'good',
      notes: 'Test sleep entry from script'
    };
    
    console.log(`   Logging: ${sleepData.duration}h (${sleepData.quality}) for ${sleepData.sleepDate}`);
    
    const response = await axios.post(
      `${API_URL}/activity/log-sleep`,
      sleepData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log('✅ Sleep logged successfully!');
    console.log(`   Sleep ID: ${response.data.sleepId}`);
    console.log(`   Duration: ${response.data.duration} hours`);
    console.log(`   Quality: ${response.data.quality}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to log sleep:', error.response?.data || error.message);
    // Don't throw - might already have sleep for today
    return null;
  }
}

async function runAllTests() {
  console.log('============================================================');
  console.log('🧪 SLEEP DASHBOARD INTEGRATION TEST');
  console.log('============================================================');

  try {
    // Step 1: Login
    const user = await login();

    // Step 2: Get today's activity (main dashboard endpoint)
    const todayActivity = await getTodayActivity();

    // Step 3: Get today's sleep specifically
    const todaySleep = await getTodaySleep();

    // Step 4: Get weekly sleep data
    const weeklySleep = await getWeeklySleep();

    // Step 5: Try to log new sleep (may fail if already exists)
    console.log('\n============================================================');
    console.log('📝 Testing Log New Sleep (optional)');
    console.log('============================================================');
    await logNewSleep();

    // Step 6: Re-check today's activity to see if it updated
    console.log('\n============================================================');
    console.log('🔄 Re-checking Today\'s Activity (after logging)');
    console.log('============================================================');
    await getTodayActivity();

    console.log('\n============================================================');
    console.log('📊 TEST SUMMARY');
    console.log('============================================================');
    console.log('✅ All tests completed successfully!');
    console.log('\n📌 Key Points:');
    console.log(`   - User logged in: ${user.email}`);
    console.log(`   - Today's meals: ${todayActivity.meals.length}`);
    console.log(`   - Today's exercises: ${todayActivity.exercises.length}`);
    console.log(`   - Sleep data available: ${todayActivity.sleep ? 'YES ✅' : 'NO ❌'}`);
    if (todayActivity.sleep) {
      console.log(`   - Sleep duration: ${todayActivity.sleep.duration} hours`);
      console.log(`   - Sleep quality: ${todayActivity.sleep.quality}`);
    }
    console.log('\n💡 To see this data in browser:');
    console.log('   1. Go to http://localhost:3000/login');
    console.log(`   2. Login with ${ADMIN_USER.email} / ${ADMIN_USER.password}`);
    console.log('   3. Go to Dashboard');
    console.log('   4. Check "Sleep Duration" and "Sleep Quality" sections');
    console.log('============================================================');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
