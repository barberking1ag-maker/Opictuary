# Opictuary API Integration Guide for Google Play App
## Direct Integration Instructions

---

## 🚀 Quick Start

### Base Configuration
```javascript
// API Configuration
const OPICTUARY_API = {
  baseURL: "https://opictuary.replit.app/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};
```

---

## 📱 Android (Kotlin) Integration

### 1. Add Dependencies
```gradle
// build.gradle
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.9.0'
}
```

### 2. API Service Setup
```kotlin
// OpictuaryApiService.kt
interface OpictuaryApiService {
    
    @POST("memorials")
    suspend fun createMemorial(@Body memorial: Memorial): Response<Memorial>
    
    @GET("memorials/{slug}")
    suspend fun getMemorial(@Path("slug") slug: String): Response<Memorial>
    
    @POST("products/generate-ai-design")
    suspend fun generateAICard(@Body request: AIDesignRequest): Response<AIDesignResponse>
    
    @POST("products/orders")
    suspend fun createOrder(@Body order: ProductOrder): Response<OrderResponse>
    
    @GET("qr/{memorialId}")
    suspend fun getQRCode(@Path("memorialId") memorialId: String): Response<QRCodeResponse>
}

// Data Models
data class Memorial(
    val name: String,
    val birthDate: String,
    val deathDate: String,
    val biography: String,
    val isPublic: Boolean = false
)

data class AIDesignRequest(
    val prompt: String,
    val style: String,
    val orderId: String?
)

data class ProductOrder(
    val memorialId: String,
    val productId: String,
    val quantity: Int,
    val customization: Map<String, Any>,
    val shippingAddress: ShippingAddress
)
```

### 3. Retrofit Client
```kotlin
// OpictuaryClient.kt
object OpictuaryClient {
    private const val BASE_URL = "https://opictuary.replit.app/api/"
    
    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(
                OkHttpClient.Builder()
                    .addInterceptor { chain ->
                        val request = chain.request().newBuilder()
                            .addHeader("Authorization", "Bearer ${getApiKey()}")
                            .build()
                        chain.proceed(request)
                    }
                    .build()
            )
            .build()
    }
    
    val api: OpictuaryApiService by lazy {
        retrofit.create(OpictuaryApiService::class.java)
    }
}
```

### 4. Implementation Examples
```kotlin
// CreateMemorialActivity.kt
class CreateMemorialActivity : AppCompatActivity() {
    
    private suspend fun createMemorial() {
        try {
            val memorial = Memorial(
                name = binding.nameInput.text.toString(),
                birthDate = binding.birthDateInput.text.toString(),
                deathDate = binding.deathDateInput.text.toString(),
                biography = binding.biographyInput.text.toString()
            )
            
            val response = OpictuaryClient.api.createMemorial(memorial)
            
            if (response.isSuccessful) {
                val created = response.body()
                // Navigate to memorial page
                navigateToMemorial(created?.slug)
            }
        } catch (e: Exception) {
            showError("Failed to create memorial: ${e.message}")
        }
    }
    
    private suspend fun generateAIMemorialCard() {
        val request = AIDesignRequest(
            prompt = "Peaceful sunset with flying doves",
            style = "watercolor",
            orderId = null
        )
        
        val response = OpictuaryClient.api.generateAICard(request)
        
        if (response.isSuccessful) {
            val aiDesign = response.body()
            // Display generated image
            Glide.with(this)
                .load(aiDesign?.imageUrl)
                .into(binding.previewImage)
            
            // Show price ($15)
            binding.priceText.text = "$${aiDesign?.cost}"
        }
    }
}
```

---

## 📱 React Native Integration

### 1. Install Dependencies
```bash
npm install axios react-native-async-storage
```

### 2. API Client Setup
```javascript
// api/OpictuaryAPI.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://opictuary.replit.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### 3. API Methods
```javascript
// api/memorials.js
import apiClient from './OpictuaryAPI';

export const memorialAPI = {
  // Create memorial
  create: async (memorialData) => {
    const response = await apiClient.post('/memorials', memorialData);
    return response.data;
  },
  
  // Get memorial
  get: async (slug) => {
    const response = await apiClient.get(`/memorials/${slug}`);
    return response.data;
  },
  
  // Upload media
  uploadMedia: async (memorialId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
      `/memorials/${memorialId}/media`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
  
  // Generate QR code
  getQRCode: async (memorialId) => {
    const response = await apiClient.get(`/qr/${memorialId}`);
    return response.data;
  }
};

export const productsAPI = {
  // Generate AI memorial card
  generateAIDesign: async (prompt, style) => {
    const response = await apiClient.post('/products/generate-ai-design', {
      prompt,
      style
    });
    return response.data;
  },
  
  // Create product order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/products/orders', orderData);
    return response.data;
  },
  
  // Process payment
  processPayment: async (orderId, paymentMethodId) => {
    const response = await apiClient.post(`/products/orders/${orderId}/pay`, {
      paymentMethodId
    });
    return response.data;
  }
};
```

### 4. React Native Components
```javascript
// screens/CreateMemorial.js
import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import { memorialAPI, productsAPI } from '../api/memorials';

export default function CreateMemorial() {
  const [memorial, setMemorial] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    biography: ''
  });
  
  const handleCreate = async () => {
    try {
      const created = await memorialAPI.create(memorial);
      
      // Generate QR code
      const qrCode = await memorialAPI.getQRCode(created.id);
      
      // Navigate to memorial
      navigation.navigate('Memorial', { slug: created.slug });
    } catch (error) {
      console.error('Error creating memorial:', error);
    }
  };
  
  const generateAICard = async () => {
    try {
      const design = await productsAPI.generateAIDesign(
        'Peaceful sunset with doves',
        'watercolor'
      );
      
      // Display generated image
      setAiImageUrl(design.imageUrl);
      setPrice(design.cost); // $15
    } catch (error) {
      console.error('Error generating AI card:', error);
    }
  };
  
  return (
    <View>
      <TextInput
        placeholder="Name"
        value={memorial.name}
        onChangeText={(text) => setMemorial({...memorial, name: text})}
      />
      {/* Other inputs */}
      
      <Button title="Create Memorial" onPress={handleCreate} />
      <Button title="Generate AI Card" onPress={generateAICard} />
      
      {aiImageUrl && <Image source={{uri: aiImageUrl}} />}
    </View>
  );
}
```

---

## 🔑 Key Features to Integrate

### 1. Core Memorial Features
```javascript
// Essential endpoints for basic functionality
const coreEndpoints = {
  createMemorial: 'POST /api/memorials',
  getMemorial: 'GET /api/memorials/:slug',
  uploadMedia: 'POST /api/memorials/:id/media',
  addTribute: 'POST /api/memorials/:id/tributes',
  getQRCode: 'GET /api/qr/:memorialId'
};
```

### 2. AI Features ($15 Premium)
```javascript
// AI memorial card generation
const aiEndpoints = {
  generateCard: 'POST /api/products/generate-ai-design',
  // Returns: { imageUrl, cost: 15.00, style }
};
```

### 3. E-Commerce Features
```javascript
// Physical memorial products
const productEndpoints = {
  listProducts: 'GET /api/products',
  createOrder: 'POST /api/products/orders',
  processPayment: 'POST /api/products/orders/:id/pay',
  trackOrder: 'GET /api/products/orders/:id'
};
```

### 4. Future Messages
```javascript
// Schedule messages for future delivery
const futureMessageEndpoints = {
  schedule: 'POST /api/future-messages',
  list: 'GET /api/future-messages',
  cancel: 'DELETE /api/future-messages/:id'
};
```

---

## 🔐 Authentication Options

### Option 1: API Key (Simple)
```javascript
// Request header
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

### Option 2: OAuth 2.0 (Secure)
```javascript
// OAuth flow
const authUrl = `https://opictuary.replit.app/oauth/authorize?
  client_id=${CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=code`;

// Exchange code for token
const token = await exchangeCodeForToken(authCode);
```

### Option 3: Session-Based (Web)
```javascript
// Include cookies for session auth
fetch(url, {
  credentials: 'include',
  headers: {
    'Cookie': sessionCookie
  }
});
```

---

## 💰 Monetization Integration

### In-App Purchases
```javascript
// AI Memorial Card - $15
const purchaseAICard = async () => {
  const product = {
    id: 'ai_memorial_card',
    price: 15.00,
    description: 'AI-Generated Memorial Card'
  };
  
  // Process through Google Play Billing
  const purchase = await processPurchase(product);
  
  // Verify with Opictuary
  const verified = await apiClient.post('/verify-purchase', {
    purchaseToken: purchase.token,
    productId: product.id
  });
  
  if (verified) {
    // Generate AI card
    const design = await productsAPI.generateAIDesign(prompt, style);
  }
};
```

### Subscription Tiers
```javascript
const subscriptions = {
  free: { price: 0, memorials: 1 },
  premium: { price: 9.99, memorials: 5 },
  elite: { price: 29.99, memorials: 'unlimited' }
};
```

---

## 📊 Analytics Integration

### Track QR Scans
```javascript
// Track when users scan QR codes
const trackQRScan = async (qrId, location) => {
  await apiClient.post(`/api/qr/${qrId}/scan`, {
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    device: 'mobile',
    browser: 'android_app'
  });
};
```

### User Engagement
```javascript
// Track feature usage
const analytics = {
  memorialCreated: (memorialId) => track('memorial_created', { id: memorialId }),
  aiCardGenerated: (style) => track('ai_card_generated', { style, price: 15 }),
  productOrdered: (productId, price) => track('product_ordered', { productId, price }),
  qrScanned: (memorialId) => track('qr_scanned', { memorialId })
};
```

---

## 🧪 Testing

### Test Credentials
```javascript
const testConfig = {
  apiUrl: 'https://opictuary.replit.app/api',
  testMemorial: 'john-doe-1950',
  testQRCode: 'https://opictuary.replit.app/qr/test_123'
};
```

### Sample Test Data
```javascript
const testMemorial = {
  name: "Test Memorial",
  birthDate: "1950-01-01",
  deathDate: "2024-01-01",
  biography: "Test biography"
};

const testAIRequest = {
  prompt: "Peaceful sunset",
  style: "watercolor"
};
```

---

## 🎯 Implementation Priority

### Phase 1: MVP (Week 1)
1. ✅ Create/view memorials
2. ✅ Upload photos
3. ✅ Generate QR codes

### Phase 2: Monetization (Week 2)
1. 💰 AI card generation ($15)
2. 💰 Premium subscriptions
3. 💰 Physical products

### Phase 3: Advanced (Week 3)
1. 🚀 Future messages
2. 🚀 Celebrity memorials
3. 🚀 Analytics dashboard

---

## 📞 Support

### Technical Support
- API Issues: developers@opictuary.com
- Documentation: https://opictuary.replit.app/api-docs
- Response Time: < 24 hours

### Integration Help
- Schedule Demo: calendly.com/opictuary-integration
- Discord: discord.gg/opictuary
- Sample Code: github.com/opictuary/mobile-examples

---

## 🚀 Go Live Checklist

- [ ] API credentials obtained
- [ ] Authentication implemented
- [ ] Core memorial features working
- [ ] AI features integrated
- [ ] Payment processing tested
- [ ] Analytics tracking active
- [ ] Error handling in place
- [ ] Production API endpoint configured

---

*Ready to integrate! This guide provides everything needed to add Opictuary features to your Google Play app.*