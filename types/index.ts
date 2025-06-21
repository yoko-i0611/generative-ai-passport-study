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
};