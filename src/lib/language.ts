import translations from './translations.json';
export type Language = 'id' | 'en';
const dictionary: Record<string,string> = translations;
const keys = Object.keys(dictionary).filter(key=>key.length>2).sort((a,b)=>b.length-a.length);
const pattern = new RegExp(keys.map(key=>key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
export function translate(value: string | undefined, language: Language): string {
  const text = value ?? '';
  if (language === 'id') return text;
  if (dictionary[text]) return dictionary[text];
  // Composed labels retain interpolated names, counts and stored record values.
  return text.replace(pattern, match=>dictionary[match] ?? match).replace(/\b1 minutes\b/g,'1 minute').replace(/\b1 years\b/g,'1 year').replace(/\b1 months\b/g,'1 month');
}