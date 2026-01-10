import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as kv from '../../lib/kv-storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Stripe Webhookシークレット（環境変数から取得）
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      // Stripe Webhookの署名を検証
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // チェックアウトセッション完了時の処理
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // メールアドレスを取得
      const email = session.customer_details?.email || session.customer_email;

      if (!email) {
        console.error('No email found in session:', session.id);
        return NextResponse.json(
          { error: 'No email found in session' },
          { status: 400 }
        );
      }

      // セッションIDを取得
      const sessionId = session.id;

      // 購入状態を保存（Vercel KVにメールアドレスをキーとして保存）
      try {
        // 統一期限: 環境変数で設定可能（デフォルト: 2026年12月31日 23:59:59 JST）
        // 将来的に期限を延長する場合は、環境変数 PURCHASE_EXPIRATION_DATE を設定することで対応可能
        const expirationDateString = process.env.PURCHASE_EXPIRATION_DATE || '2026-12-31T23:59:59+09:00';
        const expirationDate = new Date(expirationDateString);
        const now = new Date();
        const secondsUntilExpiration = Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / 1000));
        
        // TTLを含めて保存（統一期限まで有効）
        await kv.set(`purchase:${email}`, {
          purchased: true,
          purchasedAt: Date.now(),
          sessionId: sessionId,
          expiresAt: expirationDate.getTime(), // 期限日時も保存（確認用）
        }, { ex: secondsUntilExpiration });

        console.log('Purchase status saved for email:', email, `(expires: ${expirationDate.toLocaleDateString('ja-JP')})`);
      } catch (kvError) {
        console.error('Error saving to KV:', kvError);
        return NextResponse.json(
          { error: 'Failed to save purchase status' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

