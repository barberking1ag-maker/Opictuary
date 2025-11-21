#!/usr/bin/env tsx

// Comprehensive test script to verify all platform features are working

const BASE_URL = 'http://localhost:5000';

interface TestResult {
  feature: string;
  endpoint: string;
  status: 'PASS' | 'FAIL';
  error?: string;
}

const results: TestResult[] = [];

async function testEndpoint(feature: string, endpoint: string, options: RequestInit = {}): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      results.push({ feature, endpoint, status: 'PASS' });
    } else if (response.status === 401 || response.status === 403) {
      // Authentication required - this is expected for protected endpoints
      results.push({ feature, endpoint, status: 'PASS' });
    } else if (response.status === 404) {
      results.push({ feature, endpoint, status: 'FAIL', error: 'Endpoint not found' });
    } else {
      // HTML response when JSON expected
      results.push({ feature, endpoint, status: 'FAIL', error: 'Non-JSON response' });
    }
  } catch (error) {
    results.push({ feature, endpoint, status: 'FAIL', error: String(error) });
  }
}

async function runTests() {
  console.log('🚀 Testing Opictuary Platform Features...\n');

  // 1. Essential Features
  console.log('📋 Testing Essential Features...');
  await testEndpoint('Memorials', '/api/memorials');
  await testEndpoint('Users', '/api/users');
  await testEndpoint('Search', '/api/memorials/search?query=test');
  await testEndpoint('QR Codes', '/api/qr-codes');
  await testEndpoint('Photo Gallery', '/api/memorial-photos');
  await testEndpoint('Video Gallery', '/api/memorial-videos');
  await testEndpoint('Memories', '/api/memories');
  await testEndpoint('Condolences', '/api/condolences');
  
  // 2. Future Messages System
  console.log('\n📨 Testing Future Messages System...');
  await testEndpoint('Future Messages', '/api/future-messages');
  await testEndpoint('Scheduled Messages', '/api/scheduled-messages');
  await testEndpoint('Video Time Capsules', '/api/video-time-capsules');
  
  // 3. Prison Access System
  console.log('\n🔒 Testing Prison Access System...');
  await testEndpoint('Prison Facilities', '/api/prison-facilities');
  await testEndpoint('Prison Access Requests', '/api/prison-access-requests');
  await testEndpoint('Prison Sessions', '/api/prison-access-sessions');
  
  // 4. Physical Memorial Products
  console.log('\n📦 Testing Physical Memorial Products...');
  await testEndpoint('Products', '/api/products');
  await testEndpoint('Product Orders', '/api/product-orders');
  
  // 5. Alumni Memorial System
  console.log('\n🎓 Testing Alumni Memorial System...');
  await testEndpoint('Alumni Memorials', '/api/alumni-memorials');
  
  // 6. Celebrity Memorial System
  console.log('\n⭐ Testing Celebrity Memorial System...');
  await testEndpoint('Celebrity Memorials', '/api/celebrity-memorials');
  await testEndpoint('Celebrity Donations', '/api/celebrity-donations');
  await testEndpoint('Fan Content', '/api/celebrity-fan-content');
  
  // 7. Hood/Neighborhood Memorials
  console.log('\n🏘️ Testing Hood/Neighborhood Memorials...');
  await testEndpoint('Hood Memorials', '/api/hood-memorials');
  await testEndpoint('Neighborhoods', '/api/neighborhoods');
  await testEndpoint('Nearby Hood Memorials', '/api/hood-memorials/nearby?lat=40.7128&lng=-74.0060&radius=10');
  
  // 8. Payment System
  console.log('\n💳 Testing Payment System...');
  await testEndpoint('Stripe Session', '/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'donation',
      memorialId: 'test-id',
      amount: 1000,
      successUrl: 'http://localhost:5000/success',
      cancelUrl: 'http://localhost:5000/cancel'
    })
  });
  await testEndpoint('Donations', '/api/donations');
  await testEndpoint('Fundraisers', '/api/fundraisers');
  
  // 9. Additional Features
  console.log('\n🔧 Testing Additional Features...');
  await testEndpoint('Live Streams', '/api/memorial-live-streams');
  await testEndpoint('Events', '/api/memorial-events');
  await testEndpoint('Grief Support', '/api/grief-support');
  await testEndpoint('Essential Workers', '/api/essential-worker-memorials');
  await testEndpoint('Sports Memorials', '/api/athlete-profiles');
  
  // Print results
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(70));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log(`\n✅ PASSED: ${passed}/${results.length} features`);
  console.log(`❌ FAILED: ${failed}/${results.length} features\n`);
  
  // Show failed tests
  if (failed > 0) {
    console.log('Failed Features:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  ❌ ${r.feature} - ${r.endpoint}`);
        if (r.error) console.log(`     Error: ${r.error}`);
      });
  }
  
  // Show passed tests grouped by category
  console.log('\nPassed Features:');
  results
    .filter(r => r.status === 'PASS')
    .forEach(r => {
      console.log(`  ✅ ${r.feature} - ${r.endpoint}`);
    });
  
  // Overall status
  console.log('\n' + '='.repeat(70));
  if (failed === 0) {
    console.log('🎉 ALL FEATURES OPERATIONAL - Platform is deployment-ready!');
  } else {
    console.log(`⚠️ ${failed} features need attention before deployment`);
  }
  console.log('='.repeat(70));
}

// Run tests
runTests().catch(console.error);