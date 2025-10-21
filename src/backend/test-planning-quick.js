/**
 * Quick test for Planning API
 */

const testLogin = async () => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'Test123456'
    })
  });
  const data = await response.json();
  console.log('Login:', response.ok ? '✅' : '❌', data);
  return data.token;
};

const testCreatePlan = async (token) => {
  const planData = {
    date: new Date().toISOString().split('T')[0],
    time: '14:00:00', // Add seconds
    activityType: 'meal',
    title: 'Bữa trưa test',
    description: 'Test description',
    notes: 'Test notes',
    mealId: null,
    exerciseId: null
  };

  console.log('\n📤 Sending:', planData);

  const response = await fetch('http://localhost:5000/api/planning', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(planData)
  });

  const text = await response.text();
  console.log('\n📥 Response status:', response.status);
  console.log('📥 Response headers:', Object.fromEntries(response.headers));
  console.log('📥 Response body:', text);

  try {
    const data = JSON.parse(text);
    console.log('📥 Parsed JSON:', data);
  } catch (e) {
    console.log('❌ Not JSON response');
  }
};

(async () => {
  console.log('🧪 Testing Planning API...\n');
  const token = await testLogin();
  if (token) {
    await testCreatePlan(token);
  }
})();
