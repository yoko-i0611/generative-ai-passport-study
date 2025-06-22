export type Course = {
  id: string;
  title: string;
  description: string;
  difficulty: '初級' | '中級' | '上級' | '第1章' | '第2章' | '第3章' | '第4章' | '第5章';
  time: string;
  link: string;
  image: string;
  color: 'primary' | 'secondary' | 'accent' | 'info' | 'yellow';
  content: string; // 教材コンテンツ
  quiz: Quiz[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: '初級' | '中級' | '上級' | '第1章' | '第2章' | '第3章' | '第4章' | '第5章';
  questions: Question[];
};

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  chapter?: string; // 章の情報を追加
  difficulty?: 'easy' | 'medium' | 'hard'; // 難易度を追加
};

// 学習履歴の拡張型定義
export type LearningHistory = {
  answers: { [key: string]: string };
  correctAnswers: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  completed: boolean;
  timestamp: number;
  isReviewMode: boolean;
  selectedQuestionCount?: number;
  // 新機能追加
  skillLevel: {
    chapter1: number;
    chapter2: number;
    chapter3: number;
    chapter4: number;
    chapter5: number;
  };
  weakAreas: string[];
  learningPath: string[];
  adaptiveQuestions?: Question[]; // 適応的問題
};

// 単回の演習結果
export type QuizSession = {
  id: string;
  timestamp: number;
  answers: { [key: string]: string };
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  duration: number; // 演習時間（秒）
  selectedQuestionCount: number;
  isReviewMode: boolean;
};

// 総合学習履歴（複数回の演習結果を蓄積）
export type ComprehensiveLearningHistory = {
  sessions: QuizSession[];
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  averageSessionDuration: number;
  lastSessionDate: number;
  chapterProgress: {
    [chapter: string]: {
      totalAnswered: number;
      totalCorrect: number;
      accuracy: number;
      lastAttempted: number;
    };
  };
  weakAreas: string[];
  strongAreas: string[];
  learningTrend: 'improving' | 'stable' | 'declining';
  recommendedFocus: string[];
};

// 習得レベル分析結果
export type SkillAnalysis = {
  overallLevel: number;
  chapterLevels: {
    [chapter: string]: number;
  };
  weakAreas: string[];
  recommendedTopics: string[];
  nextLearningPath: string[];
};