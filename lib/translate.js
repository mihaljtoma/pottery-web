export async function autoTranslate(text, targetLanguage = 'en') {
  if (!text || text.trim().length === 0) return '';
  
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hr|${targetLanguage}`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      console.warn('Translation failed:', data);
      return text; // Fallback na original
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback
  }
}

// Batch translate multiple fields
export async function translateObject(obj, fieldsToTranslate = []) {
  const translated = { ...obj };
  
  for (const field of fieldsToTranslate) {
    if (translated[field]) {
      translated[field] = await autoTranslate(translated[field], 'en');
    }
  }
  
  return translated;
}