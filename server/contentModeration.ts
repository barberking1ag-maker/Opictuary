/**
 * Content Moderation System
 * Filters vulgar and disrespectful language from user-generated content
 */

const VULGAR_WORDS = [
  // Strong profanity only
  'fuck', 'shit', 'bitch', 'bastard', 
  'piss', 'dick', 'cock', 'pussy', 'cunt', 'whore', 'slut',
  // Variants with common letter substitutions
  'f**k', 'sh*t', 'b*tch', 'fck', 'fuk',
  // Truly offensive slurs and terms  
  'retard', 'retarded',
  // Direct attacks
  'kill yourself', 'drop dead',
];

const REPLACEMENT_CHAR = '*';

/**
 * Checks if text contains vulgar or disrespectful language
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
 * Validates content and returns filtered version with validation result
 */
export function moderateContent(text: string): {
  isClean: boolean;
  filteredText: string;
  originalText: string;
} {
  const isClean = !containsVulgarLanguage(text);
  const filteredText = filterVulgarLanguage(text);
  
  return {
    isClean,
    filteredText,
    originalText: text,
  };
}
