import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // URLパラメータから情報を取得（オプション）
    const title = searchParams.get('title') || 'AI学習プラットフォーム';
    const subtitle = searchParams.get('subtitle') || '生成AIパスポート試験対策';
    const description = searchParams.get('description') || 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* ロゴ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '24px',
                fontSize: '40px',
              }}
            >
              🧠
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {title}
            </div>
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </div>

          {/* 説明文 */}
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5',
              maxWidth: '800px',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            {description}
          </div>

          {/* 特徴バッジ */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: '500',
                color: 'white',
              }}
            >
              100問演習
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: '500',
                color: 'white',
              }}
            >
              AIチャット
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: '500',
                color: 'white',
              }}
            >
              5章構成
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: '500',
                color: 'white',
              }}
            >
              試験対策
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}