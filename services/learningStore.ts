
import { UserProfile } from '../types';
import { leaderboardService } from './leaderboardService';

export interface ProfileData {
  profile: UserProfile;
  errorCounts: Record<string, number>;
  quizErrorCounts: Record<string, number>;
  lastSeen: Record<string, number>;
}

export interface GlobalData {
  profiles: Record<string, ProfileData>;
  activeProfileId: string | null;
}

const STORAGE_KEY = 'metsastaja_sim_v3';

export const learningStore = {
  getGlobalData(): GlobalData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profiles: {}, activeProfileId: null };
    try {
      return JSON.parse(raw);
    } catch {
      return { profiles: {}, activeProfileId: null };
    }
  },

  saveGlobalData(data: GlobalData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getActiveProfileData(): ProfileData | null {
    const data = this.getGlobalData();
    if (!data.activeProfileId) return null;
    return data.profiles[data.activeProfileId] || null;
  },

  getData(): { profile: UserProfile | null } {
    const active = this.getActiveProfileData();
    return { profile: active ? active.profile : null };
  },

  getAllProfiles(): UserProfile[] {
    const data = this.getGlobalData();
    return Object.keys(data.profiles).map(key => data.profiles[key].profile);
  },

  setActiveProfile(nickname: string) {
    const data = this.getGlobalData();
    data.activeProfileId = nickname;
    this.saveGlobalData(data);
  },

  createProfile(nickname: string) {
    const data = this.getGlobalData();
    if (data.profiles[nickname]) return;

    data.profiles[nickname] = {
      profile: {
        nickname,
        createdAt: Date.now(),
        totalPoints: 0,
        records: { exam: 0, matching: 0, speed: 0 }
      },
      errorCounts: {},
      quizErrorCounts: {},
      lastSeen: {}
    };
    data.activeProfileId = nickname;
    this.saveGlobalData(data);
  },

  updateRecord(type: 'exam' | 'matching' | 'speed', score: number) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    
    const pData = data.profiles[id];
    pData.profile.totalPoints += score;
    
    // Tarkistetaan onko uusi ennätys
    if (score > pData.profile.records[type]) {
      pData.profile.records[type] = score;
      
      // SYNKRONOINTI GLOBAALISTI:
      leaderboardService.submitScore({
        nickname: pData.profile.nickname,
        score: score,
        type: type
      });
    }
    this.saveGlobalData(data);
  },

  recordQuizError(questionId: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    pData.quizErrorCounts[questionId] = (pData.quizErrorCounts[questionId] || 0) + 1;
    this.saveGlobalData(data);
  },

  recordQuizSuccess(questionId: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    if (pData.quizErrorCounts[questionId] > 0) {
      pData.quizErrorCounts[questionId] = Math.max(0, pData.quizErrorCounts[questionId] - 0.5);
    }
    this.saveGlobalData(data);
  },

  getQuizWeight(questionId: string): number {
    const pData = this.getActiveProfileData();
    if (!pData) return 1;
    const errors = pData.quizErrorCounts[questionId] || 0;
    return 1 + (errors * 3);
  },

  recordError(speciesName: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    pData.errorCounts[speciesName] = (pData.errorCounts[speciesName] || 0) + 1;
    pData.lastSeen[speciesName] = Date.now();
    this.saveGlobalData(data);
  },

  recordSuccess(speciesName: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    if (pData.errorCounts[speciesName] > 0) {
      pData.errorCounts[speciesName] = Math.max(0, pData.errorCounts[speciesName] - 0.5);
    }
    pData.lastSeen[speciesName] = Date.now();
    this.saveGlobalData(data);
  },

  getPriorityWeight(speciesName: string): number {
    const pData = this.getActiveProfileData();
    if (!pData) return 1;
    const errors = pData.errorCounts[speciesName] || 0;
    return 1 + (errors * 2);
  },

  logout() {
    const data = this.getGlobalData();
    data.activeProfileId = null;
    this.saveGlobalData(data);
  }
};
