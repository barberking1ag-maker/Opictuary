# Opictuary API Documentation
## RESTful API Reference for Memorial Tech Suite

### Base URL
```
Production: https://api.opictuary.com
Staging: https://staging-api.opictuary.com
Development: http://localhost:5000
```

### Authentication
All API requests require authentication using session-based cookies or API keys for enterprise clients.

```http
Cookie: session_id=xxx
# OR
Authorization: Bearer YOUR_API_KEY
```

---

## 📝 Memorial Management APIs

### Create Memorial
```http
POST /api/memorials
Content-Type: application/json

{
  "name": "John Doe",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-10",
  "biography": "Loving father and husband...",
  "isPublic": false,
  "inviteCode": "MEMORIAL123"
}

Response: 201 Created
{
  "id": "mem_123",
  "slug": "john-doe-1950",
  "qrCodeUrl": "https://api.opictuary.com/qr/mem_123.png"
}
```

### Get Memorial
```http
GET /api/memorials/:slug
Authorization: Bearer YOUR_API_KEY

Response: 200 OK
{
  "id": "mem_123",
  "name": "John Doe",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-10",
  "biography": "...",
  "photoCount": 45,
  "videoCount": 12,
  "tributeCount": 89,
  "viewCount": 1234
}
```

### Update Memorial
```http
PATCH /api/memorials/:id
Content-Type: application/json

{
  "biography": "Updated biography...",
  "isPublic": true
}

Response: 200 OK
```

### Delete Memorial
```http
DELETE /api/memorials/:id

Response: 204 No Content
```

---

## 🖼️ Media Management APIs

### Upload Photo/Video
```http
POST /api/memorials/:memorialId/media
Content-Type: multipart/form-data

file: [binary]
caption: "Family gathering 2023"
tags: ["family", "celebration"]

Response: 201 Created
{
  "id": "media_456",
  "type": "photo",
  "url": "https://cdn.opictuary.com/media/456.jpg",
  "thumbnailUrl": "https://cdn.opictuary.com/thumbs/456.jpg"
}
```

### Get Media Gallery
```http
GET /api/memorials/:memorialId/media?page=1&limit=20&type=photo

Response: 200 OK
{
  "items": [...],
  "total": 145,
  "page": 1,
  "pages": 8
}
```

### React to Media
```http
POST /api/media/:mediaId/react
Content-Type: application/json

{
  "reaction": "heart"
}

Response: 200 OK
{
  "reactionCount": 45
}
```

---

## 🤖 AI Services APIs

### Generate AI Memorial Card
```http
POST /api/products/generate-ai-design
Content-Type: application/json

{
  "prompt": "peaceful sunset over mountains with doves",
  "style": "watercolor",
  "orderId": "order_789"
}

Response: 200 OK
{
  "imageUrl": "https://cdn.opictuary.com/ai/generated_123.png",
  "cost": 15.00,
  "style": "watercolor",
  "moderationPassed": true
}
```

### Generate Celebrity Content
```http
POST /api/celebrity/generate-content
Content-Type: application/json

{
  "estateId": "estate_123",
  "contentType": "novel",
  "parameters": {
    "genre": "mystery",
    "length": "full",
    "style": "classic"
  }
}

Response: 202 Accepted
{
  "jobId": "job_456",
  "estimatedTime": 3600,
  "status": "processing",
  "webhookUrl": "https://your-domain.com/webhook"
}
```

### Check Generation Status
```http
GET /api/celebrity/jobs/:jobId

Response: 200 OK
{
  "status": "completed",
  "result": {
    "contentUrl": "https://cdn.opictuary.com/generated/novel_123.pdf",
    "metadata": {...},
    "qualityScore": 0.92
  }
}
```

---

## 🛍️ E-Commerce APIs

### Get Products
```http
GET /api/products?category=memorial-plaques&sort=price_asc

Response: 200 OK
{
  "products": [
    {
      "id": "prod_123",
      "name": "Classic Memorial Plaque",
      "basePrice": 89.99,
      "category": "memorial-plaques",
      "customizationOptions": {...},
      "images": [...]
    }
  ],
  "total": 24
}
```

### Create Order
```http
POST /api/products/orders
Content-Type: application/json

{
  "memorialId": "mem_123",
  "productId": "prod_456",
  "quantity": 1,
  "customization": {
    "text": "In Loving Memory",
    "font": "script",
    "material": "bronze"
  },
  "shippingAddress": {
    "name": "Jane Doe",
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "zip": "02134",
    "country": "USA"
  }
}

Response: 201 Created
{
  "orderId": "order_789",
  "orderNumber": "OP-2024-0145",
  "total": 124.99,
  "qrCodeId": "qr_456"
}
```

### Process Payment
```http
POST /api/products/orders/:orderId/pay
Content-Type: application/json

{
  "paymentMethodId": "pm_stripe_123"
}

Response: 200 OK
{
  "status": "paid",
  "receiptUrl": "https://receipt.stripe.com/...",
  "trackingNumber": "1Z999AA1012345678"
}
```

---

## 📅 Future Messages APIs

### Schedule Message
```http
POST /api/future-messages
Content-Type: application/json

{
  "memorialId": "mem_123",
  "recipientEmail": "family@example.com",
  "subject": "Happy Birthday from Dad",
  "message": "Wishing you joy on your special day...",
  "deliveryDate": "2025-06-15",
  "eventType": "birthday",
  "isRecurring": true,
  "attachments": ["media_123", "media_456"]
}

Response: 201 Created
{
  "messageId": "msg_789",
  "status": "scheduled",
  "nextDelivery": "2025-06-15T12:00:00Z"
}
```

### Get Scheduled Messages
```http
GET /api/future-messages?memorialId=mem_123

Response: 200 OK
{
  "messages": [...],
  "total": 12
}
```

### Cancel Message
```http
DELETE /api/future-messages/:messageId

Response: 204 No Content
```

---

## 📊 QR Code Analytics APIs

### Track QR Scan
```http
POST /api/qr/:qrId/scan
Content-Type: application/json

{
  "location": {
    "latitude": 42.3601,
    "longitude": -71.0589
  },
  "device": "mobile",
  "browser": "safari",
  "referrer": "cemetery_visit"
}

Response: 200 OK
{
  "redirectUrl": "https://opictuary.com/m/john-doe-1950",
  "scanCount": 234
}
```

### Get QR Analytics
```http
GET /api/qr/:qrId/analytics?period=30d

Response: 200 OK
{
  "totalScans": 456,
  "uniqueVisitors": 123,
  "locations": [...],
  "devices": {...},
  "timeDistribution": {...}
}
```

---

## 🎓 Alumni Memorial APIs

### Create Alumni Memorial
```http
POST /api/alumni-memorials
Content-Type: application/json

{
  "memorialId": "mem_123",
  "schoolName": "Harvard University",
  "graduationYear": 1975,
  "degree": "PhD",
  "major": "Physics",
  "activities": ["Chess Club", "Dean's List"],
  "achievements": ["Nobel Prize 1995"]
}

Response: 201 Created
```

### Search Alumni Memorials
```http
GET /api/alumni-memorials/search?school=Harvard&year=1975

Response: 200 OK
{
  "results": [...],
  "facets": {
    "schools": {...},
    "years": {...},
    "majors": {...}
  }
}
```

---

## 🔒 Prison Access APIs

### Request Access Token
```http
POST /api/prison-access/request
Content-Type: application/json

{
  "inmateId": "DOC123456",
  "facility": "gtl_facility_001",
  "memorialId": "mem_123",
  "relationship": "family",
  "duration": 3600
}

Response: 201 Created
{
  "accessToken": "pa_token_789",
  "expiresAt": "2024-12-10T15:00:00Z",
  "sessionUrl": "https://secure.opictuary.com/prison/session/789"
}
```

### Monitor Session
```http
GET /api/prison-access/sessions/:sessionId

Response: 200 OK
{
  "status": "active",
  "startTime": "2024-12-10T14:00:00Z",
  "duration": 1800,
  "actions": [...],
  "violations": []
}
```

---

## ⭐ Celebrity Estate APIs

### Verify Estate
```http
POST /api/celebrity/verify
Content-Type: multipart/form-data

{
  "celebrityName": "John Legend",
  "verifierName": "Jane Doe",
  "relationship": "estate_executor",
  "documents": [binary],
  "legalAgreement": true
}

Response: 202 Accepted
{
  "verificationId": "ver_123",
  "status": "pending_review",
  "estimatedReview": "2024-12-12"
}
```

### Publish Fan Content
```http
POST /api/celebrity/:estateId/content
Content-Type: application/json

{
  "title": "Unreleased Studio Session 1985",
  "type": "video",
  "description": "Never before seen footage...",
  "contentUrl": "https://cdn.opictuary.com/exclusive/video_123.mp4",
  "price": 4.99,
  "availability": "premium"
}

Response: 201 Created
```

---

## 🌺 Partner Integration APIs

### Flower Shop Orders
```http
POST /api/partners/flowers/order
Content-Type: application/json

{
  "memorialId": "mem_123",
  "shopId": "shop_456",
  "arrangement": "sympathy_bouquet",
  "deliveryDate": "2024-12-15",
  "message": "With deepest sympathy"
}

Response: 201 Created
{
  "orderId": "flower_789",
  "shopConfirmation": "FS-2024-456",
  "estimatedDelivery": "2024-12-15T14:00:00Z"
}
```

### Funeral Home Integration
```http
POST /api/partners/funeral-homes/sync
Content-Type: application/json

{
  "partnerCode": "FH_BOSTON_001",
  "services": [
    {
      "deceasedName": "John Doe",
      "serviceDate": "2024-12-20",
      "memorialFeatures": ["qr_code", "live_stream"]
    }
  ]
}

Response: 200 OK
{
  "synced": 1,
  "memorials": ["mem_123"]
}
```

---

## 🔔 Webhooks

### Event Types
- `memorial.created` - New memorial created
- `memorial.updated` - Memorial information updated
- `media.uploaded` - New photo/video added
- `order.paid` - Product order payment confirmed
- `message.delivered` - Future message sent
- `estate.verified` - Celebrity estate approved
- `content.generated` - AI content ready
- `qr.scanned` - QR code accessed

### Webhook Payload
```json
{
  "event": "memorial.created",
  "timestamp": "2024-12-10T12:00:00Z",
  "data": {
    "memorialId": "mem_123",
    "name": "John Doe",
    "createdBy": "user_456"
  },
  "signature": "sha256=xxx"
}
```

### Webhook Security
All webhooks include HMAC-SHA256 signature verification:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return `sha256=${hash}` === signature;
}
```

---

## 🚦 Rate Limiting

### Limits by Plan
- **Free**: 100 requests/hour
- **Premium**: 1,000 requests/hour
- **Enterprise**: 10,000 requests/hour
- **Unlimited**: No rate limits

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1702234800
```

### Rate Limit Response
```http
429 Too Many Requests

{
  "error": "rate_limit_exceeded",
  "message": "API rate limit exceeded",
  "retryAfter": 3600
}
```

---

## 🔍 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is missing required fields",
    "details": {
      "missing": ["name", "birthDate"]
    }
  },
  "timestamp": "2024-12-10T12:00:00Z",
  "requestId": "req_abc123"
}
```

### Common Error Codes
- `INVALID_REQUEST` - Malformed request
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource doesn't exist
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 🧪 Testing

### Test Environment
```
Base URL: https://sandbox.opictuary.com/api
Test API Key: test_key_xxx
```

### Test Credit Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0000 0000 3220
```

### Test QR Codes
```
Test Memorial: https://sandbox.opictuary.com/qr/test_memorial
Test Analytics: https://sandbox.opictuary.com/qr/test_analytics
```

---

## 📚 SDKs & Libraries

### JavaScript/TypeScript
```bash
npm install @opictuary/sdk
```

```javascript
import { OpictuaryClient } from '@opictuary/sdk';

const client = new OpictuaryClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

const memorial = await client.memorials.create({
  name: 'John Doe',
  birthDate: '1950-01-15',
  deathDate: '2024-01-10'
});
```

### Python
```bash
pip install opictuary
```

```python
from opictuary import OpictuaryClient

client = OpictuaryClient(
    api_key='YOUR_API_KEY',
    environment='production'
)

memorial = client.memorials.create(
    name='John Doe',
    birth_date='1950-01-15',
    death_date='2024-01-10'
)
```

### REST Client Examples
- [Postman Collection](https://postman.com/opictuary-api)
- [Insomnia Workspace](https://insomnia.rest/opictuary)
- [OpenAPI Spec](https://api.opictuary.com/openapi.json)

---

## 🔐 Security Best Practices

1. **Always use HTTPS** in production
2. **Store API keys securely** (environment variables)
3. **Implement webhook signature verification**
4. **Use rate limiting** to prevent abuse
5. **Validate all input** on both client and server
6. **Implement proper CORS policies**
7. **Use OAuth 2.0** for third-party integrations
8. **Enable audit logging** for compliance

---

## 📞 Support

### Developer Support
- Email: developers@opictuary.com
- Discord: discord.gg/opictuary
- Stack Overflow: [opictuary] tag

### Enterprise Support
- Phone: 1-800-MEMORIAL
- Email: enterprise@opictuary.com
- SLA: 99.9% uptime guarantee

---

*Last Updated: December 2024*
*API Version: 2.0.0*