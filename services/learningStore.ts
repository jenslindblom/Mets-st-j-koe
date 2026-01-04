
import { UserProfile, Achievement, QuestionType } from '../types';
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

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'bird_expert', title: 'Lintuasiantuntija', description: 'Tunnista 50 lintulajia', icon: '🦆' },
  { id: 'safety_guru', title: 'Turvallisuusguru', description: '100% oikein turvallisuusosiossa', icon: '🛡️' },
  { id: 'night_owl', title: 'Yökyöpeli', description: 'Opiskele yömyöhään', icon: '🦉' },
  { id: 'exam_master', title: 'Simulaattori-ässä', description: 'Läpäise koesimulaatio', icon: '🏅' },
  { id: 'speed_demon', title: 'Pikakivääri', description: 'Sata pistettä pikatunnistuksessa', icon: '⚡' }
];

export const learningStore = {
  getGlobalData(): GlobalData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profiles: {}, activeProfileId: null };
    try {
      const data = JSON.parse(raw) as GlobalData;
      if (data.profiles) {
        Object.keys(data.profiles).forEach(id => {
          data.profiles[id].profile = this.hydrateProfile(data.profiles[id].profile);
        });
      }
      return data;
    } catch {
      return { profiles: {}, activeProfileId: null };
    }
  },

  hydrateProfile(p: any): UserProfile {
    return {
      ...p,
      nickname: p.nickname || 'Metsästäjä',
      totalPoints: p.totalPoints || 0,
      level: p.level || 1,
      achievements: p.achievements || [...INITIAL_ACHIEVEMENTS],
      records: p.records || { exam: 0, matching: 0, speed: 0 },
      groupStats: p.groupStats || {}
    };
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
    if (!data.profiles) return [];
    return Object.keys(data.profiles).map(key => data.profiles[key].profile);
  },

  setActiveProfile(nickname: string) {
    const data = this.getGlobalData();
    data.activeProfileId = nickname;
    this.saveGlobalData(data);
  },

  nicknameExists(nickname: string): boolean {
    const data = this.getGlobalData();
    return !!data.profiles[nickname];
  },

  createProfile(nickname: string) {
    const data = this.getGlobalData();
    if (data.profiles[nickname]) return;

    data.profiles[nickname] = {
      profile: {
        nickname,
        createdAt: Date.now(),
        totalPoints: 0,
        level: 1,
        achievements: [...INITIAL_ACHIEVEMENTS],
        records: { exam: 0, matching: 0, speed: 0 },
        groupStats: {}
      },
      errorCounts: {},
      quizErrorCounts: {},
      lastSeen: {}
    };
    data.activeProfileId = nickname;
    this.saveGlobalData(data);
  },

  checkAchievements(pData: ProfileData) {
    const profile = pData.profile;
    const now = new Date();
    
    if (now.getHours() >= 22 || now.getHours() <= 4) {
      this.unlockAchievement(pData, 'night_owl');
    }

    let birdCorrect = 0;
    Object.keys(profile.groupStats || {}).forEach(group => {
      if (group.toLowerCase().includes('linnu')) {
        birdCorrect += profile.groupStats[group].correct;
      }
    });
    if (birdCorrect >= 50) this.unlockAchievement(pData, 'bird_expert');

    const newLevel = Math.floor(Math.sqrt(profile.totalPoints / 100)) + 1;
    profile.level = newLevel;
  },

  unlockAchievement(pData: ProfileData, id: string) {
    const ach = pData.profile.achievements.find(a => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = Date.now();
    }
  },

  updateRecord(type: 'exam' | 'matching' | 'speed', score: number, results?: any) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    
    const pData = data.profiles[id];
    pData.profile.totalPoints += score;

    if (type === 'exam' && score >= 45) {
      this.unlockAchievement(pData, 'exam_master');
      if (results?.categoryScores?.[QuestionType.SAFETY]?.correct === results?.categoryScores?.[QuestionType.SAFETY]?.total) {
        this.unlockAchievement(pData, 'safety_guru');
      }
    }

    if (type === 'speed' && score >= 100) {
      this.unlockAchievement(pData, 'speed_demon');
    }
    
    if (!pData.profile.records) pData.profile.records = { exam: 0, matching: 0, speed: 0 };
    
    if (score > pData.profile.records[type]) {
      pData.profile.records[type] = score;
      leaderboardService.submitScore({
        nickname: pData.profile.nickname,
        score: score,
        type: type
      });
    }

    this.checkAchievements(pData);
    this.saveGlobalData(data);
  },

  recordSpeciesResult(speciesGroup: string, isCorrect: boolean) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    
    if (!pData.profile.groupStats) pData.profile.groupStats = {};
    if (!pData.profile.groupStats[speciesGroup]) {
      pData.profile.groupStats[speciesGroup] = { correct: 0, total: 0 };
    }
    
    pData.profile.groupStats[speciesGroup].total += 1;
    if (isCorrect) pData.profile.groupStats[speciesGroup].correct += 1;
    
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

  recordError(speciesName: string, speciesGroup: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    pData.errorCounts[speciesName] = (pData.errorCounts[speciesName] || 0) + 1;
    pData.lastSeen[speciesName] = Date.now();
    this.recordSpeciesResult(speciesGroup, false);
    this.saveGlobalData(data);
  },

  recordSuccess(speciesName: string, speciesGroup: string) {
    const data = this.getGlobalData();
    const id = data.activeProfileId;
    if (!id || !data.profiles[id]) return;
    const pData = data.profiles[id];
    if (pData.errorCounts[speciesName] > 0) {
      pData.errorCounts[speciesName] = Math.max(0, pData.errorCounts[speciesName] - 0.5);
    }
    pData.lastSeen[speciesName] = Date.now();
    this.recordSpeciesResult(speciesGroup, true);
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
