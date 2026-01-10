import { NextRequest, NextResponse } from 'next/server';
import * as kv from '../../lib/kv-storage';

/**
 * メールアドレスで購入状態を確認するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // メールアドレスの形式をチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    try {
      // Vercel KVから購入状態を取得
      const purchaseStatus = await kv.get(`purchase:${email}`);

      if (purchaseStatus && typeof purchaseStatus === 'object' && 'purchased' in purchaseStatus) {
        return NextResponse.json({
          purchased: true,
          purchasedAt: (purchaseStatus as any).purchasedAt,
          sessionId: (purchaseStatus as any).sessionId,
        });
      }

      return NextResponse.json({
        purchased: false,
      });
    } catch (kvError) {
      console.error('Error reading from KV:', kvError);
      return NextResponse.json(
        { error: 'Failed to verify purchase status' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify email' },
      { status: 500 }
    );
  }
}

