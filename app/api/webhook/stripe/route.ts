import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as kv from '@/app/lib/kv-storage';
import { sendEmail, isEmailConfigured } from '@/app/lib/email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Stripe Webhookシークレット（環境変数から取得）
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * 購入完了メールを送信する関数
 */
async function sendPurchaseConfirmationEmail(email: string) {
  try {
    // メール送信設定がない場合はスキップ
    if (!isEmailConfigured()) {
      console.log('メール送信設定が完了していないため、購入完了メールをスキップします');
      return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://generative-ai-passport-study.vercel.app';

    await sendEmail({
      to: email,
      subject: '【購入完了】生成AIパスポート試験対策プラットフォーム',
      html: `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #d946ef 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">購入完了のお知らせ</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">
              この度は、生成AIパスポート試験対策プラットフォームをご購入いただき、誠にありがとうございます。
            </p>
            
            <div style="margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">サービス利用期間</h2>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                本サービスは<strong style="color: #1f2937;">2026年12月31日まで</strong>ご利用いただけます。<br>
                購入時期に関わらず、すべてのユーザーが同じ日に期限となります。
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #d946ef 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                ホームページにアクセス
              </a>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #1f2937;">ご利用方法</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
                <li>購入した端末・ブラウザでは自動的に購入済みと認識されます</li>
                <li>別の端末や別のブラウザで利用する場合は、<a href="${appUrl}/purchase/restore" style="color: #3b82f6; text-decoration: none;">「購入済みの方はこちら」</a>ページからメールアドレスで購入確認ができます</li>
                <li>学習履歴は端末ごとに保存されるため、端末を変えても学習履歴は共有されません</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; font-size: 12px; color: #6b7280;">
              <p style="margin: 0 0 10px 0;">ご不明な点がございましたら、お気軽にお問い合わせください。</p>
              <p style="margin: 0;">
                メールアドレス: <a href="mailto:info@tayoima.com" style="color: #3b82f6; text-decoration: none;">info@tayoima.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Purchase confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    // メール送信エラーはWebhookの処理を続行する（重要ではないため）
  }
}

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
        
        // 購入完了メールを送信（非同期で実行、エラーが発生してもWebhookは続行）
        sendPurchaseConfirmationEmail(email).catch((emailError) => {
          console.error('Failed to send purchase confirmation email:', emailError);
        });
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

