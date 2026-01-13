export type Course = {
  id: string;
  title: string;
  description: string;
  difficulty: '初級' | '中級' | '上級' | '第1章' | '第2章' | '第3章' | '第4章' | '第5章' | '第6章' | '第7章' | '第8章' | '第9章' | '第10章';
  time: string;
  link: string;
  image: string;
  color: 'primary' | 'secondary' | 'accent' | 'info' | 'yellow' | 'warning';
  content: string; // 教材コンテンツ
  quiz: Quiz[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: '初級' | '中級' | '上級' | '第1章' | '第2章' | '第3章' | '第4章' | '第5章' | '第6章' | '第7章' | '第8章' | '第9章' | '第10章';
  questions: Question[];
};

export type Question = {
  id?: number;
  questionId?: string;
  question: string;
  options: string[];
  correctAnswer: string | string[]; // 単一選択または複数選択に対応
  explanation: string;
  course?: string;
  chapter?: string;
  section?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  skillCategory?: string; // 細かいスキルカテゴリ
  metadata?: {
    chapter: number;
    category: string;
    source: string;
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    unitId?: string;
  };
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
    chapter6: number;
    chapter7: number;
    chapter8: number;
    chapter9: number;
    chapter10: number;
  };
  weakAreas: string[];
  learningPath: string[];
  adaptiveQuestions?: Question[]; // 適応的問題
};

// 単回の演習結果
export type QuizSession = {
  id: string;
  timestamp: number;
  answers: { [key: string]: string | null };
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  duration: number; // 演習時間（秒）
  selectedQuestionCount: number;
  isReviewMode: boolean;
  questionTimes?: { [questionId: string]: number }; // 各問題の解答時間（秒）
};

// 総合学習履歴（複数回の演習結果を蓄積）
export type ComprehensiveLearningHistory = {
  sessions: QuizSession[];
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  averageSessionDuration: number;
  averageTimePerQuestion: number; // 1問あたりの平均時間（秒）
  lastSessionDate: number;
  chapterProgress: {
    [chapter: string]: {
      totalAnswered: number;
      totalCorrect: number;
      accuracy: number;
      lastAttempted: number;
    };
  };
  skillProgress: {
    [skillCategory: string]: {
      totalAnswered: number;
      totalCorrect: number;
      accuracy: number;
      chapter: string;
      lastAttempted: number;
    };
  };
  weakAreas: string[];
  strongAreas: string[];
  weakSkills: string[];
  strongSkills: string[];
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