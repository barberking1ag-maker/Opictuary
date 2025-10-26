// Message templates for scheduled messages

export interface MessageTemplate {
  id: string;
  name: string;
  eventType: string;
  message: string;
  description: string;
}

export const messageTemplates: MessageTemplate[] = [
  // Birthday Templates
  {
    id: "birthday-1",
    name: "Birthday Wishes",
    eventType: "birthday",
    description: "Heartfelt birthday message from a loved one",
    message: "Happy Birthday, my dear!\n\nEven though I can't be there in person, I want you to know that I'm celebrating with you in spirit. I hope this year brings you joy, success, and all the happiness you deserve.\n\nRemember that you are loved beyond measure and that I'm always watching over you.\n\nWith all my love,\n[Your Name]"
  },
  {
    id: "birthday-2",
    name: "Milestone Birthday",
    eventType: "birthday",
    description: "Special message for a milestone birthday",
    message: "To my beloved [Recipient],\n\nCongratulations on reaching this incredible milestone! This is a special birthday, and I wish I could be there to celebrate with you.\n\nI'm so proud of the person you've become and all that you've accomplished. Continue to chase your dreams and live life to the fullest.\n\nHappy Birthday!\nAll my love, always"
  },
  
  // Graduation Templates
  {
    id: "graduation-1",
    name: "Graduation Celebration",
    eventType: "graduation",
    description: "Proud message for graduation day",
    message: "Congratulations on your graduation!\n\nI am bursting with pride for all your hard work and dedication. This is just the beginning of an amazing journey.\n\nAs you step into this new chapter, remember that you have the strength and intelligence to achieve anything you set your mind to.\n\nI'll always be cheering you on from above.\n\nWith immense pride and love,\n[Your Name]"
  },
  {
    id: "graduation-2",
    name: "Graduate Encouragement",
    eventType: "graduation",
    description: "Encouraging message for new graduate",
    message: "My dearest [Recipient],\n\nToday you graduate, and I couldn't be prouder! You've worked so hard to reach this moment, and you deserve every bit of success that comes your way.\n\nThe world is waiting for someone like you to make a difference. Go out there and shine!\n\nRemember, I'm always with you in spirit.\n\nCongratulations and all my love!"
  },
  
  // Wedding Templates
  {
    id: "wedding-1",
    name: "Wedding Day Blessing",
    eventType: "wedding",
    description: "Loving message for wedding day",
    message: "My darling [Recipient],\n\nOn your wedding day, I want you to know how happy I am for you. Though I can't be there to see you walk down the aisle, I'm there in spirit, smiling with joy.\n\nMay your marriage be filled with love, laughter, and endless happiness. Cherish each other, support one another, and never forget how special your love is.\n\nCongratulations on finding your perfect match!\n\nWith all my love and blessings,\n[Your Name]"
  },
  {
    id: "wedding-2",
    name: "Wedding Advice",
    eventType: "wedding",
    description: "Heartfelt wedding day wishes",
    message: "To my beloved [Recipient],\n\nToday marks the beginning of your beautiful journey together. Marriage is an adventure filled with love, growth, and cherished moments.\n\nAlways communicate, laugh together, and hold each other close during both the good times and the challenges.\n\nI'm so happy you've found your soulmate. May your love story be everything you've ever dreamed of.\n\nAll my love on your special day!"
  },
  
  // Anniversary Templates
  {
    id: "anniversary-1",
    name: "Anniversary Wishes",
    eventType: "anniversary",
    description: "Celebrating years of love",
    message: "Happy Anniversary!\n\nSeeing the love you and your partner share brings me such joy. Another year together is another year of beautiful memories.\n\nMay you continue to grow stronger together and create countless more moments of happiness.\n\nI'm so proud of the life you've built together.\n\nWith all my love,\n[Your Name]"
  },
  
  // Baby Birth Templates
  {
    id: "baby-1",
    name: "New Baby Congratulations",
    eventType: "baby_birth",
    description: "Welcoming a new baby",
    message: "Congratulations on your beautiful baby!\n\nWhat an incredible blessing! I wish I could hold this precious little one in my arms, but I'll be watching over them from above.\n\nMay parenthood bring you immeasurable joy, and may your baby grow up healthy, happy, and surrounded by love.\n\nWelcome to the world, little one!\n\nWith all my love,\n[Your Name]"
  },
  {
    id: "baby-2",
    name: "First Birthday",
    eventType: "baby_birth",
    description: "Baby's first birthday message",
    message: "Happy First Birthday to your precious little one!\n\nIt's amazing how fast time flies! This first year has been filled with so many firsts and wonderful memories.\n\nI may not be there to see your child blow out their first candle, but I'm celebrating with you in spirit.\n\nMay this beautiful child continue to grow and bring you endless joy.\n\nAll my love!"
  },
  
  // Holiday Templates
  {
    id: "mother-day",
    name: "Mother's Day Love",
    eventType: "mother_day",
    description: "Honoring mothers on Mother's Day",
    message: "Happy Mother's Day!\n\nToday is a day to celebrate you and all the love you give. Being a mother is the most important job in the world, and you're doing an amazing job.\n\nThank you for your strength, your kindness, and your unconditional love. You mean the world to me.\n\nWith all my appreciation and love,\n[Your Name]"
  },
  {
    id: "father-day",
    name: "Father's Day Appreciation",
    eventType: "father_day",
    description: "Celebrating fathers",
    message: "Happy Father's Day!\n\nYou are an incredible father, and I'm so grateful for everything you do. Your love, guidance, and support mean more than words can express.\n\nThank you for being such a wonderful role model and for all the sacrifices you make.\n\nI love you and appreciate you more than you know!\n\nWith all my love,\n[Your Name]"
  },
  {
    id: "christmas",
    name: "Christmas Blessings",
    eventType: "christmas",
    description: "Christmas holiday message",
    message: "Merry Christmas!\n\nThe holiday season is a time for family, love, and reflection. Though I can't be with you in person this Christmas, I'm with you in spirit.\n\nMay your holiday be filled with warmth, joy, and the magic of the season. Cherish the time with loved ones and create beautiful memories.\n\nWishing you peace and happiness this Christmas and always.\n\nWith all my love,\n[Your Name]"
  },
  {
    id: "new-year",
    name: "New Year Message",
    eventType: "new_year",
    description: "New Year's wishes",
    message: "Happy New Year!\n\nAs you step into this new year, I want you to know how much I believe in you. This year holds so much promise and potential.\n\nMay you find success in all your endeavors, experience joy in the little things, and grow in ways you never imagined.\n\nHere's to new beginnings and wonderful adventures ahead!\n\nWith all my love,\n[Your Name]"
  },
  
  // Custom/General Templates
  {
    id: "encouragement",
    name: "Words of Encouragement",
    eventType: "custom",
    description: "General encouragement message",
    message: "My dear [Recipient],\n\nI wanted to send you this message to remind you how special and capable you are. Life may throw challenges your way, but I know you have the strength to overcome them.\n\nBelieve in yourself as much as I believe in you. You are loved, you are valued, and you are never alone.\n\nKeep moving forward and know that I'm always cheering you on.\n\nWith all my love and support,\n[Your Name]"
  },
  {
    id: "thinking-of-you",
    name: "Thinking of You",
    eventType: "custom",
    description: "Letting them know you're thinking of them",
    message: "Hello my dear,\n\nI just wanted to reach out and let you know that you're in my thoughts today and every day.\n\nNo matter what you're going through, remember that you are loved beyond measure and that you have someone watching over you.\n\nI hope this message brings you comfort and reminds you that you're never truly alone.\n\nAll my love, always,\n[Your Name]"
  },
];

export function getTemplatesByEventType(eventType: string): MessageTemplate[] {
  return messageTemplates.filter(template => template.eventType === eventType);
}

export function getTemplateById(id: string): MessageTemplate | undefined {
  return messageTemplates.find(template => template.id === id);
}
