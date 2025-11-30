/**
 * Content Moderation System
 * Uses OpenAI's Moderation API for robust content filtering
 */

import { openai } from "./openai";

const VULGAR_WORDS = [
  // Strong profanity only (including common variants)
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
  // Variants with common letter substitutions
  'f**k', 'sh*t', 'b*tch', 'fck', 'fuk', 'fking',
  // Truly offensive slurs and terms  
  'retard', 'retarded',
  // Direct attacks
  'kill yourself', 'drop dead',
];

const REPLACEMENT_CHAR = '*';

/**
 * Checks if text contains vulgar or disrespectful language (fallback method)
 */
export function containsVulgarLanguage(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  return VULGAR_WORDS.some(word => {
    // Check for whole word matches
    const wordRegex = new RegExp(`\\b${word.replace(/[*]/g, '[\\w*]')}\\b`, 'i');
    return wordRegex.test(lowerText);
  });
}

/**
 * Filters vulgar language by replacing it with asterisks
 */
export function filterVulgarLanguage(text: string): string {
  if (!text) return text;
  
  let filteredText = text;
  
  VULGAR_WORDS.forEach(word => {
    const wordRegex = new RegExp(`\\b${word.replace(/[*]/g, '[\\w*]')}\\b`, 'gi');
    filteredText = filteredText.replace(wordRegex, (match) => {
      return REPLACEMENT_CHAR.repeat(match.length);
    });
  });
  
  return filteredText;
}

/**
 * CRITICAL SECURITY: Validates content using OpenAI's Moderation API
 * This is an ASYNC function that MUST be awaited
 * @param text - Content to moderate
 * @returns Promise with moderation result
 */
export async function moderateContent(text: string): Promise<{
  isClean: boolean;
  filteredText: string;
  originalText: string;
  categories?: string[];
}> {
  if (!text) {
    return {
      isClean: true,
      filteredText: text,
      originalText: text,
    };
  }

  try {
    // CRITICAL: Use OpenAI's Moderation API for robust content filtering
    const moderationResponse = await openai.moderations.create({
      input: text,
    });

    const result = moderationResponse.results[0];
    const isFlagged = result.flagged;
    
    // Collect flagged categories for logging
    const flaggedCategories: string[] = [];
    if (isFlagged) {
      Object.entries(result.categories).forEach(([category, flagged]) => {
        if (flagged) {
          flaggedCategories.push(category);
        }
      });
    }

    // Also apply regex-based filter as additional layer
    const hasVulgarWords = containsVulgarLanguage(text);
    const filteredText = filterVulgarLanguage(text);

    // Content is clean only if BOTH checks pass
    const isClean = !isFlagged && !hasVulgarWords;

    return {
      isClean,
      filteredText,
      originalText: text,
      categories: isFlagged ? flaggedCategories : undefined,
    };
  } catch (error) {
    console.error("[Content Moderation] OpenAI API error, falling back to regex:", error);
    
    // FALLBACK: If OpenAI API fails, use regex-based moderation
    const isClean = !containsVulgarLanguage(text);
    const filteredText = filterVulgarLanguage(text);
    
    return {
      isClean,
      filteredText,
      originalText: text,
    };
  }
}
