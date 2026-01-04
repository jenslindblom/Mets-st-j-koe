
// Supabase-projektin tunnistetiedot
const SUPABASE_URL = 'https://mgmzogjnegdisceskcln.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_889SiXvcPN46nCM2_ObQTQ_aRG5N3dI';

export interface GlobalScore {
  nickname: string;
  score: number;
  type: 'exam' | 'matching' | 'speed';
  created_at?: string;
}

export const leaderboardService = {
  isEnabled(): boolean {
    return SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 10;
  },

  async submitScore(score: GlobalScore): Promise<boolean> {
    if (!this.isEnabled()) return false;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(score)
      });

      return response.ok;
    } catch (error) {
      console.error("Global leaderboard submission failed:", error);
      return false;
    }
  },

  async getTopScores(type: 'exam' | 'matching' | 'speed', limit: number = 10): Promise<GlobalScore[]> {
    if (!this.isEnabled()) return [];

    try {
      // Haetaan enemmän rivejä (esim. 100), jotta voimme suodattaa uniikit nimimerkit 
      // ja silti palauttaa riittävän määrän tuloksia (limit).
      const fetchLimit = Math.max(limit * 5, 100);
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leaderboard?type=eq.${type}&order=score.desc&limit=${fetchLimit}`, 
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("Supabase error response:", err);
        return [];
      }

      const allScores: GlobalScore[] = await response.json();
      
      // Suodatetaan vain yksi tulos per nimimerkki (korkein, koska lista on jo järjestetty).
      const seenNicknames = new Set<string>();
      const uniqueScores: GlobalScore[] = [];

      for (const entry of allScores) {
        if (!seenNicknames.has(entry.nickname)) {
          seenNicknames.add(entry.nickname);
          uniqueScores.push(entry);
        }
        if (uniqueScores.length >= limit) break;
      }

      return uniqueScores;
    } catch (error) {
      console.error("Global leaderboard fetch failed:", error);
      return [];
    }
  }
};
