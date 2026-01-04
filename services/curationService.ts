
import { CURATED_DATA } from '../constants/curatedData';

const STORAGE_KEY = 'metsastaja_curated_images_v1';

export interface CuratedData {
  [speciesName: string]: string[]; // Lista URL-osoitteita
}

export const curationService = {
  getCuratedImages(): CuratedData {
    const raw = localStorage.getItem(STORAGE_KEY);
    let localData: CuratedData = {};
    if (raw) {
      try {
        localData = JSON.parse(raw);
        // Varmistetaan migraatio vanhasta string-muodosta arrayksi tarvittaessa
        Object.keys(localData).forEach(key => {
          if (typeof localData[key] === 'string') {
            localData[key] = [(localData[key] as unknown) as string];
          }
        });
      } catch {
        localData = {};
      }
    }

    // Yhdistetään kovakoodattu data ja localData. 
    // Jos localDatassa on entry lajille, se ylikirjoittaa hardcoded-valinnat.
    const merged: CuratedData = { ...CURATED_DATA };
    Object.keys(localData).forEach(species => {
      merged[species] = localData[species];
    });

    return merged;
  },

  toggleImage(speciesName: string, imageUrl: string) {
    const raw = localStorage.getItem(STORAGE_KEY);
    let localData: CuratedData = {};
    if (raw) {
      try { localData = JSON.parse(raw); } catch { localData = {}; }
    }

    // Jos localDatassa ei ole vielä tästä lajista mitään, kopioidaan hardcoded-pohja jotta voidaan muokata
    if (!localData[speciesName]) {
      localData[speciesName] = CURATED_DATA[speciesName] ? [...CURATED_DATA[speciesName]] : [];
    }
    
    const index = localData[speciesName].indexOf(imageUrl);
    if (index > -1) {
      localData[speciesName].splice(index, 1);
    } else {
      localData[speciesName].push(imageUrl);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
  },

  removeSpecies(speciesName: string) {
    const raw = localStorage.getItem(STORAGE_KEY);
    let localData: CuratedData = {};
    if (raw) {
      try { localData = JSON.parse(raw); } catch { localData = {}; }
    }
    
    // Jos poistamme kuraation kuraattorityökalussa, merkitsemme sen tyhjäksi arrayksi localStoraan
    // jotta se "peittää" mahdolliset hardcoded-kuvat (jos käyttäjä haluaa poistaa ne).
    localData[speciesName] = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
  },

  getLockedImages(speciesName: string): string[] {
    return this.getCuratedImages()[speciesName] || [];
  },

  exportAsJson(): string {
    return JSON.stringify(this.getCuratedImages(), null, 2);
  }
};
