import { NextRequest, NextResponse } from 'next/server';
import { referenceContentData } from '../../../data/reference-content';

// サーバーサイドのみで実行されるAPIエンドポイント
// referenceContentはクライアント側には送信されません

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json(
        { error: 'sectionId is required' },
        { status: 400 }
      );
    }

    const content = referenceContentData[sectionId];

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // このエンドポイントは直接呼び出さず、/api/chat経由でのみ使用されます
    // セキュリティのため、直接アクセスを制限することも可能です
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching reference content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


