export interface Question {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  metadata: {
    chapter: number;
    category: string;
    source: string;
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    unitId?: string;
  };
}

export interface QuestionsData {
  version: string;
  totalQuestions: number;
  lastUpdated: string;
  description: string;
  questions: Question[];
}

