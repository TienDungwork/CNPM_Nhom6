/**
 * Test Sleep Tracker Functionality
 * Tests the sleep logging and tracking features
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let userId = '';

// Test credentials
const testUser = {
  email: 'admin@test.com',
  password: '123456',
  name: 'Admin'
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testLogin() {
  log('\n📝 Testing Login...', 'cyan');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      authToken = data.token;
      userId = data.user.id;
      log(`✅ Login successful! Token: ${authToken.substring(0, 20)}...`, 'green');
      log(`   User ID: ${userId}`, 'green');
      return true;
    } else {
      log(`❌ Login failed: ${data.message || 'Unknown error'}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, 'red');
    return false;
  }
}

async function testLogSleep(sleepData) {
  log('\n😴 Testing Log Sleep...', 'cyan');
  try {
    const response = await fetch(`${BASE_URL}/api/activity/log-sleep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(sleepData)
    });

    const data = await response.json();
    
    if (response.ok) {
      log(`✅ Sleep logged successfully!`, 'green');
      log(`   Sleep ID: ${data.sleepId}`, 'green');
      log(`   Duration: ${sleepData.duration} hours`, 'green');
      log(`   Quality: ${sleepData.quality}`, 'green');
      return data.sleepId;
    } else {
      log(`❌ Log sleep failed: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Log sleep error: ${error.message}`, 'red');
    return null;
  }
}

async function testGetTodaySleep() {
  log('\n📊 Testing Get Today Sleep...', 'cyan');
  try {
    const response = await fetch(`${BASE_URL}/api/activity/sleep/today`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok) {
      log(`✅ Retrieved today's sleep records!`, 'green');
      log(`   Total records: ${data.sleepRecords?.length || 0}`, 'green');
      if (data.sleepRecords && data.sleepRecords.length > 0) {
        data.sleepRecords.forEach((record, index) => {
          log(`   [${index + 1}] ${record.duration}h, Quality: ${record.quality}, Date: ${record.sleepDate}`, 'blue');
        });
      }
      return true;
    } else {
      log(`❌ Get today sleep failed: ${data.error || 'Unknown error'}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Get today sleep error: ${error.message}`, 'red');
    return false;
  }
}

async function testGetWeeklySleep() {
  log('\n📈 Testing Get Weekly Sleep...', 'cyan');
  try {
    const response = await fetch(`${BASE_URL}/api/activity/sleep/weekly`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok) {
      log(`✅ Retrieved weekly sleep data!`, 'green');
      log(`   Days with data: ${data.sleepData?.length || 0}`, 'green');
      log(`   Average duration: ${data.summary?.avgDuration?.toFixed(1) || 0}h`, 'green');
      log(`   Total sleep: ${data.summary?.totalSleep?.toFixed(1) || 0}h`, 'green');
      return true;
    } else {
      log(`❌ Get weekly sleep failed: ${data.error || 'Unknown error'}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Get weekly sleep error: ${error.message}`, 'red');
    return false;
  }
}

async function testDailyPlannerIntegration() {
  log('\n🗓️ Testing Daily Planner Integration...', 'cyan');
  try {
    // Create a sleep plan
    const planData = {
      date: new Date().toISOString().split('T')[0],
      time: '22:00',
      activityType: 'sleep',
      title: 'Ngủ sớm',
      description: '8 giờ ngủ',
      notes: 'Cần đủ giấc để sáng mai tỉnh táo'
    };

    const response = await fetch(`${BASE_URL}/api/planning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(planData)
    });

    const data = await response.json();
    
    if (response.ok) {
      log(`✅ Sleep plan created successfully!`, 'green');
      log(`   Plan ID: ${data.plan.id}`, 'green');
      log(`   Time: ${data.plan.time}`, 'green');
      log(`   Title: ${data.plan.title}`, 'green');
      return data.plan.id;
    } else {
      log(`❌ Create sleep plan failed: ${data.error || 'Unknown error'}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Create sleep plan error: ${error.message}`, 'red');
    return null;
  }
}

async function runTests() {
  log('='.repeat(60), 'yellow');
  log('🧪 SLEEP TRACKER FUNCTIONALITY TEST', 'yellow');
  log('='.repeat(60), 'yellow');

  // Test 1: Login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    log('\n❌ Tests aborted: Login failed', 'red');
    return;
  }

  // Test 2: Log sleep entries
  log('\n' + '='.repeat(60), 'yellow');
  const sleepEntries = [
    {
      sleepDate: new Date().toISOString().split('T')[0],
      duration: 8,
      quality: 'good',
      notes: 'Ngủ ngon, không bị gián đoạn'
    },
    {
      sleepDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      duration: 6.5,
      quality: 'fair',
      notes: 'Thức khuya làm việc'
    },
    {
      sleepDate: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
      duration: 7,
      quality: 'good',
      notes: 'Ngủ ổn'
    }
  ];

  const sleepIds = [];
  for (const entry of sleepEntries) {
    const sleepId = await testLogSleep(entry);
    if (sleepId) sleepIds.push(sleepId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
  }

  // Test 3: Get today's sleep
  log('\n' + '='.repeat(60), 'yellow');
  await testGetTodaySleep();

  // Test 4: Get weekly sleep
  log('\n' + '='.repeat(60), 'yellow');
  await testGetWeeklySleep();

  // Test 5: Daily Planner Integration
  log('\n' + '='.repeat(60), 'yellow');
  await testDailyPlannerIntegration();

  // Summary
  log('\n' + '='.repeat(60), 'yellow');
  log('📊 TEST SUMMARY', 'yellow');
  log('='.repeat(60), 'yellow');
  log(`✅ Sleep entries logged: ${sleepIds.length}/${sleepEntries.length}`, sleepIds.length === sleepEntries.length ? 'green' : 'yellow');
  log(`✅ Tests completed!`, 'green');
  log('='.repeat(60), 'yellow');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  console.error(error);
});
