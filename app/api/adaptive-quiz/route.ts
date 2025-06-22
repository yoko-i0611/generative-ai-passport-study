import { NextRequest, NextResponse } from 'next/server';
import { calculateSkillLevel, generateAdaptiveQuestions } from '@/app/utils/skillAnalysis';
import { LearningHistory, Question } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { learningHistory, questionCount = 10 } = await req.json();

    if (!learningHistory) {
      return NextResponse.json(
        { error: '学習履歴が必要です' },
        { status: 400 }
      );
    }

    // 習得レベルを分析
    const skillAnalysis = calculateSkillLevel(learningHistory);

    // 適応的問題を生成
    const adaptiveQuestions = generateAdaptiveQuestions(skillAnalysis, questionCount);

    // レスポンスを返す
    return NextResponse.json({
      questions: adaptiveQuestions,
      skillAnalysis,
      message: '習得レベルに基づく問題を生成しました'
    });

  } catch (error) {
    console.error('Adaptive quiz generation error:', error);
    return NextResponse.json(
      { error: '問題生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 