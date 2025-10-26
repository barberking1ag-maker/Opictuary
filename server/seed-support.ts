import { storage } from "./storage";

async function seedSupportContent() {
  console.log("🌱 Seeding support content...");

  const supportArticles = [
    {
      category: "Getting Started",
      title: "How do I create a memorial?",
      content: "Creating a memorial on Opictuary is simple and respectful. First, log in to your account or create a new one. Then, navigate to 'Create Memorial' from the menu. You'll be asked to provide basic information about your loved one including their name, dates, and a biography. You can customize the memorial with photos, videos, and choose a faith-based theme. After creating the memorial, you'll receive a unique invite code to share with family and friends.",
      sortOrder: 1,
    },
    {
      category: "Getting Started",
      title: "What is an invite code and how does it work?",
      content: "Invite codes are unique links that protect the privacy of your memorial. When you create a memorial, you can choose whether it's public or private. For private memorials, only people with the invite code can view and contribute. You can find your memorial's invite code in the memorial settings and share it via email, text, or social media with trusted family and friends.",
      sortOrder: 2,
    },
    {
      category: "Memorial Management",
      title: "How do I add photos and videos to a memorial?",
      content: "To add media to a memorial, navigate to the memorial page and click 'Add Memory'. You can upload photos (JPG, PNG, GIF up to 10MB) or videos (MP4, MOV up to 100MB). Each memory can include a caption and date. Family and friends with access to the memorial can also contribute their own photos and memories, creating a rich tapestry of remembrance.",
      sortOrder: 3,
    },
    {
      category: "Memorial Management",
      title: "Can I customize the memorial theme?",
      content: "Yes! Opictuary offers multi-faith customization options. When creating or editing a memorial, you can choose from themes including Christian, Jewish, Islamic, Buddhist, Hindu, or non-religious. Each theme includes appropriate colors, symbols, and language to honor your loved one's beliefs and traditions. You can change the theme at any time from the memorial settings.",
      sortOrder: 4,
    },
    {
      category: "Privacy & Access",
      title: "Who can see my memorial?",
      content: "You have complete control over memorial privacy. When creating a memorial, you can choose:\n\n- Private: Only people with the invite code can view\n- Public: Anyone can find and view the memorial\n\nYou can also designate administrators who can help manage the memorial content. All privacy settings can be adjusted anytime from the memorial settings page.",
      sortOrder: 5,
    },
    {
      category: "Privacy & Access",
      title: "How do I make someone else an administrator?",
      content: "As the memorial creator, you can add other administrators to help manage the memorial. Go to the memorial settings, click 'Administrators', and enter the email address of the person you want to add. They'll receive an invitation and can then help approve memories, manage fundraisers, and update memorial information.",
      sortOrder: 6,
    },
    {
      category: "Fundraising",
      title: "How do memorial fundraisers work?",
      content: "Memorial fundraisers help families cover funeral costs or support charitable causes in honor of their loved one. When you create a fundraiser for a memorial, you set a goal amount and description. Visitors can donate securely via credit card through Stripe. Opictuary charges a 3% platform fee to maintain the service. You can withdraw funds at any time through your fundraiser dashboard.",
      sortOrder: 7,
    },
    {
      category: "Fundraising",
      title: "What are the fees for fundraising?",
      content: "Opictuary's platform fee is 3% of donations for standard memorial fundraisers (5% for celebrity memorials). This covers platform maintenance, payment processing, and secure hosting. Stripe payment processing fees (approximately 2.9% + $0.30 per transaction) also apply. These fees are industry-standard and much lower than traditional fundraising platforms.",
      sortOrder: 8,
    },
    {
      category: "QR Codes & Physical Memorials",
      title: "What is a memorial QR code?",
      content: "Memorial QR codes connect physical memorial sites to digital memories. You can request an official Opictuary QR code that links to your memorial page. These waterproof, weather-resistant QR codes can be placed on headstones, memorial plaques, or remembrance gardens. When visitors scan the code with their smartphone, they're taken directly to the memorial page.",
      sortOrder: 9,
    },
    {
      category: "QR Codes & Physical Memorials",
      title: "How do I order a QR code for a headstone?",
      content: "To order a memorial QR code, navigate to your memorial page and click 'Request QR Code'. You'll need to provide verification that you have the right to place the code (such as proof of relationship or cemetery authorization). Once approved, you'll receive a durable QR code sticker or plaque that can be professionally installed at the memorial site.",
      sortOrder: 10,
    },
    {
      category: "Legacy Features",
      title: "What are scheduled messages?",
      content: "Scheduled messages allow you to send messages to loved ones on future dates. This powerful feature lets you write birthday wishes, anniversary messages, or words of wisdom that will be delivered to specific people on specific dates in the future. Messages are encrypted and stored securely until their scheduled delivery date.",
      sortOrder: 11,
    },
    {
      category: "Legacy Features",
      title: "How do legacy events work?",
      content: "Legacy events help you plan meaningful occasions to remember your loved one. You can create events like annual memorial services, birthday celebrations, or charitable activities in their honor. Invite family and friends, set reminders, and coordinate details all in one place. Events can be recurring or one-time occasions.",
      sortOrder: 12,
    },
    {
      category: "Payment & Billing",
      title: "What payment methods do you accept?",
      content: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. All transactions are encrypted and secure. We do not store your payment information on our servers.",
      sortOrder: 13,
    },
    {
      category: "Payment & Billing",
      title: "Are memorial pages free?",
      content: "Yes! Creating and maintaining a memorial page on Opictuary is completely free. You can add unlimited photos, videos, and memories at no cost. Optional features like fundraising (3% platform fee) and premium QR codes have associated costs, but the core memorial experience is free forever.",
      sortOrder: 14,
    },
    {
      category: "Technical Support",
      title: "Why can't I upload my photo/video?",
      content: "If you're having trouble uploading media:\n\n1. Check file size: Photos must be under 10MB, videos under 100MB\n2. Check format: Use JPG, PNG, or GIF for photos; MP4 or MOV for videos\n3. Check your internet connection\n4. Try a different browser (Chrome or Firefox recommended)\n5. Clear your browser cache and cookies\n\nIf problems persist, contact our support team with details about the error message you're seeing.",
      sortOrder: 15,
    },
    {
      category: "Account Management",
      title: "How do I change my email or password?",
      content: "To update your account information, click your profile icon in the top right corner and select 'Profile Settings'. From there you can update your email address, password, and notification preferences. For security reasons, you'll need to verify your current password before making changes.",
      sortOrder: 16,
    },
  ];

  const griefResources = [
    {
      category: "Crisis Hotlines",
      title: "National Suicide Prevention Lifeline",
      description: "24/7 free and confidential support for people in distress, prevention and crisis resources.",
      resourceType: "Hotline",
      phoneNumber: "988",
      availability: "24/7",
      isEmergency: true,
      isVerified: true,
      sortOrder: 1,
    },
    {
      category: "Crisis Hotlines",
      title: "Crisis Text Line",
      description: "Free 24/7 support for those in crisis. Text HELLO to 741741 to connect with a trained Crisis Counselor.",
      resourceType: "Text Support",
      phoneNumber: "741741",
      availability: "24/7",
      isEmergency: true,
      isVerified: true,
      sortOrder: 2,
    },
    {
      category: "Crisis Hotlines",
      title: "SAMHSA National Helpline",
      description: "Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental health and substance use disorders.",
      resourceType: "Hotline",
      phoneNumber: "1-800-662-4357",
      availability: "24/7",
      isEmergency: true,
      isVerified: true,
      sortOrder: 3,
    },
    {
      category: "Professional Counseling",
      title: "GriefShare",
      description: "Faith-based grief support groups and seminars led by trained facilitators. Find local meetings and online resources.",
      resourceType: "Support Program",
      url: "https://www.griefshare.org",
      availability: "Varies by location",
      isVerified: true,
      sortOrder: 4,
    },
    {
      category: "Professional Counseling",
      title: "The Dougy Center",
      description: "Provides grief support for children, teens, young adults, and their families. Offers both in-person and online resources.",
      resourceType: "Counseling",
      url: "https://www.dougy.org",
      phoneNumber: "1-503-775-5683",
      availability: "Mon-Fri 9am-5pm PT",
      isVerified: true,
      sortOrder: 5,
    },
    {
      category: "Professional Counseling",
      title: "BetterHelp Online Therapy",
      description: "Affordable online therapy with licensed counselors who specialize in grief and bereavement. Flexible scheduling and messaging options.",
      resourceType: "Online Therapy",
      url: "https://www.betterhelp.com",
      availability: "24/7 messaging, scheduled sessions",
      isVerified: true,
      sortOrder: 6,
    },
    {
      category: "Support Groups",
      title: "The Compassionate Friends",
      description: "National organization providing grief support after the death of a child. Local chapters, online community, and annual conferences.",
      resourceType: "Support Group",
      url: "https://www.compassionatefriends.org",
      phoneNumber: "1-877-969-0010",
      availability: "Varies by chapter",
      isVerified: true,
      sortOrder: 7,
    },
    {
      category: "Support Groups",
      title: "SOAR (Survivors of Addiction Related Loss)",
      description: "Support for those who have lost loved ones to substance use or addiction. Offers virtual and in-person meetings.",
      resourceType: "Support Group",
      url: "https://www.facebook.com/groups/SOAR99",
      availability: "Multiple weekly meetings",
      isVerified: true,
      sortOrder: 8,
    },
    {
      category: "Support Groups",
      title: "TAPS (Tragedy Assistance Program for Survivors)",
      description: "Support for families of fallen military service members. Offers peer support, counseling, and annual survivor seminars.",
      resourceType: "Support Program",
      url: "https://www.taps.org",
      phoneNumber: "1-800-959-8277",
      availability: "24/7",
      isVerified: true,
      sortOrder: 9,
    },
    {
      category: "Online Resources",
      title: "What's Your Grief",
      description: "Evidence-based articles, courses, and community for understanding and coping with grief. Covers all types of loss.",
      resourceType: "Educational",
      url: "https://whatsyourgrief.com",
      availability: "Always available",
      isVerified: true,
      sortOrder: 10,
    },
    {
      category: "Online Resources",
      title: "Refuge In Grief",
      description: "A different approach to grief support. Focuses on acknowledgment and companionship rather than fixing or moving on.",
      resourceType: "Educational",
      url: "https://refugeingrief.com",
      availability: "Always available",
      isVerified: true,
      sortOrder: 11,
    },
    {
      category: "Specialized Support",
      title: "American Foundation for Suicide Prevention",
      description: "Resources for suicide loss survivors including support groups, online community, and educational materials.",
      resourceType: "Support Organization",
      url: "https://afsp.org",
      availability: "24/7 online resources",
      isVerified: true,
      sortOrder: 12,
    },
    {
      category: "Specialized Support",
      title: "Mothers Against Drunk Driving (MADD)",
      description: "Support for victims of drunk driving crashes. Offers victim services, support groups, and court accompaniment.",
      resourceType: "Support Organization",
      url: "https://www.madd.org",
      phoneNumber: "1-877-MADD-HELP",
      availability: "Mon-Fri 8am-5pm CT",
      isVerified: true,
      sortOrder: 13,
    },
  ];

  console.log("📝 Creating support articles...");
  for (const article of supportArticles) {
    await storage.createSupportArticle(article);
  }
  console.log(`✅ Created ${supportArticles.length} support articles`);

  console.log("💚 Creating grief resources...");
  for (const resource of griefResources) {
    await storage.createGriefResource(resource);
  }
  console.log(`✅ Created ${griefResources.length} grief resources`);

  console.log("🎉 Support content seeding complete!");
}

seedSupportContent()
  .then(() => {
    console.log("✨ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding support content:", error);
    process.exit(1);
  });
