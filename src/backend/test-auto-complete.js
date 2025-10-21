const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123456'
};

let authToken = '';

async function login() {
  console.log('\n📝 Testing Login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    authToken = response.data.token;
    console.log('✅ Login successful!');
    console.log('   Token:', authToken.substring(0, 30) + '...');
    console.log('   User ID:', response.data.user.id);
    return response.data.user.id;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getAvailableMeal() {
  console.log('\n🍽️ Getting available meal...');
  try {
    const response = await axios.get(`${API_URL}/meals/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const meals = response.data.meals || response.data;
    if (meals && meals.length > 0) {
      console.log(`✅ Found ${meals.length} meals, using first one:`, meals[0].name);
      return meals[0].id;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get meals:', error.response?.data || error.message);
    return null;
  }
}

async function getAvailableExercise() {
  console.log('\n🏃 Getting available exercise...');
  try {
    const response = await axios.get(`${API_URL}/exercises/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const exercises = response.data.exercises || response.data;
    if (exercises && exercises.length > 0) {
      console.log(`✅ Found ${exercises.length} exercises, using first one:`, exercises[0].name);
      return exercises[0].id;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get exercises:', error.response?.data || error.message);
    return null;
  }
}

async function createPlanWithMeal(mealId) {
  console.log('\n📅 Creating meal plan...');
  try {
    const response = await axios.post(
      `${API_URL}/planning`,
      {
        date: new Date().toISOString().split('T')[0],
        time: '12:00:00',
        activityType: 'meal',
        title: 'Test Lunch Plan',
        description: 'Testing auto-complete',
        mealId: mealId  // No parseInt - it's a GUID
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Meal plan created!');
    console.log('   Plan ID:', response.data.plan.id);
    console.log('   MealID:', response.data.plan.mealId);
    console.log('   Completed:', response.data.plan.completed);
    return response.data.plan.id;
  } catch (error) {
    console.error('❌ Failed to create plan:', error.response?.data || error.message);
    throw error;
  }
}

async function createPlanWithExercise(exerciseId) {
  console.log('\n📅 Creating exercise plan...');
  try {
    const response = await axios.post(
      `${API_URL}/planning`,
      {
        date: new Date().toISOString().split('T')[0],
        time: '14:00:00',
        activityType: 'exercise',
        title: 'Test Exercise Plan',
        description: 'Testing auto-complete',
        exerciseId: exerciseId  // No parseInt - it's a GUID
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Exercise plan created!');
    console.log('   Plan ID:', response.data.plan.id);
    console.log('   ExerciseID:', response.data.plan.exerciseId);
    console.log('   Completed:', response.data.plan.completed);
    return response.data.plan.id;
  } catch (error) {
    console.error('❌ Failed to create plan:', error.response?.data || error.message);
    throw error;
  }
}

async function logMeal(mealId) {
  console.log('\n🍴 Logging meal...');
  try {
    const response = await axios.post(
      `${API_URL}/activity/log-meal`,
      {
        date: new Date().toISOString().split('T')[0],
        mealId: mealId,
        servings: 1,
        notes: 'Auto-complete test'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Meal logged successfully!');
    console.log('   Meal ID:', mealId);
    return true;
  } catch (error) {
    console.error('❌ Failed to log meal:', error.response?.data || error.message);
    return false;
  }
}

async function logExercise(exerciseId) {
  console.log('\n🏋️ Logging exercise...');
  try {
    const response = await axios.post(
      `${API_URL}/activity/log-exercise`,
      {
        date: new Date().toISOString().split('T')[0],
        exerciseId: exerciseId,
        duration: 30,
        caloriesBurned: 200,
        notes: 'Auto-complete test'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Exercise logged successfully!');
    console.log('   Exercise ID:', exerciseId);
    return true;
  } catch (error) {
    console.error('❌ Failed to log exercise:', error.response?.data || error.message);
    return false;
  }
}

async function checkPlanStatus(planId) {
  console.log('\n🔍 Checking plan status...');
  try {
    const response = await axios.get(
      `${API_URL}/planning/today`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const plans = response.data.plans || response.data;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      console.log('✅ Plan found!');
      console.log('   Plan ID:', plan.id);
      console.log('   Title:', plan.title);
      console.log('   Completed:', plan.completed);
      return plan.completed;
    } else {
      console.log('⚠️ Plan not found in today\'s plans');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to check plan:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('============================================================');
  console.log('🧪 AUTO-COMPLETE FUNCTIONALITY TEST');
  console.log('============================================================');

  try {
    // Login
    const userId = await login();

    // Get available meal and exercise
    const mealId = await getAvailableMeal();
    const exerciseId = await getAvailableExercise();

    if (!mealId) {
      console.log('\n⚠️ No meals available in database. Skipping meal test.');
    } else {
      console.log('\n============================================================');
      console.log('TEST 1: MEAL AUTO-COMPLETE');
      console.log('============================================================');

      // Create plan with meal
      const mealPlanId = await createPlanWithMeal(mealId);

      // Check plan is not completed initially
      let isCompleted = await checkPlanStatus(mealPlanId);
      console.log(`   Initial status: ${isCompleted ? '✅ Completed' : '⏳ Not completed'}`);

      // Log the meal
      await logMeal(mealId);

      // Check if plan is auto-completed
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait a bit
      isCompleted = await checkPlanStatus(mealPlanId);
      if (isCompleted) {
        console.log('   ✅ MEAL AUTO-COMPLETE WORKS! Plan was automatically marked as completed.');
      } else {
        console.log('   ❌ MEAL AUTO-COMPLETE FAILED! Plan is still not completed.');
      }
    }

    if (!exerciseId) {
      console.log('\n⚠️ No exercises available in database. Skipping exercise test.');
    } else {
      console.log('\n============================================================');
      console.log('TEST 2: EXERCISE AUTO-COMPLETE');
      console.log('============================================================');

      // Create plan with exercise
      const exercisePlanId = await createPlanWithExercise(exerciseId);

      // Check plan is not completed initially
      let isCompleted = await checkPlanStatus(exercisePlanId);
      console.log(`   Initial status: ${isCompleted ? '✅ Completed' : '⏳ Not completed'}`);

      // Log the exercise
      await logExercise(exerciseId);

      // Check if plan is auto-completed
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait a bit
      isCompleted = await checkPlanStatus(exercisePlanId);
      if (isCompleted) {
        console.log('   ✅ EXERCISE AUTO-COMPLETE WORKS! Plan was automatically marked as completed.');
      } else {
        console.log('   ❌ EXERCISE AUTO-COMPLETE FAILED! Plan is still not completed.');
      }
    }

    console.log('\n============================================================');
    console.log('📊 TEST SUMMARY');
    console.log('============================================================');
    console.log('✅ Tests completed!');
    console.log('============================================================');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
