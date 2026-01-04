
import { Species } from '../types';
import { curationService } from './curationService';

const categoryCache = new Map<string, Promise<string[]>>();
const searchCache = new Map<string, Promise<string[]>>();

export const getDeterministicLock = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1000;
};

export const buildFilePathUrl = (fileTitle: string, width = 800) => {
  const fileName = fileTitle.replace(/^File:/, '');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
};

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

const BANNED_KEYWORDS = [
  'svg', 'icon', 'logo', 'map', 'diagram', 'chart', 'coat of arms', 'symbol', 'flag', 
  'skull', 'skeleton', 'bones', 'track', 'scat', 'droppings', 'feather', 'egg', 'nest', 
  'footprint', 'silhouette', 'drawing', 'illustration', 'painting', 'engraving', 'taxonomy', 'distribution'
];

function normalizeTitleToFileName(fileTitle: string): string {
  return fileTitle.replace(/^File:/, '');
}

function hasAllowedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXT.some(ext => lower.endsWith(ext));
}

function isBannedByKeyword(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return BANNED_KEYWORDS.some(k => lower.includes(k));
}

function scoreFileName(fileName: string): number {
  const lower = fileName.toLowerCase();
  let score = 0;
  const good = ['male', 'female', 'adult', 'juvenile', 'portrait', 'closeup', 'finland'];
  for (const g of good) if (lower.includes(g)) score += 5;
  if (!/img[_\s-]?\d+/i.test(fileName)) score += 1;
  return score;
}

function normalizeCategoryTitle(categoryTitle: string): string {
  if (!categoryTitle) return categoryTitle;
  return categoryTitle.startsWith('Category:') ? categoryTitle : `Category:${categoryTitle}`;
}

/**
 * Hakee tiedostoja tietystä kategoriasta.
 */
export async function fetchCategoryFiles(categoryTitleRaw: string): Promise<string[]> {
  const categoryTitle = normalizeCategoryTitle(categoryTitleRaw);
  if (categoryCache.has(categoryTitle)) return categoryCache.get(categoryTitle)!;

  const promise = (async () => {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=categorymembers&cmtitle=${encodeURIComponent(categoryTitle)}&cmtype=file&cmlimit=100`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const members: Array<{ title: string }> = data?.query?.categorymembers ?? [];
      const titles = members.map(m => m.title).filter(t => t && t.startsWith('File:'));
      
      const filtered = titles
        .map(t => ({ title: t, fileName: normalizeTitleToFileName(t) }))
        .filter(x => hasAllowedExtension(x.fileName) && !isBannedByKeyword(x.fileName))
        .map(x => ({ ...x, score: scoreFileName(x.fileName) }))
        .sort((a, b) => b.score - a.score)
        .map(x => x.title);

      return filtered.length > 0 ? filtered : titles;
    } catch {
      return [];
    }
  })();

  categoryCache.set(categoryTitle, promise);
  return promise;
}

/**
 * Suorittaa vapaan tekstikuvan haun Commonsista. 
 * Erinomainen silloin kun kategoriaa ei löydy.
 */
export async function searchCommonsFiles(query: string): Promise<string[]> {
  if (searchCache.has(query)) return searchCache.get(query)!;

  const promise = (async () => {
    try {
      // Käytetään MediaSearch APIa, joka on tarkoitettu kuvien hakemiseen
      const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      
      const pages = data?.query?.pages || {};
      const titles = Object.values(pages).map((p: any) => p.title).filter(t => t && t.startsWith('File:'));

      const filtered = titles
        .map(t => ({ title: t, fileName: normalizeTitleToFileName(t) }))
        .filter(x => hasAllowedExtension(x.fileName) && !isBannedByKeyword(x.fileName))
        .map(x => ({ ...x, score: scoreFileName(x.fileName) }))
        .sort((a, b) => b.score - a.score)
        .map(x => x.title);

      return filtered;
    } catch {
      return [];
    }
  })();

  searchCache.set(query, promise);
  return promise;
}

export async function resolveSpeciesImages(
  species: Species,
  width = 800
): Promise<{ imageUrl?: string; fallbackImageUrl?: string }> {
  // 1. TARKISTA KURATOIDUT KUVAT
  const lockedUrls = curationService.getLockedImages(species.name);
  if (lockedUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * lockedUrls.length);
    return { imageUrl: lockedUrls[randomIndex] };
  }

  // 2. TARKISTA MANUAALINEN LISTA (CONSTANTS.TS)
  const lock = getDeterministicLock(species.name);
  const manual = species.images ?? [];
  if (manual.length > 0) {
    const primary = manual[lock % manual.length].replace('/wiki/Special:FilePath/', '/wiki/Special:Redirect/file/');
    return { imageUrl: primary };
  }

  // 3. AUTOMAATTINEN HAKU COMMONSISTA
  if (!species.commonsCategory) return {};

  const files = await fetchCategoryFiles(species.commonsCategory);
  if (files.length === 0) return {};

  const primaryFile = files[lock % files.length];
  const fallbackFile = files.length > 1 ? files[(lock + 1) % files.length] : undefined;

  return {
    imageUrl: buildFilePathUrl(primaryFile, width),
    fallbackImageUrl: fallbackFile ? buildFilePathUrl(fallbackFile, width) : undefined
  };
}
