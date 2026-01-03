import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
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
    // public/app_questions_300.jsonから問題を読み込む
    const filePath = join(process.cwd(), 'public', 'app_questions_300.json');
    
    // ファイルの存在確認
    try {
      await readFile(filePath, 'utf8');
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json({ 
        error: '問題データファイルが見つかりません',
        details: fileError instanceof Error ? fileError.message : 'File not found'
      }, { status: 500 });
    }
    
    const fileContents = await readFile(filePath, 'utf8');
    
    // JSONパースエラーのハンドリング
    let data;
    try {
      data = JSON.parse(fileContents);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ 
        error: '問題データの解析に失敗しました',
        details: parseError instanceof Error ? parseError.message : 'Invalid JSON'
      }, { status: 500 });
    }
    
    const rawQuestions = data.questions || [];
    
    if (!Array.isArray(rawQuestions)) {
      console.error('Questions is not an array:', typeof rawQuestions);
      return NextResponse.json({ 
        error: '問題データの形式が正しくありません',
        details: 'questions is not an array'
      }, { status: 500 });
    }
    
    // JSONファイルのデータ構造をQuestion型に変換
    // metadata.chapter (number) -> chapter (string)
    // metadata.category -> chapterとして使用
    const allQuestions: Question[] = rawQuestions.map((q: any, index: number) => ({
      id: index + 1, // インデックスベースのID
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      chapter: q.metadata?.category || `第${q.metadata?.chapter || 0}章`,
      difficulty: q.metadata?.difficulty || 'medium',
      skillCategory: q.metadata?.tags?.[0] || undefined,
    }));
    
    const totalQuestions = allQuestions.length;
    
    if (totalQuestions === 0) {
      return NextResponse.json({ error: '問題データが空です' }, { status: 500 });
    }

    // 問題をシャッフルして指定数だけ取得
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(count, totalQuestions));

    return NextResponse.json({
      questions: selectedQuestions,
      totalQuestions: totalQuestions,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ 
      error: '問題の取得に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 