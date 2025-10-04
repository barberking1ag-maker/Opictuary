import { db } from "./db";
import { memorials, memories, fundraisers, legacyEvents, musicPlaylists, griefSupport, condolences } from "@shared/schema";
import { randomBytes } from "crypto";

async function seedMemorial() {
  const inviteCode = randomBytes(8).toString('hex').toUpperCase();
  
  const [memorial] = await db.insert(memorials).values({
    name: "Margaret Rose Johnson",
    birthDate: "March 15, 1945",
    deathDate: "September 28, 2024",
    epitaph: "A loving mother, devoted grandmother, and cherished friend",
    biography: "Margaret dedicated her life to teaching and touching the lives of hundreds of students over her 40-year career. She was known for her warmth, wisdom, and infectious smile.",
    inviteCode,
    religion: "Christian",
    cemeteryName: "Riverside Memorial Gardens",
    cemeteryLocation: "Section C, Plot 142",
    cemeteryCoordinates: { lat: 40.7128, lng: -74.0060 },
    isPublic: false,
  }).returning();

  console.log(`Memorial created with invite code: ${inviteCode}`);

  await db.insert(memories).values([
    {
      memorialId: memorial.id,
      authorName: "Sarah Williams",
      caption: "I remember when Margaret taught me how to bake her famous apple pie. She was so patient and kind, always making sure I got every step just right. Those Sunday afternoons in her kitchen are some of my fondest memories.",
      isApproved: true,
    },
    {
      memorialId: memorial.id,
      authorName: "David Chen",
      caption: "Such a beautiful soul. Will be deeply missed by everyone who knew her.",
      isApproved: false,
    },
  ]);

  await db.insert(condolences).values([
    {
      memorialId: memorial.id,
      authorName: "Robert Martinez",
      message: "Margaret was a light in this world. Her kindness and warmth touched everyone who knew her. My deepest condolences to the family during this difficult time.",
    },
    {
      memorialId: memorial.id,
      authorName: "Lisa Thompson",
      message: "Sending prayers and love to the entire family. May her memory be a blessing.",
    },
  ]);

  const [fundraiser] = await db.insert(fundraisers).values({
    memorialId: memorial.id,
    title: "Memorial Fund",
    description: "Help us cover the funeral expenses and celebrate Margaret's life with dignity.",
    goalAmount: "15000",
    currentAmount: "8450",
  }).returning();

  await db.insert(legacyEvents).values({
    memorialId: memorial.id,
    title: "Annual Memorial Picnic",
    eventDate: "June 15, 2025",
    eventTime: "12:00 PM",
    location: "Riverside Park, Pavilion 3",
    description: "Join us for our annual gathering to celebrate Margaret's life with food, music, and cherished memories.",
    attendeeCount: 28,
  });

  await db.insert(musicPlaylists).values({
    memorialId: memorial.id,
    tracks: [
      { id: '1', title: 'Amazing Grace', artist: 'Traditional', duration: '3:42' },
      { id: '2', title: 'What a Wonderful World', artist: 'Louis Armstrong', duration: '2:20' },
      { id: '3', title: 'Over the Rainbow', artist: 'Judy Garland', duration: '2:45' },
      { id: '4', title: 'Ave Maria', artist: 'Franz Schubert', duration: '4:15' }
    ] as any,
  });

  await db.insert(griefSupport).values({
    memorialId: memorial.id,
    familyContact: "Contact the Johnson family",
    pastoralContact: "Pastor David Miller - First Community Church",
  });

  console.log("Memorial seed completed successfully");
  console.log(`Use invite code: ${inviteCode}`);
  process.exit(0);
}

seedMemorial().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
