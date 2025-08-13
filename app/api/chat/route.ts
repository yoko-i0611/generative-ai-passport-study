import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // 環境変数のチェック
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          error: 'AI チャット機能が利用できません。システム管理者にお問い合わせください。' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // リクエスト頻度制限のためのヘッダーチェック
    const userAgent = req.headers.get('user-agent');
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    
    // 本番環境での origin チェック
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins: string[] = [
        'https://ai-learning-platform.vercel.app',
        process.env.NEXT_PUBLIC_APP_URL
      ].filter((url): url is string => Boolean(url));
      
      if (origin && !allowedOrigins.includes(origin)) {
        console.warn('Unauthorized origin:', origin);
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Refererチェック（直接APIアクセスを防ぐ）
      if (!referer) {
        console.warn('Missing referer header');
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      const isValidReferer = allowedOrigins.some((allowed: string) => referer.startsWith(allowed));
      if (!isValidReferer) {
        console.warn('Invalid referer:', referer);
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // 不正なリクエストの検出
    if (!userAgent || userAgent.includes('bot') || userAgent.includes('crawler')) {
      console.warn('Suspicious request detected:', userAgent);
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // メッセージの長さ制限（悪用防止）
    if (message.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'メッセージが長すぎます。1000文字以内で入力してください。' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 空のメッセージやスパムっぽいメッセージのチェック
    if (message.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: '質問内容を具体的に入力してください。' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // `message`を`messages`配列形式に変換
    const messages = [{ role: 'user' as const, content: message }];

    // システムプロンプトを追加
    const systemMessage = {
      role: 'system' as const,
      content: `あなたは親切で知識豊富な生成AIパスポート試験対策の学習アシスタントです。

【基本姿勢】
- 学習者に寄り添い、親切で丁寧な対応を心がける
- 分からないことがあっても決して拒否せず、できる限り説明を試みる
- 難しい内容も分かりやすく、具体例を交えて説明する
- 学習意欲を促進し、前向きな学習体験を提供する

【対応範囲】
生成AIパスポート試験に関連する全ての内容：
- AI・機械学習・ディープラーニングの基礎
- 生成AI技術（GPT、BERT、Transformer等）
- プロンプトエンジニアリング技法
- AI活用事例・ビジネス応用
- AI倫理・責任あるAI・バイアス対策
- 情報リテラシー・セキュリティ・プライバシー
- 関連法規・著作権・GDPR
- AI業界動向・キャリア・学習方法

【回答アプローチ】
1. まず質問を理解し、関連する背景知識を整理
2. 初心者にも分かりやすい言葉で基本から説明
3. 具体例や実用的な応用例を積極的に提示
4. 試験対策に役立つポイントを明確に示す
5. さらなる学習のヒントや関連トピックを提案

【注意点】
- 「不適切」「答えられません」等の拒否的表現は避ける
- 分からない場合は「詳しくは分かりませんが、一般的には...」として説明を試みる
- 常に学習者の立場に立って、親身になって対応する

あなたの目標は学習者が生成AIパスポート試験に合格し、AIリテラシーを身につけることです。`
    };

    console.log('Processing chat request with messages:', messages.length);

    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: [systemMessage, ...messages],
      maxTokens: 1000,
      temperature: 0.8,
    });

    console.log('Response generated successfully');

    return new Response(
      JSON.stringify({ response: result.text }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 