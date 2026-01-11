#!/usr/bin/env node

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API calls
async function makeRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: parsedData
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

async function seedTestData() {
  console.log('🌱 Seeding test data for business features testing...\n');
  
  // Create a test memorial first (needed for prison access and flower orders)
  console.log('📝 Creating test memorial...');
  const memorial = await makeRequest('POST', '/memorials', {
    name: 'Test Memorial for Business Features',
    birthDate: '1950-01-01',
    deathDate: '2024-01-01',
    biography: 'A memorial created for testing business features',
    inviteCode: 'TESTBIZ' + Date.now(),
    isPublic: true,
    creatorEmail: 'test@example.com'
  });
  
  if (memorial.ok) {
    console.log('✅ Test memorial created:', memorial.data.id);
    return memorial.data.id;
  } else {
    // Try to get existing memorials
    console.log('⚠️ Could not create test memorial, trying to fetch existing ones...');
    const memorials = await makeRequest('GET', '/memorials?limit=1');
    if (memorials.ok && memorials.data.length > 0) {
      console.log('✅ Using existing memorial:', memorials.data[0].id);
      return memorials.data[0].id;
    }
  }
  
  return null;
}

async function seedPrisonFacility() {
  console.log('\n🏛️ Creating test prison facility...');
  
  // This would normally be done through admin interface
  // For now, we'll work with what exists or create via direct DB if needed
  console.log('⚠️ Note: Prison facilities typically need to be created by admins');
  console.log('   Using test facility ID for now: test-facility-1');
  
  return 'test-facility-1';
}

async function main() {
  console.log('=' .repeat(60));
  console.log('     TEST DATA SEEDING FOR BUSINESS FEATURES');
  console.log('=' .repeat(60) + '\n');
  
  const memorialId = await seedTestData();
  const facilityId = await seedPrisonFacility();
  
  console.log('\n' + '=' .repeat(60));
  console.log('     SEEDING COMPLETE');
  console.log('=' .repeat(60));
  
  if (memorialId) {
    console.log('\n📌 Test Data Created:');
    console.log(`   Memorial ID: ${memorialId}`);
    console.log(`   Facility ID: ${facilityId} (may need admin creation)`);
    console.log('\n✅ You can now run the business features test!');
  } else {
    console.log('\n⚠️ Warning: Could not create or find test memorial');
    console.log('   Some tests may fail due to missing references');
  }
}

main().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});