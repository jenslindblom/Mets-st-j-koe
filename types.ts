
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
  fallbackImageUrl?: string; // Varmistuskuva
  imageCaption?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isExamMode: boolean;
  isFinished: boolean;
  startTime: number | null;
  timeLeft: number | null; // seconds
}

export interface QuizResults {
  score: number;
  total: number;
  passed: boolean;
  categoryScores: Record<QuestionType, { correct: number; total: number }>;
}
