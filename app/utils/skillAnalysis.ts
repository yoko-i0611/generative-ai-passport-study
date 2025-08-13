import { Question, LearningHistory, SkillAnalysis } from '@/types';
import { courses } from '../../data/courses';

// 問題を章別に分類
export const getQuestionsByChapter = (chapter: string): Question[] => {
  const questions: Question[] = [];
  courses.forEach(course => {
    if (course.id === chapter) {
      course.quiz.forEach(quiz => {
        questions.push(...quiz.questions.map(q => ({
          ...q,
          chapter: chapter
        })));
      });
    }
  });
  return questions;
};

// 習得レベルを計算
export const calculateSkillLevel = (history: LearningHistory): SkillAnalysis => {
  const chapterScores: { [key: string]: number } = {
    chapter1: 0,
    chapter2: 0,
    chapter3: 0,
    chapter4: 0,
    chapter5: 0
  };

  const chapterTotals: { [key: string]: number } = {
    chapter1: 0,
    chapter2: 0,
    chapter3: 0,
    chapter4: 0,
    chapter5: 0
  };

  // 回答履歴から章別の正答率を計算
  Object.keys(history.answers).forEach(questionId => {
    // 問題文から問題を特定
    const question = findQuestionByText(questionId);
    if (question && question.chapter) {
      const chapter = question.chapter;
      const isCorrect = history.answers[questionId] === question.correctAnswer;
      
      chapterTotals[chapter]++;
      if (isCorrect) {
        chapterScores[chapter]++;
      }
    }
  });

  // 章別の習得レベルを計算（0-100のスコア）
  const chapterLevels: { [key: string]: number } = {};
  Object.keys(chapterScores).forEach(chapter => {
    chapterLevels[chapter] = chapterTotals[chapter] > 0 
      ? Math.round((chapterScores[chapter] / chapterTotals[chapter]) * 100)
      : 0;
  });

  // 全体の習得レベルを計算
  const totalAnswered = Object.values(chapterTotals).reduce((sum, count) => sum + count, 0);
  const totalCorrect = Object.values(chapterScores).reduce((sum, count) => sum + count, 0);
  const overallLevel = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // 弱点分野を特定（習得レベル70%未満）
  const weakAreas = Object.keys(chapterLevels)
    .filter(chapter => chapterLevels[chapter] < 70)
    .map(chapter => {
      const course = courses.find(c => c.id === chapter);
      return course ? course.title : chapter;
    });

  // 推奨学習トピックを決定
  const recommendedTopics = weakAreas.length > 0 
    ? weakAreas.slice(0, 2) // 上位2つの弱点分野
    : ['総合演習', '応用問題'];

  // 次の学習パスを提案
  const nextLearningPath = generateLearningPath(chapterLevels, weakAreas);

  return {
    overallLevel,
    chapterLevels,
    weakAreas,
    recommendedTopics,
    nextLearningPath
  };
};

// 問題文から問題を特定
const findQuestionByText = (questionText: string): Question | null => {
  for (const course of courses) {
    for (const quiz of course.quiz) {
      const question = quiz.questions.find(q => q.question === questionText);
      if (question) {
        return {
          ...question,
          chapter: course.id
        };
      }
    }
  }
  return null;
};

// 学習パスを生成
const generateLearningPath = (chapterLevels: { [key: string]: number }, weakAreas: string[]): string[] => {
  const path: string[] = [];
  
  // 弱点分野を優先
  weakAreas.forEach(area => {
    const course = courses.find(c => c.title === area);
    if (course) {
      path.push(course.link);
    }
  });

  // 未学習の章を追加
  Object.keys(chapterLevels).forEach(chapter => {
    if (chapterLevels[chapter] === 0) {
      const course = courses.find(c => c.id === chapter);
      if (course && !path.includes(course.link)) {
        path.push(course.link);
      }
    }
  });

  return path.slice(0, 3); // 最大3つの推奨コース
};

// 適応的問題を生成
export const generateAdaptiveQuestions = (skillAnalysis: SkillAnalysis, count: number): Question[] => {
  const questions: Question[] = [];
  
  // 弱点分野から優先的に出題
  const weakChapters = Object.keys(skillAnalysis.chapterLevels)
    .filter(chapter => skillAnalysis.chapterLevels[chapter] < 70);

  if (weakChapters.length === 0) {
    // 弱点がない場合は総合演習
    const allQuestions: Question[] = [];
    courses.forEach(course => {
      course.quiz.forEach(quiz => {
        allQuestions.push(...quiz.questions.map(q => ({
          ...q,
          chapter: course.id
        })));
      });
    });
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, count);
  }

  // 弱点分野から問題を選択
  weakChapters.forEach(chapter => {
    const chapterQuestions = getQuestionsByChapter(chapter);
    const questionsPerChapter = Math.ceil(count / weakChapters.length);
    const shuffled = chapterQuestions.sort(() => Math.random() - 0.5);
    questions.push(...shuffled.slice(0, questionsPerChapter));
  });

  // 指定された問題数に調整
  return questions.slice(0, count);
};

// 学習進捗の可視化データを生成
export const generateProgressData = (skillAnalysis: SkillAnalysis) => {
  return {
    labels: ['第1章', '第2章', '第3章', '第4章', '第5章'],
    datasets: [{
      label: '習得レベル',
      data: [
        skillAnalysis.chapterLevels.chapter1,
        skillAnalysis.chapterLevels.chapter2,
        skillAnalysis.chapterLevels.chapter3,
        skillAnalysis.chapterLevels.chapter4,
        skillAnalysis.chapterLevels.chapter5
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',   // primary - 第1章
        'rgba(16, 185, 129, 0.8)',   // secondary - 第2章
        'rgba(245, 158, 11, 0.8)',   // info - 第3章
        'rgba(239, 68, 68, 0.8)',    // warning - 第4章
        'rgba(139, 92, 246, 0.8)'    // accent - 第5章
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)'
      ],
      borderWidth: 2
    }]
  };
}; 