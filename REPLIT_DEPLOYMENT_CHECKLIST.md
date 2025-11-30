# REPLIT DEPLOYMENT CHECKLIST FOR OPICTUARY
**Version:** 1.0.0  
**Date:** November 14, 2025  
**Platform:** Replit Production Environment

---

## 🚀 PRE-DEPLOYMENT CHECKLIST

### Critical Requirements Status
- [ ] **Authentication System** - Configure Replit Auth
- [ ] **Payment Processing** - Add Stripe keys
- [ ] **Database** - Verify PostgreSQL connection
- [ ] **Custom Domain** - Setup opictuary.com
- [ ] **SSL Certificate** - Verify HTTPS
- [ ] **Environment Variables** - All required vars set
- [ ] **Backup Strategy** - Database backups configured
- [ ] **Error Monitoring** - Sentry or similar setup

---

## 🔑 REQUIRED ENVIRONMENT VARIABLES

### Authentication (CRITICAL - Currently Missing)
```bash
# Replit Authentication - MUST SET BEFORE DEPLOYMENT
REPLIT_AUTH_CLIENT_ID=your_client_id_here
REPLIT_AUTH_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=generate_random_32_char_string_here

# Example values:
# REPLIT_AUTH_CLIENT_ID=repl_auth_ABC123XYZ
# REPLIT_AUTH_CLIENT_SECRET=repl_secret_DEF456UVW789
# SESSION_SECRET=xK9mN2pQ8rS5tW6vY3zA7bC4dE1fG0hJ
```

### Payment Processing (HIGH PRIORITY)
```bash
# Stripe Configuration - Required for all monetization
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Example test values (replace with production keys):
# STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijk
# STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijk
# STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijk
```

### Database Configuration (Already Set)
```bash
# PostgreSQL (Neon) - VERIFY CONNECTION
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=5000
```

### AI & Analytics (OPTIONAL but Recommended)
```bash
# OpenAI Integration
OPENAI_API_KEY=sk-proj-your_openai_key_here

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Plausible Analytics (Alternative)
PLAUSIBLE_DOMAIN=opictuary.com
```

### Email Services (REQUIRED for notifications)
```bash
# SendGrid or similar
SENDGRID_API_KEY=SG.your_sendgrid_key_here
FROM_EMAIL=noreply@opictuary.com
SUPPORT_EMAIL=support@opictuary.com
```

### Application Settings
```bash
# Production Configuration
NODE_ENV=production
PORT=5000
APP_URL=https://opictuary.com
API_URL=https://opictuary.com/api

# Feature Flags
ENABLE_PRISON_ACCESS=true
ENABLE_CELEBRITY_MEMORIALS=true
ENABLE_FUNDRAISING=true
ENABLE_AI_SUPPORT=false  # Set true when OpenAI configured

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Configuration
```bash
# CORS Settings
ALLOWED_ORIGINS=https://opictuary.com,https://www.opictuary.com
ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
ALLOWED_HEADERS=Content-Type,Authorization

# Security Headers
HELMET_CSP_DIRECTIVES=default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
X_FRAME_OPTIONS=DENY
X_CONTENT_TYPE_OPTIONS=nosniff
```

---

## 🗄️ DATABASE CONFIGURATION STEPS

### 1. Verify Database Connection
```bash
# Test connection from Replit shell
npm run db:test

# Expected output:
# ✓ Database connected successfully
# ✓ All tables present
# ✓ Test query executed
```

### 2. Run Production Migrations
```bash
# Apply all pending migrations
npm run db:migrate:prod

# Verify migration status
npm run db:status
```

### 3. Setup Automated Backups
```bash
# Configure daily backups (add to .replit file)
[nix]
channel = "stable-24_05"

[deployment]
run = ["sh", "-c", "npm run start:prod"]

[env]
BACKUP_SCHEDULE = "0 2 * * *"  # 2 AM daily

# Create backup script
echo '#!/bin/bash
pg_dump $DATABASE_URL > backups/backup_$(date +%Y%m%d_%H%M%S).sql
find backups -name "*.sql" -mtime +7 -delete' > scripts/backup.sh

chmod +x scripts/backup.sh
```

### 4. Database Optimization
```sql
-- Run these optimizations in production database
-- Create indexes for common queries
CREATE INDEX idx_memorials_public ON memorials(is_public) WHERE is_public = true;
CREATE INDEX idx_memories_memorial ON memories(memorial_id);
CREATE INDEX idx_reactions_memory ON reactions(memory_id);
CREATE INDEX idx_users_email ON users(email);

-- Update statistics
ANALYZE;

-- Configure connection pooling
ALTER DATABASE opictuary SET statement_timeout = '30s';
ALTER DATABASE opictuary SET lock_timeout = '10s';
```

---

## 🔧 BUILD OPTIMIZATION COMMANDS

### 1. Production Build
```bash
# Install production dependencies only
npm ci --production

# Build frontend with optimizations
npm run build:prod

# Minify and optimize assets
npm run optimize:assets
```

### 2. Asset Optimization Script
Create `scripts/optimize.sh`:
```bash
#!/bin/bash
# Compress images
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -exec jpegoptim --strip-all {} \;

# Minify CSS/JS
npx terser dist/public/assets/*.js -o dist/public/assets/
npx cssnano dist/public/assets/*.css dist/public/assets/

# Generate critical CSS
npx critical dist/public/index.html --base dist/public --inline > dist/public/index.critical.html
mv dist/public/index.critical.html dist/public/index.html

# Compress with Brotli
find dist/public -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec brotli {} \;
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Generate bundle report
npx webpack-bundle-analyzer dist/stats.json
```

---

## 🔒 SSL AND DOMAIN SETUP

### 1. Configure Custom Domain in Replit
1. Go to Replit Workspace Settings
2. Click "Domain Linking"
3. Add `opictuary.com` and `www.opictuary.com`
4. Update DNS records at your registrar:
   ```
   Type: A
   Name: @
   Value: [Replit IP provided]
   TTL: 300
   
   Type: CNAME
   Name: www
   Value: opictuary.com
   TTL: 300
   ```

### 2. SSL Certificate Configuration
```bash
# Replit handles SSL automatically, but verify:
curl -I https://opictuary.com

# Should see:
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubDomains
```

### 3. Force HTTPS Redirect
Add to `server/index.ts`:
```typescript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

---

## 📊 PRODUCTION MONITORING SETUP

### 1. Application Performance Monitoring
```bash
# Install monitoring dependencies
npm install @sentry/node @sentry/react

# Configure Sentry
SENTRY_DSN=https://your_key@sentry.io/project_id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 2. Setup Health Checks
Create `server/health.ts`:
```typescript
export const healthCheck = async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {
      database: 'pending',
      redis: 'pending',
      stripe: 'pending'
    }
  };

  // Check database
  try {
    await db.query('SELECT 1');
    health.checks.database = 'healthy';
  } catch (e) {
    health.checks.database = 'unhealthy';
    health.status = 'DEGRADED';
  }

  // Check Stripe
  try {
    await stripe.balance.retrieve();
    health.checks.stripe = 'healthy';
  } catch (e) {
    health.checks.stripe = 'unhealthy';
  }

  res.status(health.status === 'OK' ? 200 : 503).json(health);
};
```

### 3. Setup Uptime Monitoring
```bash
# Configure uptime monitoring services
# Add these endpoints to your monitoring service:

# Primary health check
https://opictuary.com/api/health

# Database health
https://opictuary.com/api/health/db

# Payment system health
https://opictuary.com/api/health/payments

# Set alert thresholds:
# Response time > 2 seconds
# Error rate > 1%
# Uptime < 99.9%
```

### 4. Log Aggregation
```bash
# Configure structured logging
npm install winston winston-daily-rotate-file

# Set log levels
LOG_LEVEL=info  # debug, info, warn, error
LOG_DIR=/tmp/logs
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Core Functionality Tests
```bash
# Run production smoke tests
npm run test:smoke

# Test checklist:
✓ Homepage loads within 2 seconds
✓ User can create account
✓ User can login
✓ Memorial creation works
✓ Photo upload successful
✓ Payment processing works
✓ QR code generation works
✓ Mobile responsive
```

### 2. Performance Verification
```bash
# Run Lighthouse audit
npx lighthouse https://opictuary.com --output html --output-path ./lighthouse-report.html

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 90
# SEO: > 95
```

### 3. Security Scan
```bash
# Run security audit
npm audit --production

# Check security headers
curl -I https://opictuary.com | grep -i security

# Verify CSP headers
curl -I https://opictuary.com | grep -i content-security-policy
```

### 4. Database Performance
```sql
-- Check slow queries
SELECT query, calls, mean_exec_time, total_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check connection count
SELECT count(*) FROM pg_stat_activity;
```

---

## 🛡️ SECURITY HARDENING CHECKLIST

### Application Security
- [ ] All environment variables moved to secrets
- [ ] Session secrets rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] File upload restrictions enforced
- [ ] API authentication required

### Infrastructure Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Database encrypted at rest
- [ ] Backups encrypted
- [ ] Monitoring alerts configured
- [ ] DDoS protection enabled
- [ ] WAF rules configured
- [ ] Regular security updates scheduled

### Compliance & Privacy
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent implemented
- [ ] GDPR compliance verified
- [ ] Data retention policies set
- [ ] User data export available
- [ ] Account deletion process works

---

## 🚨 EMERGENCY ROLLBACK PROCEDURE

### Quick Rollback Steps
```bash
# 1. Create backup of current state
pg_dump $DATABASE_URL > emergency_backup_$(date +%s).sql

# 2. Switch to previous deployment
replit deployments rollback

# 3. Verify rollback
curl https://opictuary.com/api/health

# 4. Restore database if needed
psql $DATABASE_URL < last_known_good_backup.sql

# 5. Clear cache
npm run cache:clear

# 6. Notify team
echo "Rollback completed at $(date)" | mail -s "Production Rollback" team@opictuary.com
```

### Rollback Decision Matrix
| Issue | Severity | Action | Rollback? |
|-------|----------|--------|-----------|
| Payment failure | CRITICAL | Immediate fix | Yes if >15 min |
| Auth broken | CRITICAL | Immediate fix | Yes |
| Slow performance | HIGH | Scale resources | No |
| Feature bug | MEDIUM | Hotfix | No |
| UI issue | LOW | Schedule fix | No |

---

## 📞 SUPPORT CONTACTS

### Critical Issues (24/7)
- **Infrastructure:** Replit Support Dashboard
- **Database:** Neon Support Portal
- **Payments:** Stripe Support (Priority)
- **Domain/DNS:** Registrar Support

### Escalation Path
1. **Level 1:** On-call developer
2. **Level 2:** Technical lead
3. **Level 3:** CTO/Founder
4. **Level 4:** External consultants

### Monitoring Dashboards
- **Application:** https://opictuary.com/admin/dashboard
- **Database:** Neon Dashboard
- **Payments:** Stripe Dashboard
- **Analytics:** Google Analytics
- **Errors:** Sentry Dashboard
- **Uptime:** StatusPage

---

## ✅ FINAL DEPLOYMENT SIGN-OFF

### Pre-Launch Checklist
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Smoke tests passed
- [ ] Rollback procedure tested
- [ ] Team notified

### Go-Live Approval
- **Technical Lead:** _________________ Date: _______
- **Security Review:** ________________ Date: _______
- **Business Owner:** _________________ Date: _______

### Post-Launch Tasks (First 48 Hours)
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Verify payment processing
- [ ] Check backup completion
- [ ] Review security logs
- [ ] Update documentation
- [ ] Schedule retrospective

---

**Document Version:** 1.0.0  
**Last Updated:** November 14, 2025  
**Next Review:** November 21, 2025