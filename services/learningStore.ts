
export interface LearningData {
  errorCounts: Record<string, number>;
  lastSeen: Record<string, number>;
}

const STORAGE_KEY = 'metsastaja_learning_data';

export const learningStore = {
  getData(): LearningData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { errorCounts: {}, lastSeen: {} };
    try {
      return JSON.parse(raw);
    } catch {
      return { errorCounts: {}, lastSeen: {} };
    }
  },

  recordError(speciesName: string) {
    const data = this.getData();
    data.errorCounts[speciesName] = (data.errorCounts[speciesName] || 0) + 1;
    data.lastSeen[speciesName] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  recordSuccess(speciesName: string) {
    const data = this.getData();
    // Jos vastaus on oikein, pienennetään virhepisteitä hitaasti
    if (data.errorCounts[speciesName] > 0) {
      data.errorCounts[speciesName] = Math.max(0, data.errorCounts[speciesName] - 0.5);
    }
    data.lastSeen[speciesName] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getPriorityWeight(speciesName: string): number {
    const data = this.getData();
    const errors = data.errorCounts[speciesName] || 0;
    // Mitä enemmän virheitä, sitä suurempi painoarvo (min 1)
    return 1 + (errors * 2);
  }
};
