import nodemailer from 'nodemailer';

/**
 * メール送信サービスの設定を取得
 * GmailとSendGridの両方に対応
 */
function getEmailTransporter() {
  // SendGridの設定を優先（環境変数が設定されている場合）
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (sendGridApiKey && sendGridFromEmail) {
    // SendGridのSMTPを使用
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // TLSを使用
      auth: {
        user: 'apikey', // SendGridでは固定値
        pass: sendGridApiKey,
      },
    });
  }

  // Gmailの設定（後方互換性のため残す）
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    const cleanAppPassword = gmailAppPassword.replace(/\s+/g, '');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: cleanAppPassword,
      },
    });
  }

  return null;
}

/**
 * 送信元メールアドレスを取得
 */
function getFromEmail(): string {
  const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;
  if (sendGridFromEmail) {
    return sendGridFromEmail;
  }

  const gmailUser = process.env.GMAIL_USER;
  if (gmailUser) {
    return gmailUser;
  }

  throw new Error('メール送信の設定が完了していません');
}

/**
 * メール送信が有効かどうかをチェック
 */
export function isEmailConfigured(): boolean {
  const transporter = getEmailTransporter();
  return transporter !== null;
}

/**
 * メールを送信する
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<void> {
  const transporter = getEmailTransporter();

  if (!transporter) {
    console.log('メール送信設定が完了していないため、メール送信をスキップします');
    return;
  }

  const fromEmail = options.from || getFromEmail();
  const fromName = process.env.EMAIL_FROM_NAME || '生成AIパスポート試験対策';

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  console.log('Email sent to:', options.to);
}

