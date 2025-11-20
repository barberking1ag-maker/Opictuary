# Android App Integration Code - Ready to Copy & Paste

## 📦 Step 1: Add Dependencies to build.gradle

```gradle
// app/build.gradle
dependencies {
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Async operations
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    
    // Image loading for AI cards
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    
    // QR code display
    implementation 'com.journeyapps:zxing-android-embedded:4.3.0'
    
    // Google Play Billing for payments
    implementation 'com.android.billingclient:billing-ktx:6.0.1'
}
```

---

## 📝 Step 2: Add Permissions to AndroidManifest.xml

```xml
<!-- app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="com.android.vending.BILLING" />

<application
    android:usesCleartextTraffic="false"
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```

---

## 🔒 Step 3: Network Security Config

```xml
<!-- app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">opictuary.replit.app</domain>
    </domain-config>
</network-security-config>
```

---

## 🌐 Step 4: Create API Client - OpictuaryAPI.kt

```kotlin
// com/yourapp/api/OpictuaryAPI.kt
package com.yourapp.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit

// Data Models
data class Memorial(
    val id: String? = null,
    val slug: String? = null,
    val name: String,
    val birthDate: String,
    val deathDate: String,
    val biography: String,
    val isPublic: Boolean = false,
    val photos: List<String>? = null,
    val createdAt: String? = null
)

data class AIDesignRequest(
    val prompt: String,
    val style: String = "watercolor",
    val orderId: String? = null
)

data class AIDesignResponse(
    val success: Boolean,
    val imageUrl: String,
    val cost: Double,  // Will be 15.00
    val designId: String,
    val message: String? = null
)

data class QRCodeResponse(
    val qrCodeUrl: String,
    val memorialUrl: String,
    val qrId: String
)

data class ProductOrder(
    val memorialId: String,
    val productId: String,
    val quantity: Int,
    val customization: Map<String, Any>,
    val shippingAddress: ShippingAddress
)

data class ShippingAddress(
    val name: String,
    val street: String,
    val city: String,
    val state: String,
    val zipCode: String,
    val country: String = "USA"
)

data class PaymentIntent(
    val clientSecret: String,
    val amount: Int,
    val orderId: String
)

data class Product(
    val id: String,
    val name: String,
    val description: String,
    val basePrice: Double,
    val category: String,
    val images: List<String>
)

// API Interface
interface OpictuaryService {
    
    // Memorial Management
    @POST("memorials")
    suspend fun createMemorial(@Body memorial: Memorial): Memorial
    
    @GET("memorials/{slug}")
    suspend fun getMemorial(@Path("slug") slug: String): Memorial
    
    @GET("memorials")
    suspend fun listMemorials(@Query("limit") limit: Int = 20): List<Memorial>
    
    @Multipart
    @POST("memorials/{id}/media")
    suspend fun uploadPhoto(
        @Path("id") memorialId: String,
        @Part photo: MultipartBody.Part
    ): MediaUploadResponse
    
    // AI Features ($15 Premium)
    @POST("products/generate-ai-design")
    suspend fun generateAICard(@Body request: AIDesignRequest): AIDesignResponse
    
    // QR Code Generation
    @GET("qr/{memorialId}")
    suspend fun getQRCode(@Path("memorialId") memorialId: String): QRCodeResponse
    
    @POST("qr/{qrId}/scan")
    suspend fun trackQRScan(
        @Path("qrId") qrId: String,
        @Body scanData: Map<String, Any>
    ): Map<String, Any>
    
    // Products & E-Commerce
    @GET("products")
    suspend fun getProducts(@Query("category") category: String? = null): List<Product>
    
    @POST("products/orders")
    suspend fun createOrder(@Body order: ProductOrder): OrderResponse
    
    @POST("products/orders/{orderId}/create-payment-intent")
    suspend fun createPaymentIntent(@Path("orderId") orderId: String): PaymentIntent
    
    @POST("products/orders/{orderId}/confirm-payment")
    suspend fun confirmPayment(
        @Path("orderId") orderId: String,
        @Body paymentData: Map<String, String>
    ): PaymentConfirmation
    
    // Future Messages
    @POST("future-messages")
    suspend fun scheduleFutureMessage(@Body message: FutureMessage): FutureMessage
    
    @GET("future-messages")
    suspend fun getFutureMessages(): List<FutureMessage>
}

data class MediaUploadResponse(
    val success: Boolean,
    val mediaUrl: String,
    val mediaId: String
)

data class OrderResponse(
    val orderId: String,
    val orderNumber: String,
    val total: Double,
    val status: String
)

data class PaymentConfirmation(
    val success: Boolean,
    val orderId: String,
    val status: String
)

data class FutureMessage(
    val memorialId: String,
    val recipientEmail: String,
    val message: String,
    val deliveryDate: String,
    val eventType: String
)

// Singleton API Client
object OpictuaryClient {
    private const val BASE_URL = "https://opictuary.replit.app/api/"
    private const val TIMEOUT = 30L
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) 
                HttpLoggingInterceptor.Level.BODY 
            else 
                HttpLoggingInterceptor.Level.NONE
        })
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                // Add auth token if you have one
                // .addHeader("Authorization", "Bearer ${getAuthToken()}")
                .build()
            chain.proceed(request)
        }
        .connectTimeout(TIMEOUT, TimeUnit.SECONDS)
        .readTimeout(TIMEOUT, TimeUnit.SECONDS)
        .writeTimeout(TIMEOUT, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val api: OpictuaryService = retrofit.create(OpictuaryService::class.java)
}
```

---

## 💰 Step 5: Google Play Billing Integration - BillingManager.kt

```kotlin
// com/yourapp/billing/BillingManager.kt
package com.yourapp.billing

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class BillingManager(private val context: Context) {
    
    private lateinit var billingClient: BillingClient
    private val skuList = listOf(
        "ai_memorial_card",      // $15 one-time
        "premium_subscription",  // $9.99/month
        "elite_subscription"     // $29.99/month
    )
    
    fun initialize(onReady: () -> Unit) {
        billingClient = BillingClient.newBuilder(context)
            .setListener { billingResult, purchases ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    purchases?.forEach { purchase ->
                        handlePurchase(purchase)
                    }
                }
            }
            .enablePendingPurchases()
            .build()
        
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    onReady()
                }
            }
            override fun onBillingServiceDisconnected() {
                // Retry connection
            }
        })
    }
    
    suspend fun purchaseAICard(activity: Activity): Boolean {
        return withContext(Dispatchers.IO) {
            val productList = listOf(
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId("ai_memorial_card")
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build()
            )
            
            val params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build()
            
            billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    productDetailsList.firstOrNull()?.let { productDetails ->
                        val productDetailsParamsList = listOf(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(productDetails)
                                .build()
                        )
                        
                        val billingFlowParams = BillingFlowParams.newBuilder()
                            .setProductDetailsParamsList(productDetailsParamsList)
                            .build()
                        
                        billingClient.launchBillingFlow(activity, billingFlowParams)
                    }
                }
            }
            true
        }
    }
    
    private fun handlePurchase(purchase: Purchase) {
        // Verify purchase with your server
        // Then acknowledge the purchase
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()
            
            billingClient.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    // Purchase acknowledged - enable feature
                }
            }
        }
    }
}
```

---

## 🎨 Step 6: Memorial Creation Activity

```kotlin
// com/yourapp/ui/CreateMemorialActivity.kt
package com.yourapp.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.yourapp.api.OpictuaryClient
import com.yourapp.api.Memorial
import com.yourapp.api.AIDesignRequest
import com.yourapp.billing.BillingManager
import com.yourapp.databinding.ActivityCreateMemorialBinding
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class CreateMemorialActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityCreateMemorialBinding
    private lateinit var billingManager: BillingManager
    private var currentMemorialId: String? = null
    private var aiCardImageUrl: String? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreateMemorialBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize billing
        billingManager = BillingManager(this)
        billingManager.initialize {
            // Billing ready
        }
        
        setupListeners()
    }
    
    private fun setupListeners() {
        // Create Memorial Button
        binding.createMemorialButton.setOnClickListener {
            createMemorial()
        }
        
        // Generate AI Card Button ($15)
        binding.generateAiCardButton.setOnClickListener {
            generateAICard()
        }
        
        // Get QR Code Button
        binding.generateQrButton.setOnClickListener {
            currentMemorialId?.let { id ->
                generateQRCode(id)
            }
        }
    }
    
    private fun createMemorial() {
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                
                val memorial = Memorial(
                    name = binding.nameInput.text.toString(),
                    birthDate = binding.birthDateInput.text.toString(),
                    deathDate = binding.deathDateInput.text.toString(),
                    biography = binding.biographyInput.text.toString(),
                    isPublic = binding.publicCheckbox.isChecked
                )
                
                val created = OpictuaryClient.api.createMemorial(memorial)
                currentMemorialId = created.id
                
                Toast.makeText(
                    this@CreateMemorialActivity, 
                    "Memorial created successfully!", 
                    Toast.LENGTH_SHORT
                ).show()
                
                // Enable AI and QR buttons
                binding.generateAiCardButton.isEnabled = true
                binding.generateQrButton.isEnabled = true
                
                // Show memorial URL
                binding.memorialUrlText.text = "Memorial URL: https://opictuary.replit.app/memorial/${created.slug}"
                binding.memorialUrlText.visibility = View.VISIBLE
                
            } catch (e: Exception) {
                Toast.makeText(
                    this@CreateMemorialActivity,
                    "Error: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
    
    private fun generateAICard() {
        // First, handle payment
        lifecycleScope.launch {
            val purchaseSuccess = billingManager.purchaseAICard(this@CreateMemorialActivity)
            
            if (purchaseSuccess) {
                // Payment successful, generate AI card
                generateAIDesign()
            }
        }
    }
    
    private fun generateAIDesign() {
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                binding.aiStatusText.text = "Generating AI memorial card... ($15)"
                binding.aiStatusText.visibility = View.VISIBLE
                
                val request = AIDesignRequest(
                    prompt = binding.aiPromptInput.text.toString().ifEmpty { 
                        "Peaceful sunset with flying doves and golden clouds" 
                    },
                    style = "watercolor"
                )
                
                val response = OpictuaryClient.api.generateAICard(request)
                
                if (response.success) {
                    aiCardImageUrl = response.imageUrl
                    
                    // Display the AI-generated image
                    Glide.with(this@CreateMemorialActivity)
                        .load(response.imageUrl)
                        .placeholder(R.drawable.placeholder)
                        .into(binding.aiCardPreview)
                    
                    binding.aiCardPreview.visibility = View.VISIBLE
                    binding.aiStatusText.text = "AI Card Generated! Cost: $${response.cost}"
                    
                    // Enable download button
                    binding.downloadAiCardButton.visibility = View.VISIBLE
                    binding.downloadAiCardButton.setOnClickListener {
                        downloadImage(response.imageUrl)
                    }
                }
                
            } catch (e: Exception) {
                Toast.makeText(
                    this@CreateMemorialActivity,
                    "Error generating AI card: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
    
    private fun generateQRCode(memorialId: String) {
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                
                val qrResponse = OpictuaryClient.api.getQRCode(memorialId)
                
                // Display QR code
                Glide.with(this@CreateMemorialActivity)
                    .load(qrResponse.qrCodeUrl)
                    .into(binding.qrCodeImage)
                
                binding.qrCodeImage.visibility = View.VISIBLE
                binding.qrCodeText.text = "QR Code links to: ${qrResponse.memorialUrl}"
                binding.qrCodeText.visibility = View.VISIBLE
                
                // Track scan when someone uses it
                trackQRScan(qrResponse.qrId)
                
            } catch (e: Exception) {
                Toast.makeText(
                    this@CreateMemorialActivity,
                    "Error generating QR code: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
    
    private fun trackQRScan(qrId: String) {
        lifecycleScope.launch {
            try {
                val scanData = mapOf(
                    "device" to "android",
                    "timestamp" to System.currentTimeMillis().toString(),
                    "source" to "mobile_app"
                )
                
                OpictuaryClient.api.trackQRScan(qrId, scanData)
            } catch (e: Exception) {
                // Silent fail for analytics
            }
        }
    }
    
    private fun downloadImage(imageUrl: String) {
        // Implement image download logic
        Toast.makeText(this, "Downloading memorial card...", Toast.LENGTH_SHORT).show()
    }
}
```

---

## 📋 Step 7: Layout XML - activity_create_memorial.xml

```xml
<!-- res/layout/activity_create_memorial.xml -->
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:spacing="16dp">
        
        <!-- Header -->
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Create Digital Memorial"
            android:textSize="24sp"
            android:textStyle="bold"
            android:gravity="center"
            android:paddingBottom="16dp" />
        
        <!-- Memorial Information -->
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Full Name">
            
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/nameInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Birth Date (MM/DD/YYYY)"
            android:layout_marginTop="8dp">
            
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/birthDateInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="date" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Death Date (MM/DD/YYYY)"
            android:layout_marginTop="8dp">
            
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/deathDateInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="date" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Biography"
            android:layout_marginTop="8dp">
            
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/biographyInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textMultiLine"
                android:minLines="3" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <CheckBox
            android:id="@+id/publicCheckbox"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Make memorial public"
            android:layout_marginTop="8dp" />
        
        <!-- Create Memorial Button -->
        <Button
            android:id="@+id/createMemorialButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Create Memorial"
            android:layout_marginTop="16dp" />
        
        <!-- Memorial URL Display -->
        <TextView
            android:id="@+id/memorialUrlText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:visibility="gone"
            android:textColor="@color/teal_700"
            android:layout_marginTop="8dp" />
        
        <!-- AI Card Section -->
        <View
            android:layout_width="match_parent"
            android:layout_height="1dp"
            android:background="#E0E0E0"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="16dp" />
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="AI Memorial Card Designer"
            android:textSize="18sp"
            android:textStyle="bold" />
        
        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Describe your memorial card (optional)"
            android:layout_marginTop="8dp">
            
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/aiPromptInput"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Peaceful sunset with flying doves" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <Button
            android:id="@+id/generateAiCardButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Generate AI Card ($15)"
            android:enabled="false"
            android:layout_marginTop="8dp" />
        
        <TextView
            android:id="@+id/aiStatusText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:visibility="gone"
            android:textColor="@color/purple_700"
            android:layout_marginTop="8dp" />
        
        <ImageView
            android:id="@+id/aiCardPreview"
            android:layout_width="match_parent"
            android:layout_height="300dp"
            android:scaleType="centerCrop"
            android:visibility="gone"
            android:layout_marginTop="8dp" />
        
        <Button
            android:id="@+id/downloadAiCardButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Download Card"
            android:visibility="gone"
            android:layout_marginTop="8dp" />
        
        <!-- QR Code Section -->
        <View
            android:layout_width="match_parent"
            android:layout_height="1dp"
            android:background="#E0E0E0"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="16dp" />
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="QR Code for Tombstone"
            android:textSize="18sp"
            android:textStyle="bold" />
        
        <Button
            android:id="@+id/generateQrButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Generate QR Code"
            android:enabled="false"
            android:layout_marginTop="8dp" />
        
        <ImageView
            android:id="@+id/qrCodeImage"
            android:layout_width="200dp"
            android:layout_height="200dp"
            android:layout_gravity="center"
            android:visibility="gone"
            android:layout_marginTop="8dp" />
        
        <TextView
            android:id="@+id/qrCodeText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center"
            android:visibility="gone"
            android:textSize="12sp"
            android:layout_marginTop="8dp" />
        
        <!-- Progress Bar -->
        <ProgressBar
            android:id="@+id/progressBar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:visibility="gone"
            android:layout_marginTop="16dp" />
        
    </LinearLayout>
</ScrollView>
```

---

## 🚀 Step 8: Update Your MainActivity

```kotlin
// MainActivity.kt - Add button to launch memorial creation
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Add button to launch Opictuary features
        binding.opictuaryButton.setOnClickListener {
            startActivity(Intent(this, CreateMemorialActivity::class.java))
        }
    }
}
```

---

## ✅ Step 9: Test the Integration

```kotlin
// TestActivity.kt - Quick test of API connection
class TestActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Test API connection
        lifecycleScope.launch {
            try {
                val memorials = OpictuaryClient.api.listMemorials(limit = 5)
                Log.d("Opictuary", "Connected! Found ${memorials.size} memorials")
            } catch (e: Exception) {
                Log.e("Opictuary", "Connection error: ${e.message}")
            }
        }
    }
}
```

---

## 📱 Step 10: Update App Version & Publish

```gradle
// app/build.gradle
android {
    defaultConfig {
        applicationId "com.yourcompany.yourapp"  // KEEP SAME
        minSdk 24
        targetSdk 34                             // Required for 2024
        versionCode 2                            // INCREMENT THIS
        versionName "2.0.0"                      // Update version
    }
}
```

---

## 🎯 Revenue Configuration

### In-App Products to Create in Google Play Console:

1. **AI Memorial Card**
   - Product ID: `ai_memorial_card`
   - Type: One-time product
   - Price: $14.99

2. **Premium Subscription**
   - Product ID: `premium_subscription`
   - Type: Subscription
   - Price: $9.99/month

3. **Elite Subscription**
   - Product ID: `elite_subscription`
   - Type: Subscription
   - Price: $29.99/month

---

## 📊 Analytics Events to Track

```kotlin
// Add to your analytics
Analytics.logEvent("memorial_created", Bundle().apply {
    putString("memorial_id", memorialId)
})

Analytics.logEvent("ai_card_purchased", Bundle().apply {
    putDouble("revenue", 15.00)
})

Analytics.logEvent("qr_code_generated", Bundle().apply {
    putString("memorial_id", memorialId)
})
```

---

## ✅ Checklist Before Publishing

- [ ] Test memorial creation
- [ ] Test AI card generation ($15 purchase)
- [ ] Test QR code generation
- [ ] Verify payment processing
- [ ] Update version code
- [ ] Add release notes
- [ ] Test on different devices
- [ ] Submit to Google Play Console

---

## 🎉 You're Ready!

1. Copy this code into your app
2. Replace "com.yourapp" with your package name
3. Build and test
4. Upload to Google Play Console
5. Start earning from AI cards ($15 each!)

---

*This integration connects your app to all Opictuary features. Users can create memorials, generate AI cards, and get QR codes directly from your app!*