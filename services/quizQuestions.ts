// src/services/quizQuestions.ts
import { Difficulty, Question, QuestionType, Species } from '../types';

/**
 * Luo yhden lajintunnistuskysymyksen per laji.
 * - 4 vaihtoehtoa: oikea + 3 harhauttajaa
 * - Suosi samaa groupia harhauttajissa, täydennä muualta jos ei riitä
 */
export function buildIdentificationQuestions(speciesDb: Species[]): Question[] {
  const byGroup = new Map<string, Species[]>();
  for (const s of speciesDb) {
    if (!byGroup.has(s.group)) byGroup.set(s.group, []);
    byGroup.get(s.group)!.push(s);
  }

  const pickRandomDistinct = (pool: Species[], excludeName: string, count: number): Species[] => {
    const candidates = pool.filter(x => x.name !== excludeName);
    // shuffle
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  return speciesDb.map((s) => {
    const sameGroup = byGroup.get(s.group) ?? [];
    let distractors = pickRandomDistinct(sameGroup, s.name, 3);

    if (distractors.length < 3) {
      const needed = 3 - distractors.length;
      const otherPool = speciesDb.filter(x => x.group !== s.group);
      const extra = pickRandomDistinct(otherPool, s.name, needed);
      distractors = [...distractors, ...extra];
    }

    const options = [s, ...distractors].map(x => x.name).sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(s.name);

    const q: Question = {
      id: `id-${encodeURIComponent(s.name)}`,
      type: QuestionType.IDENTIFICATION,
      difficulty: Difficulty.NORMAL,
      question: 'Mikä eläin on kyseessä?',
      options,
      correctIndex,
      explanation: s.info,
      // imageUrl/fallbackImageUrl täytetään Appissa resolveSpeciesImages:lla
      imageUrl: undefined,
      fallbackImageUrl: undefined,
      imageCaption: `${s.group}: ${s.name}`,
    };

    return q;
  });
}
