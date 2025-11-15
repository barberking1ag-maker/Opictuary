// Seed script to create a test BYUS user for testing mediation creation
import { db } from "./db";
import { byusUsers } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedTestByusUser() {
  try {
    // Check if test user already exists
    const [existingUser] = await db
      .select()
      .from(byusUsers)
      .where(eq(byusUsers.id, "test-user-123"));
    
    if (existingUser) {
      console.log("Test BYUS user already exists");
      return;
    }

    // Create test user with specific ID
    await db.insert(byusUsers).values({
      id: "test-user-123",
      email: "test@byus.com",
      name: "Test User",
      subscriptionTier: "free",
      subscriptionStatus: "active",
      role: "user"
    });
    
    console.log("Test BYUS user created successfully");
    console.log("User ID: test-user-123");
    console.log("Email: test@byus.com");
  } catch (error) {
    console.error("Error creating test BYUS user:", error);
  } finally {
    process.exit();
  }
}

seedTestByusUser();