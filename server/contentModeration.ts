/**
 * Content Moderation System
 * Uses OpenAI's Moderation API for robust content filtering
 * Enhanced with comprehensive hate speech, racist slur, and violence detection
 */

import { openai } from "./openai";

const VULGAR_WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitting', 'shitty', 'shits',
  'bitch', 'bitching', 'bitches',
  'bastard', 'bastards',
  'piss', 'pissed', 'pissing',
  'dick', 'dicks',
  'cock', 'cocks',
  'pussy', 'pussies',
  'cunt', 'cunts',
  'whore', 'whores',
  'slut', 'sluts', 'slutty',
  'f**k', 'sh*t', 'b*tch', 'fck', 'fuk', 'fking',
  'retard', 'retarded',
  'kill yourself', 'drop dead',
];

const RACIST_SLURS = [
  'nigger', 'nigga', 'nigg3r', 'n1gger', 'n1gga',
  'chink', 'ch1nk',
  'spic', 'sp1c', 'spick',
  'wetback', 'w3tback',
  'kike', 'k1ke',
  'gook', 'g00k',
  'beaner', 'b3aner',
  'coon', 'c00n',
  'darkie', 'darky',
  'gringo',
  'honky', 'honkey',
  'jap',
  'raghead', 'towelhead', 'camelj0ckey',
  'redskin',
  'wop', 'w0p',
  'cracker',
  'zipperhead',
  'porch monkey',
  'jungle bunny',
  'sand nigger',
  'white trash',
  'trailer trash',
];

const HATE_SPEECH = [
  'white power', 'white supremacy', 'white pride',
  'heil hitler', 'sieg heil',
  'race war', 'race traitor',
  'ethnic cleansing',
  'go back to your country',
  'go back where you came from',
  'subhuman', 'sub human', 'sub-human',
  'master race',
  'inferior race',
  'born to serve',
  'mongrel',
  'half breed', 'half-breed',
  'mud blood', 'mudblood',
  'untermensch',
  'pure blood', 'pureblood',
  'racial purity',
  'genocide',
  'lynch',
  'gas the',
  'oven dodger',
  'lamp shade',
  'cotton picker',
];

const VIOLENT_LANGUAGE = [
  'kill yourself', 'kys',
  'drop dead',
  'die in a fire',
  'i hope you die',
  'you should die',
  'go die',
  'i will kill',
  'gonna kill',
  'death threat',
  'burn in hell',
  'rot in hell',
  'shoot up',
  'blow up',
  'bomb threat',
  'school shooting',
  'mass shooting',
  'terrorist attack',
  'suicide bomb',
  'stab you',
  'cut you',
  'beat you up',
  'curb stomp',
  'put a bullet',
  'slit your throat',
  'hang yourself',
];

const DISRESPECT_TO_DECEASED = [
  'glad they died', 'glad theyre dead', "glad they're dead",
  'deserved to die', 'deserved it',
  'good riddance',
  'burn in hell',
  'rot in hell',
  'rest in piss',
  'they deserved it',
  'should have died sooner',
  'nobody cares',
  'who cares',
  'waste of space',
  'waste of life',
  'better off dead',
  'finally dead',
  'about time',
  'took long enough',
  'dance on their grave',
  'spit on their grave',
  'fake tears',
  'crocodile tears',
];

const ALL_BLOCKED_TERMS = [
  ...VULGAR_WORDS,
  ...RACIST_SLURS,
  ...HATE_SPEECH,
  ...VIOLENT_LANGUAGE,
  ...DISRESPECT_TO_DECEASED,
];

const REPLACEMENT_CHAR = '*';

/**
 * Checks if text contains vulgar, racist, hateful, violent, or disrespectful language
 */
export function containsVulgarLanguage(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  return ALL_BLOCKED_TERMS.some(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[*]/g, '[\\w*]');
    const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    return wordRegex.test(lowerText);
  });
}

/**
 * Returns which categories of violations were found
 */
export function detectViolationCategories(text: string): string[] {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const categories: string[] = [];
  
  const check = (terms: string[], category: string) => {
    const found = terms.some(word => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[*]/g, '[\\w*]');
      const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
      return wordRegex.test(lowerText);
    });
    if (found) categories.push(category);
  };
  
  check(VULGAR_WORDS, 'profanity');
  check(RACIST_SLURS, 'racist_slur');
  check(HATE_SPEECH, 'hate_speech');
  check(VIOLENT_LANGUAGE, 'violence');
  check(DISRESPECT_TO_DECEASED, 'disrespect');
  
  return categories;
}

/**
 * Filters blocked language by replacing it with asterisks
 */
export function filterVulgarLanguage(text: string): string {
  if (!text) return text;
  
  let filteredText = text;
  
  ALL_BLOCKED_TERMS.forEach(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[*]/g, '[\\w*]');
    const wordRegex = new RegExp(`\\b${escaped}\\b`, 'gi');
    filteredText = filteredText.replace(wordRegex, (match) => {
      return REPLACEMENT_CHAR.repeat(match.length);
    });
  });
  
  return filteredText;
}

/**
 * CRITICAL SECURITY: Validates content using OpenAI's Moderation API
 * Enhanced with racist, hate speech, violence, and disrespect detection
 */
export async function moderateContent(text: string): Promise<{
  isClean: boolean;
  filteredText: string;
  originalText: string;
  categories?: string[];
  rejectionReason?: string;
}> {
  if (!text) {
    return {
      isClean: true,
      filteredText: text,
      originalText: text,
    };
  }

  try {
    const moderationResponse = await openai.moderations.create({
      input: text,
    });

    const result = moderationResponse.results[0];
    const isFlagged = result.flagged;
    
    const flaggedCategories: string[] = [];
    if (isFlagged) {
      Object.entries(result.categories).forEach(([category, flagged]) => {
        if (flagged) {
          flaggedCategories.push(category);
        }
      });
    }

    const hasVulgarWords = containsVulgarLanguage(text);
    const localCategories = detectViolationCategories(text);
    const filteredText = filterVulgarLanguage(text);

    const isClean = !isFlagged && !hasVulgarWords;
    
    const allCategories = [...flaggedCategories, ...localCategories];
    
    let rejectionReason: string | undefined;
    if (!isClean) {
      if (localCategories.includes('racist_slur') || flaggedCategories.includes('hate')) {
        rejectionReason = 'This content contains language that is racist or hateful. Please show respect for all people.';
      } else if (localCategories.includes('hate_speech')) {
        rejectionReason = 'This content contains hate speech. Memorial spaces are for honoring lives with dignity.';
      } else if (localCategories.includes('violence') || flaggedCategories.includes('violence') || flaggedCategories.includes('self-harm')) {
        rejectionReason = 'This content contains violent or threatening language. Please keep memorial spaces safe and respectful.';
      } else if (localCategories.includes('disrespect')) {
        rejectionReason = 'This content is disrespectful to the deceased. Please honor their memory with kindness.';
      } else {
        rejectionReason = 'This content contains inappropriate language. Please keep memorial spaces respectful.';
      }
    }

    return {
      isClean,
      filteredText,
      originalText: text,
      categories: allCategories.length > 0 ? allCategories : undefined,
      rejectionReason,
    };
  } catch (error) {
    console.error("[Content Moderation] OpenAI API error, falling back to regex:", error);
    
    const isClean = !containsVulgarLanguage(text);
    const localCategories = detectViolationCategories(text);
    const filteredText = filterVulgarLanguage(text);
    
    let rejectionReason: string | undefined;
    if (!isClean) {
      if (localCategories.includes('racist_slur')) {
        rejectionReason = 'This content contains language that is racist or hateful. Please show respect for all people.';
      } else if (localCategories.includes('hate_speech')) {
        rejectionReason = 'This content contains hate speech. Memorial spaces are for honoring lives with dignity.';
      } else if (localCategories.includes('violence')) {
        rejectionReason = 'This content contains violent or threatening language. Please keep memorial spaces safe and respectful.';
      } else if (localCategories.includes('disrespect')) {
        rejectionReason = 'This content is disrespectful to the deceased. Please honor their memory with kindness.';
      } else {
        rejectionReason = 'This content contains inappropriate language. Please keep memorial spaces respectful.';
      }
    }
    
    return {
      isClean,
      filteredText,
      originalText: text,
      categories: localCategories.length > 0 ? localCategories : undefined,
      rejectionReason,
    };
  }
}

/**
 * Moderates image content using OpenAI's Vision API
 * Checks for violent, graphic, or inappropriate imagery
 */
export async function moderateImage(imageUrl: string): Promise<{
  isClean: boolean;
  reason?: string;
}> {
  if (!imageUrl) {
    return { isClean: true };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a content moderator for a memorial platform that honors deceased individuals. Your job is to determine if an uploaded image is appropriate. Flag images that contain: violence, gore, blood, weapons being used aggressively, hate symbols (swastikas, confederate flags, KKK imagery), explicit sexual content, drug use, or anything disrespectful to the deceased. Sports-related images, family photos, nature scenes, and respectful memorial imagery are ALLOWED. Respond with ONLY a JSON object: {\"safe\": true} or {\"safe\": false, \"reason\": \"brief explanation\"}"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Is this image appropriate for a memorial platform?"
            },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" }
            }
          ]
        }
      ],
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content || '{"safe": true}';
    
    try {
      const parsed = JSON.parse(content);
      return {
        isClean: parsed.safe === true,
        reason: parsed.reason,
      };
    } catch {
      if (content.toLowerCase().includes('"safe": false') || content.toLowerCase().includes('"safe":false')) {
        return {
          isClean: false,
          reason: 'Image flagged as potentially inappropriate.',
        };
      }
      return { isClean: true };
    }
  } catch (error) {
    console.error("[Image Moderation] Error:", error);
    return { isClean: true };
  }
}
