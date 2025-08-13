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
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          {/* 背景グラデーション */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
          
          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              zIndex: 1,
              textAlign: 'center',
              color: 'white',
            }}
          >
            {/* ロゴ・アイコン */}
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
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '24px',
                  fontSize: '40px',
                }}
              >
                🤖
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
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['100問演習', 'AIチャット', '5章構成', '試験対策'].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontSize: '18px',
                    fontWeight: '500',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* 右下のURL */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500',
            }}
          >
            generative-ai-passport-study.vercel.app
          </div>

          {/* 左下の章アイコン */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              display: 'flex',
              gap: '8px',
            }}
          >
            {['🧠', '🤖', '🔒', '✍️', '🚀'].map((icon, index) => (
              <div
                key={index}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                {icon}
              </div>
            ))}
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