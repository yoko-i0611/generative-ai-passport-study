import { NextResponse } from 'next/server';
import { courses } from '../../data/courses';
import { Question } from '@/types';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countParam = searchParams.get('count');
  
  // デフォルト値を10に設定
  let count = 10;
  if (countParam) {
    const parsedCount = parseInt(countParam, 10);
    if (!isNaN(parsedCount)) {
      count = parsedCount;
    }
  }

  if (count <= 0) {
    return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
  }

  try {
    // Add courseId and chapterTitle to each question for context
    const questionsWithContext = courses.flatMap(course => 
      course.quiz.flatMap(q => 
        q.questions.map(question => ({
          ...question,
          courseId: course.id,
          chapterTitle: course.title,
        }))
      )
    );

    const shuffledQuestions = shuffleArray(questionsWithContext);
    const selectedQuestions = shuffledQuestions.slice(0, count);

    return NextResponse.json(selectedQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
} 