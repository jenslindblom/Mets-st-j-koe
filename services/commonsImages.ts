// src/services/commonsImages.ts
import { Species } from '../types';

// --- Wikimedia Commons -kuvien haku (MediaWiki API) ---

// Promise-cache: category -> Promise<["File:xxx.jpg", ...]>
const categoryCache = new Map<string, Promise<string[]>>();

export const getDeterministicLock = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1000;
};

export const buildFilePathUrl = (fileTitle: string, width = 1200) => {
  const fileName = fileTitle.replace(/^File:/, '');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
};

// --- laatu-/relevanssisuodatus Commons-fileille ---

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// Huom: tämä on filename-heuristiikka. Ei täydellinen, mutta käytännössä tehokas.
const BANNED_KEYWORDS = [
  'svg',
  'icon',
  'logo',
  'map',
  'diagram',
  'chart',
  'coat of arms',
  'symbol',
  'flag',
  'skull',
  'skeleton',
  'bones',
  'track',
  'tracks',
  'scat',
  'droppings',
  'feather',
  'feathers',
  'egg',
  'eggs',
  'nest',
  'nests',
  'footprint',
  'footprints',
  'silhouette',
  'drawing',
  'illustration',
  'painting',
  'engraving',
  'taxonomy',
  'distribution',
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

  // “nice-to-have” -vihjeet; näistä ei kannata tehdä liian vahvoja.
  const good = ['male', 'female', 'adult', 'juvenile', 'in flight', 'portrait', 'closeup', 'finland', 'sweden', 'norway'];
  for (const g of good) if (lower.includes(g)) score += 5;

  const meh = ['zoo', 'captive', 'museum', 'specimen'];
  for (const m of meh) if (lower.includes(m)) score -= 3;

  // “IMG_1234” tyyppiset nimet on usein random-kuvia, mutta joskus ihan hyviä.
  // Pieni plussa jos EI ole pelkkä img_####.
  if (!/img[_\s-]?\d+/i.test(fileName)) score += 1;

  return score;
}

function normalizeCategoryTitle(categoryTitle: string): string {
  // hyväksy molemmat: "Category:Alces_alces" ja "Alces_alces"
  if (!categoryTitle) return categoryTitle;
  return categoryTitle.startsWith('Category:') ? categoryTitle : `Category:${categoryTitle}`;
}

async function fetchCategoryFiles(categoryTitleRaw: string): Promise<string[]> {
  const categoryTitle = normalizeCategoryTitle(categoryTitleRaw);

  if (categoryCache.has(categoryTitle)) return categoryCache.get(categoryTitle)!;

  const promise = (async () => {
    const url =
      `https://commons.wikimedia.org/w/api.php` +
      `?action=query&format=json&origin=*` +
      `&list=categorymembers` +
      `&cmtitle=${encodeURIComponent(categoryTitle)}` +
      `&cmtype=file` +
      `&cmlimit=300`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Commons API failed: ${res.status}`);
    const data = await res.json();

    const members: Array<{ title: string }> = data?.query?.categorymembers ?? [];
    const titles = members
      .map(m => m.title)
      .filter(t => typeof t === 'string' && t.startsWith('File:'));

    const filtered = titles
      .map(t => ({ title: t, fileName: normalizeTitleToFileName(t) }))
      .filter(x => hasAllowedExtension(x.fileName))
      .filter(x => !isBannedByKeyword(x.fileName))
      .map(x => ({ ...x, score: scoreFileName(x.fileName) }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.title);

    // TÄRKEÄ PÄÄTÖS:
    // Jos suodatus tappaa kaiken, pudotaan takaisin Commonsin raw-listaan,
    // jotta kuvat eivät katoa kokonaan.
    return filtered.length > 0 ? filtered : titles;
  })();

  categoryCache.set(categoryTitle, promise);
  return promise;
}

export async function resolveSpeciesImages(
  species: Species,
  width = 1200
): Promise<{ imageUrl?: string; fallbackImageUrl?: string }> {
  const lock = getDeterministicLock(species.name);

  // 1) manuaalinen ohitus, jos images[] annettu
  const manual = species.images ?? [];
  if (manual.length > 0) {
    const primary = manual[lock % manual.length].replace('/wiki/Special:FilePath/', '/wiki/Special:Redirect/file/');
    const secondary = manual.length > 1
      ? manual[(lock + 1) % manual.length].replace('/wiki/Special:FilePath/', '/wiki/Special:Redirect/file/')
      : undefined;
    return { imageUrl: primary, fallbackImageUrl: secondary };
  }

  // 2) muuten Commons-kategoria
  if (!species.commonsCategory) return { imageUrl: undefined, fallbackImageUrl: undefined };

  const files = await fetchCategoryFiles(species.commonsCategory);
  if (files.length === 0) return { imageUrl: undefined, fallbackImageUrl: undefined };

  const primaryFile = files[lock % files.length];
  const fallbackFile = files.length > 1 ? files[(lock + 1) % files.length] : undefined;

  return {
    imageUrl: buildFilePathUrl(primaryFile, width),
    fallbackImageUrl: fallbackFile ? buildFilePathUrl(fallbackFile, width) : undefined
  };
}

/**
 * Optional helper for dev/tests.
 * (Ei pakollinen, mutta hyödyllinen kun vaihdetaan suodatusta.)
 */
export function clearCommonsCategoryCache() {
  categoryCache.clear();
}
