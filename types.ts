
export enum QuestionType {
  IDENTIFICATION = 'identification',
  REGULATION = 'regulation',
  SAFETY = 'safety',
  GEAR = 'gear',
  ETHICS = 'ethics'
}

export enum Difficulty {
  EASY = 'helppo',
  NORMAL = 'normaali',
  HARD = 'vaikea'
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  imageCaption?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isExamMode: boolean;
  isFinished: boolean;
  startTime: number | null;
  timeLeft: number | null;
}

export interface QuizResults {
  score: number;
  total: number;
  passed: boolean;
  categoryScores: Record<QuestionType, { correct: number; total: number }>;
}

export interface Species {
  name: string;
  latin: string;
  en: string;
  group: string;
  info: string;
  images?: string[];
  commonsCategory?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserProfile {
  nickname: string;
  createdAt: number;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  records: {
    exam: number;
    matching: number;
    speed: number;
  };
  groupStats: Record<string, { correct: number; total: number }>;
}
