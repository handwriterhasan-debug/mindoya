import { supabase } from '@/integrations/supabase/client';
import type { CVData } from '@/types/cv';

// Collect translatable strings + paths to set them back
type Setter = (value: string) => void;
type Entry = { value: string; set: Setter };

const isUrl = (s: string) => /^https?:\/\//i.test(s) || /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(s);
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const looksLikeData = (s: string) =>
  !s || isUrl(s) || isEmail(s) || /^[\d\s+\-().]+$/.test(s) || /^#[0-9a-f]{3,8}$/i.test(s);

const collect = (data: CVData, mutable: CVData): Entry[] => {
  const entries: Entry[] = [];

  const push = (value: string, set: Setter) => {
    if (typeof value !== 'string') return;
    if (looksLikeData(value)) return;
    entries.push({ value, set });
  };

  push(data.personal.jobTitle, (v) => { mutable.personal.jobTitle = v; });
  push(data.personal.location, (v) => { mutable.personal.location = v; });
  push(data.personal.summary, (v) => { mutable.personal.summary = v; });

  data.education.forEach((e, i) => {
    push(e.institution, (v) => { mutable.education[i].institution = v; });
    push(e.degree, (v) => { mutable.education[i].degree = v; });
    push(e.field, (v) => { mutable.education[i].field = v; });
    push(e.description, (v) => { mutable.education[i].description = v; });
  });

  data.experience.forEach((e, i) => {
    push(e.company, (v) => { mutable.experience[i].company = v; });
    push(e.position, (v) => { mutable.experience[i].position = v; });
    push(e.description, (v) => { mutable.experience[i].description = v; });
  });

  data.skills.forEach((s, i) => {
    push(s.name, (v) => { mutable.skills[i].name = v; });
  });

  data.languages.forEach((l, i) => {
    push(l.name, (v) => { mutable.languages[i].name = v; });
    push(l.proficiency, (v) => { mutable.languages[i].proficiency = v; });
  });

  data.hobbies.forEach((h, i) => {
    push(h, (v) => { mutable.hobbies[i] = v; });
  });

  data.achievements.forEach((a, i) => {
    push(a.title, (v) => { mutable.achievements[i].title = v; });
    push(a.description, (v) => { mutable.achievements[i].description = v; });
  });

  data.customSections.forEach((c, i) => {
    push(c.title, (v) => { mutable.customSections[i].title = v; });
    push(c.content, (v) => { mutable.customSections[i].content = v; });
  });

  return entries;
};

export async function translateCV(data: CVData, targetLang: string): Promise<CVData> {
  const clone: CVData = JSON.parse(JSON.stringify(data));
  const entries = collect(data, clone);
  if (entries.length === 0) return clone;

  // Chunk to keep prompt size sane
  const CHUNK = 40;
  for (let start = 0; start < entries.length; start += CHUNK) {
    const slice = entries.slice(start, start + CHUNK);
    const texts = slice.map((e) => e.value);

    const { data: res, error } = await supabase.functions.invoke('translate-cv', {
      body: { texts, targetLang },
    });

    if (error) {
      throw new Error(error.message || 'Translation failed');
    }
    const translations: string[] = res?.translations || [];
    slice.forEach((e, i) => {
      const t = translations[i];
      if (typeof t === 'string' && t.trim()) e.set(t);
    });
  }

  return clone;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi · हिन्दी' },
  { code: 'ur', label: 'Urdu · اردو' },
  { code: 'zh', label: 'Chinese · 中文' },
  { code: 'ja', label: 'Japanese · 日本語' },
  { code: 'ko', label: 'Korean · 한국어' },
  { code: 'es', label: 'Spanish · Español' },
  { code: 'fr', label: 'French · Français' },
  { code: 'ar', label: 'Arabic · العربية' },
  { code: 'de', label: 'German · Deutsch' },
  { code: 'pt', label: 'Portuguese · Português' },
  { code: 'ru', label: 'Russian · Русский' },
];
