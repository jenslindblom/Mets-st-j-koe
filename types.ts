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
  timeLeft: number | null; // seconds
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

  /**
   * Vaihtoehto A: jos haluat joskus lukita tietyt kuvat käsin, lisää tänne suorat URLit.
   * (Tämä ohittaa commonsCategoryn.)
   */
  images?: string[];

  /**
   * Vaihtoehto B (suositus): Wikimedia Commons -kategoria, josta haetaan automaattisesti kuvia.
   * Muoto: "Category:Alces_alces"
   */
  commonsCategory?: string;
}
