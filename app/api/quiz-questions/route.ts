import { NextResponse } from 'next/server';
import { courses } from '../../../data/courses';
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
  
  const count = countParam ? parseInt(countParam, 10) : 10;

  if (count <= 0) {
    return NextResponse.json({ error: 'Count must be a positive integer' }, { status: 400 });
  }

  try {
    const allQuestions = courses.flatMap(course =>
      (course.quiz || []).flatMap(q =>
        (q.questions || []).map(question => ({
          ...question,
          course: course.title,
          chapter: course.title,
          section: q.title,
        }))
      )
    );

    const totalQuestions = allQuestions.length;
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, count);

    return NextResponse.json({
      questions: selectedQuestions,
      totalQuestions: totalQuestions,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
} 