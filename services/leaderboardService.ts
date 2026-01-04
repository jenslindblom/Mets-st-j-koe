
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
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leaderboard?type=eq.${type}&order=score.desc&limit=${limit}`, 
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
      return await response.json();
    } catch (error) {
      console.error("Global leaderboard fetch failed:", error);
      return [];
    }
  }
};
