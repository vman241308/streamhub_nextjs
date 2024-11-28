// Text cleaning utilities for the application
export function removeArabicText(text: string): string {
  return text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
}

export function removeSymbols(text: string): string {
  return text.replace(/[\u2000-\u3300]|[\uD83C-\uD83E][\uDC00-\uDFFF]|[\uD83E][\uDD10-\uDDFF]|[^\x20-\x7E\s]/g, '');
}

export function formatPipeSymbol(text: string): string {
  return text.replace(/\s*\|\s*/g, ' | ');
}

export function cleanupSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeSpecialChars(text: string): string {
  return text.replace(/\s*[\/&]\s*/g, ' ');
}

export function cleanupName(text: string): string {
  if (!text || !text.trim()) {
    return text;
  }

  // Chain the cleaning functions
  let cleanName = text;
  cleanName = removeArabicText(cleanName);
  cleanName = removeSymbols(cleanName);
  cleanName = formatPipeSymbol(cleanName);
  cleanName = removeSpecialChars(cleanName);
  cleanName = cleanupSpaces(cleanName);

  // If cleaning made it empty, return original
  return cleanName || text;
}
