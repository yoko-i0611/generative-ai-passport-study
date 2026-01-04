import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    // Gmailの認証情報を環境変数から取得
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser; // 受信者（デフォルトは送信者と同じ）

    if (!gmailUser || !gmailAppPassword) {
      console.error('Gmail認証情報が設定されていません', {
        hasUser: !!gmailUser,
        hasPassword: !!gmailAppPassword
      });
      return NextResponse.json(
        { error: 'メール送信の設定が完了していません' },
        { status: 500 }
      );
    }

    // アプリパスワードからスペースを除去
    const cleanAppPassword = gmailAppPassword.replace(/\s+/g, '');

    // Nodemailerのトランスポーターを設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: cleanAppPassword, // スペースを除去したパスワードを使用
      },
    });

    // メール内容を設定
    const mailOptions = {
      from: `"${name}" <${gmailUser}>`,
      replyTo: email, // 返信先を問い合わせ者のメールアドレスに設定
      to: recipientEmail,
      subject: `[お問い合わせ] ${subject}`,
      text: `
お問い合わせがありました。

【お名前】
${name}

【メールアドレス】
${email}

【件名】
${subject}

【お問い合わせ内容】
${message}

---
このメールは問い合わせフォームから送信されました。
返信する場合は、このメールに直接返信してください。
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            お問い合わせがありました
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>お名前:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>メールアドレス:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>件名:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">お問い合わせ内容</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
            <p>このメールは問い合わせフォームから送信されました。</p>
            <p>返信する場合は、このメールに直接返信してください。</p>
          </div>
        </div>
      `.trim(),
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'お問い合わせを送信しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('メール送信エラー:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('エラー詳細:', errorMessage);
    return NextResponse.json(
      { 
        error: 'メール送信に失敗しました。しばらく経ってから再度お試しください。',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

