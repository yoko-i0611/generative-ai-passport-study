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
          error: 'OPENAI_API_KEYが設定されていません。.env.localファイルにOPENAI_API_KEYを設定してください。' 
        }),
        { 
          status: 500,
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

    // `message`を`messages`配列形式に変換
    const messages = [{ role: 'user' as const, content: message }];

    // システムプロンプトを追加
    const systemMessage = {
      role: 'system' as const,
      content: `あなたは生成AIパスポート試験対策の学習アシスタントです。
以下の内容に関する質問にのみ回答してください：
- 生成AIの基礎知識
- プロンプトエンジニアリング
- 生成AIの活用方法
- 生成AIの倫理とリスク
- 生成AIの最新トレンド

学習内容に関係ない質問には「申し訳ございませんが、生成AIパスポート試験の学習内容に関する質問にお答えしています。学習内容について何かご質問がございましたら、お気軽にお聞かせください。」と回答してください。

回答は簡潔で分かりやすく、学習に役立つ内容にしてください。`
    };

    console.log('Processing chat request with messages:', messages.length);

    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: [systemMessage, ...messages],
      maxTokens: 500,
      temperature: 0.7,
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