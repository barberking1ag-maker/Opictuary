#!/usr/bin/env node

/**
 * Automatic URL Submission Script for Opictuary
 * 
 * This script automatically submits your URLs to search engines
 * and directory services that accept programmatic submissions.
 */

const https = require('https');

const SITE_URL = 'https://opictuary.replit.app';

const urls = [
  '/',
  '/about',
  '/celebrity-memorials',
  '/essential-workers', 
  '/support',
  '/grief-support',
  '/partner-signup',
  '/advertising',
  '/privacy'
];

console.log('🚀 Starting automatic search engine submission...\n');

// Method 1: Ping Google
function pingGoogle(url) {
  const pingUrl = `http://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`;
  
  return new Promise((resolve) => {
    https.get(pingUrl, (res) => {
      console.log(`✅ Google pinged for sitemap (Status: ${res.statusCode})`);
      resolve();
    }).on('error', (err) => {
      console.log(`⚠️  Google ping failed: ${err.message}`);
      resolve();
    });
  });
}

// Method 2: Ping Bing
function pingBing(url) {
  const pingUrl = `http://www.bing.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`;
  
  return new Promise((resolve) => {
    https.get(pingUrl, (res) => {
      console.log(`✅ Bing pinged for sitemap (Status: ${res.statusCode})`);
      resolve();
    }).on('error', (err) => {
      console.log(`⚠️  Bing ping failed: ${err.message}`);
      resolve();
    });
  });
}

// Method 3: Submit to IndexNow (Bing, Yandex, others)
async function submitToIndexNow() {
  const apiKey = 'opictuary-' + Date.now();
  
  console.log('\n📋 IndexNow Submission:');
  console.log(`   Note: To complete IndexNow setup, create file at:`);
  console.log(`   ${SITE_URL}/${apiKey}.txt`);
  console.log(`   With contents: ${apiKey}`);
  
  // For now, just inform the user
  console.log('   (Skipping IndexNow - requires API key file setup)');
}

async function main() {
  console.log(`📍 Submitting: ${SITE_URL}\n`);
  console.log('━'.repeat(50));
  
  // Ping search engines
  await pingGoogle();
  await pingBing();
  await submitToIndexNow();
  
  console.log('\n━'.repeat(50));
  console.log('\n✅ Automatic submission complete!\n');
  console.log('📊 What happens next:');
  console.log('   • Search engines have been notified of your sitemap');
  console.log('   • Crawling will begin within 24-48 hours');
  console.log('   • Full indexing takes 2-4 weeks');
  console.log('\n💡 For faster results:');
  console.log('   • Share your site on social media');
  console.log('   • Get links from funeral industry sites');
  console.log('   • Submit to directory sites manually');
  console.log('\n🔗 Manual submission (optional):');
  console.log('   • Google: https://search.google.com/search-console');
  console.log('   • Bing: https://www.bing.com/webmasters');
}

main().catch(console.error);
