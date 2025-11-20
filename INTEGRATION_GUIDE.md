# Opictuary Integration Guide
## Complete Implementation Guide for Partners & White-Label Deployments

---

## 🚀 Quick Start Guide

### Step 1: Choose Your Integration Type
```
┌─────────────────────┐
│   Integration Type  │
├─────────────────────┤
│ 1. API Integration  │──► For adding memorial features to your existing platform
│ 2. White-Label      │──► Complete rebrandable memorial platform
│ 3. Plugin/Widget    │──► Embed memorial features on your website
│ 4. Enterprise       │──► Custom deployment with dedicated infrastructure
└─────────────────────┘
```

### Step 2: Get Credentials
```bash
# Request API credentials
curl -X POST https://api.opictuary.com/partners/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Your Company",
    "integrationType": "api",
    "email": "tech@yourcompany.com"
  }'

# Response
{
  "apiKey": "pk_live_xxx",
  "secretKey": "sk_live_xxx",
  "webhookSecret": "whsec_xxx",
  "sandboxUrl": "https://sandbox.opictuary.com"
}
```

### Step 3: Test Integration
```javascript
// Quick test
const response = await fetch('https://sandbox.opictuary.com/api/health', {
  headers: {
    'Authorization': 'Bearer pk_live_xxx'
  }
});

console.log(await response.json());
// { status: "healthy", version: "2.0.0" }
```

---

## 🔌 API Integration

### Installation

#### Node.js/JavaScript
```bash
npm install @opictuary/sdk
```

```javascript
import { OpictuarySDK } from '@opictuary/sdk';

const opictuary = new OpictuarySDK({
  apiKey: process.env.OPICTUARY_API_KEY,
  environment: 'production' // or 'sandbox'
});

// Create a memorial
const memorial = await opictuary.memorials.create({
  name: 'John Doe',
  birthDate: '1950-01-15',
  deathDate: '2024-01-10',
  biography: 'Loving father and husband...'
});

// Upload media
await opictuary.media.upload(memorial.id, {
  file: photoBuffer,
  caption: 'Summer vacation 2023'
});
```

#### Python
```bash
pip install opictuary
```

```python
from opictuary import OpictuaryClient

client = OpictuaryClient(
    api_key=os.environ['OPICTUARY_API_KEY'],
    environment='production'
)

# Create memorial with AI features
memorial = client.memorials.create(
    name='Jane Smith',
    birth_date='1945-03-20',
    death_date='2024-02-15'
)

# Generate AI memorial card
ai_card = client.ai.generate_memorial_card(
    memorial_id=memorial.id,
    prompt='Peaceful sunset with flying doves',
    style='watercolor'
)
```

#### PHP
```bash
composer require opictuary/php-sdk
```

```php
use Opictuary\Client;

$client = new Client([
    'apiKey' => $_ENV['OPICTUARY_API_KEY'],
    'environment' => 'production'
]);

// Create and customize memorial
$memorial = $client->memorials->create([
    'name' => 'Robert Johnson',
    'birthDate' => '1960-05-10',
    'deathDate' => '2024-03-01'
]);

// Order physical product
$order = $client->products->order([
    'memorialId' => $memorial->id,
    'productId' => 'prod_plaque_001',
    'customization' => [
        'text' => 'In Loving Memory',
        'font' => 'script'
    ]
]);
```

### Authentication Methods

#### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
```

#### OAuth 2.0 Flow
```javascript
// Step 1: Redirect to authorization
const authUrl = `https://auth.opictuary.com/oauth/authorize?
  client_id=${CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=code&
  scope=memorials.read memorials.write`;

// Step 2: Exchange code for token
const tokenResponse = await fetch('https://auth.opictuary.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  })
});

const { access_token } = await tokenResponse.json();
```

#### JWT Authentication (Enterprise)
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    iss: 'your-company',
    sub: 'user-123',
    aud: 'opictuary',
    exp: Math.floor(Date.now() / 1000) + 3600
  },
  SHARED_SECRET,
  { algorithm: 'HS256' }
);

// Use token
fetch('https://api.opictuary.com/api/memorials', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎨 White-Label Deployment

### Setup Process

#### Step 1: Configuration
```javascript
// config/whitelabel.json
{
  "branding": {
    "companyName": "Your Memorial Service",
    "logo": "https://your-domain.com/logo.png",
    "primaryColor": "#1a73e8",
    "secondaryColor": "#f8f9fa",
    "favicon": "https://your-domain.com/favicon.ico"
  },
  "domain": {
    "subdomain": "memorials.your-domain.com",
    "customDomain": true,
    "ssl": "auto"
  },
  "features": {
    "aiDesigner": true,
    "physicalProducts": true,
    "celebrityMemorials": false,
    "prisonAccess": false,
    "customFeatures": ["feature1", "feature2"]
  },
  "pricing": {
    "platformFee": 3.5,
    "aiDesignFee": 12.99,
    "productMarkup": 1.25
  }
}
```

#### Step 2: Theme Customization
```css
/* theme.css - Custom styling */
:root {
  --primary-color: #1a73e8;
  --secondary-color: #f8f9fa;
  --text-primary: #202124;
  --text-secondary: #5f6368;
  --border-color: #dadce0;
  --shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Override default components */
.memorial-card {
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.memorial-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}
```

#### Step 3: Deploy
```bash
# Using Docker
docker run -d \
  --name opictuary-whitelabel \
  -e API_KEY=your_api_key \
  -e CONFIG_PATH=/config/whitelabel.json \
  -v $(pwd)/config:/config \
  -p 80:5000 \
  opictuary/whitelabel:latest

# Using Kubernetes
kubectl apply -f opictuary-whitelabel.yaml
```

### White-Label Features

#### Complete Rebranding
- Custom logo and favicon
- Brand colors throughout
- Custom email templates
- Branded QR codes
- Custom domain with SSL

#### Feature Control
```javascript
// Enable/disable features
const features = {
  core: {
    memorials: true,
    galleries: true,
    tributes: true
  },
  premium: {
    aiDesigner: true,
    futureMessages: true,
    qrCodes: true
  },
  enterprise: {
    celebrityEstates: false,
    prisonAccess: false,
    alumniMemorials: true
  }
};
```

#### Revenue Sharing
```javascript
// Configure revenue split
const revenueConfig = {
  platformFees: {
    yourShare: 70,  // 70% to you
    opictuaryShare: 30  // 30% to Opictuary
  },
  productSales: {
    yourMarkup: 25,  // 25% markup on products
    basePrice: 'wholesale'
  },
  aiServices: {
    yourPrice: 19.99,  // You charge customers
    ourCost: 10.00     // You pay us
  }
};
```

---

## 🧩 Widget Integration

### Memorial Widget
```html
<!-- Basic memorial widget -->
<div id="opictuary-memorial" 
     data-memorial-id="mem_123"
     data-theme="light"
     data-features="gallery,tributes">
</div>

<script src="https://cdn.opictuary.com/widget/v2/memorial.js"></script>
<script>
  Opictuary.init({
    apiKey: 'YOUR_API_KEY',
    container: '#opictuary-memorial'
  });
</script>
```

### QR Code Scanner Widget
```html
<!-- QR scanner for mobile apps -->
<div id="qr-scanner"></div>

<script>
  OpictuaryQR.scanner({
    container: '#qr-scanner',
    onScan: (memorialId) => {
      // Handle scanned memorial
      window.location.href = `/memorial/${memorialId}`;
    },
    analytics: true
  });
</script>
```

### Memorial Creation Form
```html
<!-- Embedded creation form -->
<iframe 
  src="https://embed.opictuary.com/create?api_key=YOUR_KEY"
  width="100%"
  height="800"
  frameborder="0">
</iframe>
```

---

## 🏢 Enterprise Integration

### Private Cloud Deployment

#### System Requirements
```yaml
# Minimum requirements
compute:
  nodes: 3
  cpu: 8 cores per node
  ram: 16GB per node
  storage: 500GB SSD per node

database:
  type: PostgreSQL 14+
  replicas: 2
  storage: 1TB

cache:
  type: Redis 6+
  memory: 4GB

cdn:
  provider: CloudFront/Cloudflare
  locations: Global
```

#### Deployment Architecture
```
┌─────────────────────────────────────────┐
│           Load Balancer (HA)            │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Web 1  │ │  Web 2  │ │  Web 3  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  API 1  │ │  API 2  │ │  API 3  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
    ┌─────────┐     ┌─────────┐
    │  DB Primary │ │ DB Replica │
    └─────────┘     └─────────┘
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opictuary-enterprise
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
        image: opictuary/enterprise:latest
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
        ports:
        - containerPort: 5000
        resources:
          requests:
            memory: "2Gi"
            cpu: "1"
          limits:
            memory: "4Gi"
            cpu: "2"
```

### Custom Integrations

#### CRM Integration
```javascript
// Salesforce integration example
import { OpictuaryClient } from '@opictuary/enterprise';
import jsforce from 'jsforce';

const opictuary = new OpictuaryClient({ apiKey: API_KEY });
const salesforce = new jsforce.Connection({ loginUrl: SF_URL });

// Sync memorial to Salesforce
async function syncMemorialToCRM(memorial) {
  await salesforce.login(SF_USER, SF_PASS);
  
  // Create custom object
  await salesforce.sobject('Memorial__c').create({
    Name: memorial.name,
    Birth_Date__c: memorial.birthDate,
    Death_Date__c: memorial.deathDate,
    Memorial_URL__c: memorial.publicUrl,
    QR_Code__c: memorial.qrCode
  });
  
  // Create activity
  await salesforce.sobject('Task').create({
    Subject: `Memorial created for ${memorial.name}`,
    Status: 'Completed',
    Priority: 'Normal'
  });
}
```

#### ERP Integration
```javascript
// SAP integration for product orders
async function syncOrderToSAP(order) {
  const sapOrder = {
    orderNumber: order.orderNumber,
    customer: order.userId,
    items: order.items.map(item => ({
      material: item.productId,
      quantity: item.quantity,
      price: item.price
    })),
    shipping: order.shippingAddress
  };
  
  await sapClient.createSalesOrder(sapOrder);
}
```

---

## 🔒 Security Best Practices

### API Security
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: 'Too many requests'
});

app.use('/api/', limiter);

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/memorial',
  body('name').isLength({ min: 1, max: 100 }),
  body('birthDate').isISO8601(),
  body('biography').escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

### Data Encryption
```javascript
// Encrypt sensitive data
const crypto = require('crypto');

function encrypt(text) {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}
```

### Webhook Security
```javascript
// Verify webhook signatures
function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  const expectedSignature = `sha256=${digest}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-opictuary-signature'];
  
  if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
});
```

---

## 📊 Monitoring & Analytics

### Integration Metrics
```javascript
// Track API usage
const metrics = {
  requests: new Counter('api_requests_total'),
  latency: new Histogram('api_latency_seconds'),
  errors: new Counter('api_errors_total')
};

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    metrics.requests.inc({ method: req.method, path: req.path });
    metrics.latency.observe((Date.now() - start) / 1000);
    
    if (res.statusCode >= 400) {
      metrics.errors.inc({ code: res.statusCode });
    }
  });
  
  next();
});
```

### Logging
```javascript
// Structured logging
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log API calls
app.use((req, res, next) => {
  logger.info({
    type: 'api_request',
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
});
```

---

## 🧪 Testing

### Sandbox Environment
```javascript
// Test environment configuration
const config = {
  sandbox: {
    apiUrl: 'https://sandbox.opictuary.com/api',
    apiKey: 'test_key_xxx',
    webhookUrl: 'https://webhook.site/unique-url'
  },
  testData: {
    memorial: 'test_memorial_123',
    product: 'test_product_456',
    qrCode: 'test_qr_789'
  }
};
```

### Integration Tests
```javascript
// Jest test example
describe('Opictuary Integration', () => {
  test('Create memorial', async () => {
    const memorial = await client.memorials.create({
      name: 'Test Memorial',
      birthDate: '1950-01-01',
      deathDate: '2024-01-01'
    });
    
    expect(memorial).toHaveProperty('id');
    expect(memorial.name).toBe('Test Memorial');
  });
  
  test('Upload media', async () => {
    const media = await client.media.upload(
      'test_memorial_123',
      Buffer.from('test image data')
    );
    
    expect(media).toHaveProperty('url');
    expect(media.type).toBe('photo');
  });
});
```

---

## 📚 Resources

### Documentation
- **API Reference**: [docs.opictuary.com/api](https://docs.opictuary.com/api)
- **SDK Documentation**: [docs.opictuary.com/sdk](https://docs.opictuary.com/sdk)
- **Integration Examples**: [github.com/opictuary/examples](https://github.com/opictuary/examples)
- **Postman Collection**: [postman.com/opictuary](https://postman.com/opictuary)

### Support Channels
- **Developer Forum**: [forum.opictuary.com](https://forum.opictuary.com)
- **Discord**: [discord.gg/opictuary](https://discord.gg/opictuary)
- **Stack Overflow**: Tag `[opictuary]`
- **Email**: developers@opictuary.com

### Tools & Libraries
- **API Explorer**: [explorer.opictuary.com](https://explorer.opictuary.com)
- **Webhook Tester**: [webhooks.opictuary.com](https://webhooks.opictuary.com)
- **Status Page**: [status.opictuary.com](https://status.opictuary.com)
- **Change Log**: [changelog.opictuary.com](https://changelog.opictuary.com)

---

## 🤝 Partnership Program

### Benefits
- **Revenue Sharing**: Up to 70% commission
- **Technical Support**: Dedicated integration team
- **Marketing Support**: Co-marketing opportunities
- **Early Access**: Beta features and APIs
- **Training**: Quarterly partner workshops

### Requirements
- Minimum 10 memorials/month
- Technical integration completed
- Customer support SLA adherence
- Brand guidelines compliance

### Apply
Email: partners@opictuary.com

---

*© 2024 Opictuary. Integration Guide v2.0*
*Last updated: December 2024*