export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  answerTime: number; // 秒
  timestamp: string;
  retryCount: number;
  questionMetadata: {
    chapter: number;
    category: string;
    tags: string[];
    difficulty: string;
  };
}

export interface AnswerSession {
  userId: string;
  sessionId: string;
  answers: UserAnswer[];
  startTime: string;
  lastUpdated: string;
}

