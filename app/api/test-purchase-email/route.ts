import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/app/lib/email-service';

/**
 * 購入完了メールのテスト送信用API
 * 本番環境では無効化することを推奨
 */
export async function POST(request: NextRequest) {
  // 本番環境では無効化（セキュリティ対策）
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_TEST_EMAIL) {
    return NextResponse.json(
      { error: 'Test email API is disabled in production' },
      { status: 403 }
    );
  }

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

    // メール送信設定がない場合はエラー
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'メール送信設定が完了していません（SendGridまたはGmailの認証情報が必要です）' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://generative-ai-passport-study.vercel.app';

    await sendEmail({
      to: email,
      subject: '【購入完了】生成AIパスポート試験対策プラットフォーム（テスト）',
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
            <div style="background: #fef3c7; padding: 10px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 12px; color: #92400e; font-weight: bold;">⚠️ これはテストメールです</p>
            </div>
            
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

    return NextResponse.json(
      { message: 'テストメールを送信しました', email },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error.message || 'メール送信に失敗しました' },
      { status: 500 }
    );
  }
}

