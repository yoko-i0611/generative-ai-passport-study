import { NextRequest, NextResponse } from 'next/server';
import * as kv from '@/app/lib/kv-storage';

/**
 * メールアドレスで購入状態を復元するAPI
 * 購入済みの場合、クライアント側に購入状態を設定するための情報を返す
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
        const purchase = purchaseStatus as {
          purchased: boolean;
          purchasedAt?: number;
          sessionId?: string;
        };

        // 購入済みの場合、クライアント側に設定するための情報を返す
        return NextResponse.json({
          success: true,
          purchased: true,
          purchasedAt: purchase.purchasedAt,
          sessionId: purchase.sessionId,
        });
      }

      // 購入されていない場合
      return NextResponse.json({
        success: false,
        purchased: false,
        message: 'このメールアドレスでの購入履歴が見つかりませんでした。',
      });
    } catch (kvError) {
      console.error('Error reading from KV:', kvError);
      return NextResponse.json(
        { error: 'Failed to restore purchase status' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Restore purchase error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to restore purchase' },
      { status: 500 }
    );
  }
}

