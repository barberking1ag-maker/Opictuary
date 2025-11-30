# Opictuary Deployment Package
## Complete Technical Architecture & Scaling Guidelines

---

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         CDN Layer                           │
│                    (CloudFront/Cloudflare)                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                    Load Balancer (ALB)                      │
│                    Health Checks, SSL                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Frontend    │ │   Frontend    │ │   Frontend    │
│   (React)     │ │   (React)     │ │   (React)     │
│   Port 5000   │ │   Port 5000   │ │   Port 5000   │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   API Server  │ │   API Server  │ │   API Server  │
│   (Express)   │ │   (Express)   │ │   (Express)   │
│   Port 5000   │ │   Port 5000   │ │   Port 5000   │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
    ┌────────────┬────────┴────────┬────────────┐
    ▼            ▼                 ▼            ▼
┌────────┐ ┌──────────┐    ┌──────────┐ ┌────────────┐
│  Redis │ │PostgreSQL│    │    S3    │ │   Queue    │
│  Cache │ │ Primary  │    │  Storage │ │   (SQS)    │
└────────┘ └────┬─────┘    └──────────┘ └────────────┘
                │
         ┌──────┴─────┐
         │PostgreSQL  │
         │  Replica   │
         └────────────┘
```

---

## 💻 Technical Requirements

### Minimum Requirements (Development)
```yaml
System:
  OS: Linux (Ubuntu 20.04+ / Debian 11+)
  CPU: 2 cores
  RAM: 4GB
  Storage: 20GB SSD
  
Software:
  Node.js: 18.x or 20.x
  PostgreSQL: 14+
  Redis: 6+
  Nginx: 1.18+
```

### Recommended Requirements (Production)
```yaml
System:
  OS: Ubuntu 22.04 LTS
  CPU: 8 cores
  RAM: 16GB
  Storage: 100GB NVMe SSD
  
Software:
  Node.js: 20.x LTS
  PostgreSQL: 15+
  Redis: 7+
  Nginx: Latest stable
  Docker: 24+
  Kubernetes: 1.28+ (optional)
```

---

## 🚀 Deployment Options

### Option 1: Replit Deployment (Current)
```bash
# Already configured and running
# Auto-scaling, managed infrastructure
# Global CDN included
# SSL certificates managed

# Deployment command
git push origin main
# Automatic deployment via Replit
```

### Option 2: Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      NODE_ENV: production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: opictuary
      POSTGRES_USER: opictuary
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Option 3: Kubernetes Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opictuary
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: opictuary
  template:
    metadata:
      labels:
        app: opictuary
    spec:
      containers:
      - name: app
        image: opictuary/app:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: opictuary-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: opictuary-secrets
              key: redis-url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: opictuary-service
spec:
  selector:
    app: opictuary
  ports:
  - port: 80
    targetPort: 5000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: opictuary-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: opictuary
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Option 4: AWS Deployment
```bash
# Using AWS CDK
npm install -g aws-cdk
cdk init app --language typescript

# Deploy stack
cdk deploy OpictuaryStack
```

```typescript
// lib/opictuary-stack.ts
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as elasticache from '@aws-cdk/aws-elasticache';

export class OpictuaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    // VPC
    const vpc = new ec2.Vpc(this, 'OpictuaryVPC', {
      maxAzs: 3
    });

    // RDS PostgreSQL
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.LARGE
      ),
      vpc,
      multiAz: true,
      allocatedStorage: 100,
      storageEncrypted: true
    });

    // ElastiCache Redis
    const redis = new elasticache.CfnCacheCluster(this, 'Redis', {
      cacheNodeType: 'cache.t3.medium',
      engine: 'redis',
      numCacheNodes: 1
    });

    // ECS Fargate
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 2048,
      cpu: 1024
    });

    const container = taskDefinition.addContainer('opictuary', {
      image: ecs.ContainerImage.fromRegistry('opictuary/app:latest'),
      environment: {
        DATABASE_URL: database.instanceEndpoint.socketAddress,
        REDIS_URL: redis.attrRedisEndpointAddress
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'opictuary'
      })
    });

    container.addPortMappings({
      containerPort: 5000,
      protocol: ecs.Protocol.TCP
    });

    // Service with auto-scaling
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 3
    });

    const scaling = service.autoScaleTaskCount({
      minCapacity: 3,
      maxCapacity: 10
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80
    });
  }
}
```

---

## 📦 Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/opictuary
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Authentication
SESSION_SECRET=your_session_secret_min_32_chars
JWT_SECRET=your_jwt_secret

# OpenAI
OPENAI_API_KEY=sk-xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Opictuary <noreply@opictuary.com>"

# Storage
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
S3_BUCKET=opictuary-media

# Analytics
GOOGLE_ANALYTICS_ID=G-xxx
PLAUSIBLE_DOMAIN=opictuary.com

# Environment
NODE_ENV=production
PORT=5000
```

### Optional Variables
```bash
# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
NEW_RELIC_LICENSE_KEY=xxx

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_CELEBRITY_ESTATES=true
ENABLE_PRISON_ACCESS=false

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Caching
CACHE_TTL=3600
CDN_URL=https://cdn.opictuary.com
```

---

## 🔄 Database Setup

### Initial Setup
```bash
# Create database
createdb opictuary

# Run migrations
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### Schema Management
```typescript
// shared/schema.ts structure
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // ... other fields
});

export const memorials = pgTable('memorials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  // ... other fields
});

// Run schema sync
npm run db:push
```

### Backup Strategy
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Point-in-time recovery
pg_basebackup -D /backup/base -Fp -Xs -P

# Restore from backup
psql $DATABASE_URL < backup_20240101.sql
```

---

## 📈 Scaling Guidelines

### Horizontal Scaling
```yaml
Traffic Level | Instances | CPU | RAM  | Database
-------------|-----------|-----|------|----------
< 1K/day     | 1         | 2   | 4GB  | db.t3.small
1K-10K/day   | 2         | 4   | 8GB  | db.t3.medium
10K-100K/day | 3-5       | 8   | 16GB | db.t3.large
100K-1M/day  | 5-10      | 16  | 32GB | db.r6g.xlarge
> 1M/day     | 10+       | 32+ | 64GB+| db.r6g.2xlarge+
```

### Caching Strategy
```javascript
// Redis caching layers
const cacheLayers = {
  L1: {
    name: 'Memory Cache',
    ttl: 60, // seconds
    size: '100MB'
  },
  L2: {
    name: 'Redis Cache',
    ttl: 3600, // 1 hour
    size: '1GB'
  },
  L3: {
    name: 'CDN Cache',
    ttl: 86400, // 24 hours
    size: 'Unlimited'
  }
};
```

### Database Optimization
```sql
-- Essential indexes
CREATE INDEX idx_memorials_slug ON memorials(slug);
CREATE INDEX idx_memorials_user_id ON memorials(user_id);
CREATE INDEX idx_media_memorial_id ON media(memorial_id);
CREATE INDEX idx_tributes_memorial_id ON tributes(memorial_id);
CREATE INDEX idx_qr_scans_qr_id ON qr_scans(qr_id);

-- Partitioning for large tables
CREATE TABLE qr_scans_2024 PARTITION OF qr_scans
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## 🔐 Security Configuration

### SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name opictuary.com;

    ssl_certificate /etc/ssl/certs/opictuary.crt;
    ssl_certificate_key /etc/ssl/private/opictuary.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Rules
```bash
# UFW configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw allow 5432/tcp # PostgreSQL (restricted)
ufw allow 6379/tcp # Redis (restricted)
ufw enable
```

### Rate Limiting
```javascript
// Rate limiting configuration
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);
```

---

## 📊 Monitoring & Logging

### Health Checks
```javascript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

app.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});
```

### Logging Configuration
```javascript
// Winston logging
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'opictuary' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Metrics Collection
```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

---

## 🚨 Disaster Recovery

### Backup Plan
```yaml
Backup Schedule:
  Database:
    - Full: Daily at 2 AM UTC
    - Incremental: Every 6 hours
    - Retention: 30 days
  
  Media Files:
    - S3 versioning enabled
    - Cross-region replication
    - Lifecycle: Archive after 90 days
  
  Application:
    - Git repository
    - Docker images tagged
    - Configuration backed up
```

### Recovery Time Objectives
```yaml
RTO/RPO Targets:
  Critical (Payment/Auth): 
    RTO: 15 minutes
    RPO: 1 minute
  
  High (Memorial Data):
    RTO: 1 hour
    RPO: 15 minutes
  
  Medium (Media):
    RTO: 4 hours
    RPO: 1 hour
  
  Low (Analytics):
    RTO: 24 hours
    RPO: 24 hours
```

### Failover Process
```bash
# Automated failover script
#!/bin/bash

# 1. Health check primary
if ! curl -f https://primary.opictuary.com/health; then
  # 2. Promote replica
  pg_ctl promote -D /var/lib/postgresql/data
  
  # 3. Update DNS
  aws route53 change-resource-record-sets \
    --hosted-zone-id Z123456 \
    --change-batch file://failover-dns.json
  
  # 4. Clear cache
  redis-cli FLUSHALL
  
  # 5. Notify team
  curl -X POST https://hooks.slack.com/xxx \
    -d '{"text":"Failover initiated to secondary region"}'
fi
```

---

## 🔧 Maintenance

### Rolling Updates
```bash
# Zero-downtime deployment
kubectl set image deployment/opictuary \
  opictuary=opictuary/app:v2.0.0 \
  --record

# Monitor rollout
kubectl rollout status deployment/opictuary

# Rollback if needed
kubectl rollout undo deployment/opictuary
```

### Database Maintenance
```sql
-- Regular maintenance tasks
VACUUM ANALYZE memorials;
REINDEX INDEX idx_memorials_slug;
ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Code review completed
- [ ] Tests passing (unit, integration, e2e)
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Database migrations tested
- [ ] Rollback plan prepared

### Deployment
- [ ] Backup current state
- [ ] Update environment variables
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor metrics
- [ ] Verify health checks

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Document any issues

---

## 🆘 Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Check memory usage
free -h
ps aux | sort -rn -k 4 | head

# Node.js memory settings
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

#### Database Connection Issues
```bash
# Check connections
SELECT count(*) FROM pg_stat_activity;

# Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' AND state_change < NOW() - INTERVAL '10 minutes';
```

#### Redis Issues
```bash
# Check Redis status
redis-cli ping
redis-cli info stats

# Clear cache if needed
redis-cli FLUSHDB
```

---

## 📞 Support Contacts

### Technical Support
- **DevOps Team**: devops@opictuary.com
- **On-Call**: +1-800-MEMORIAL
- **Slack**: #ops-alerts

### Escalation Path
1. L1 Support: Monitor alerts
2. L2 DevOps: System issues
3. L3 Engineering: Application bugs
4. Management: Critical incidents

---

*© 2024 Opictuary. Deployment Package v2.0*
*Last updated: December 2024*