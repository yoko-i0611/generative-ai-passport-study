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
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f8faff 0%, #e8f4ff 50%, #f0f8ff 100%)',
            padding: '60px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* 左側コンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '55%',
              paddingRight: '40px',
            }}
          >
            {/* ヘッダー */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '24px',
                }}
              >
                🧠
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                }}
              >
                生成AIパスポート試験対策
              </div>
            </div>

            {/* メインタイトル */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                lineHeight: '1.1',
                marginBottom: '20px',
                color: '#1F2937',
              }}
            >
              生成AIパスポート
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                lineHeight: '1.1',
                marginBottom: '24px',
                color: '#1F2937',
              }}
            >
              試験対策プラットフォーム
            </div>

            {/* 説明文 */}
            <div
              style={{
                fontSize: '18px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '500px',
              }}
            >
              生成AIパスポート試験に合格するための包括的な学習プラットフォームです。5つの章で構成されたカリキュラムで、基礎から実践まで段階的に学習できます。
            </div>

            {/* アクションボタン */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                ▶ 学習を始める
              </div>
              <div
                style={{
                  border: '2px solid #3B82F6',
                  color: '#3B82F6',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'white',
                }}
              >
                問題演習に挑戦
              </div>
            </div>

            {/* 特徴アイコン */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                ✅ 無料で利用可能
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                🕒 いつでも学習可能
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                ⭐ 試験対策に最適
              </div>
            </div>
          </div>

          {/* 右側モックアップ */}
          <div
            style={{
              width: '45%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '360px',
                height: '240px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  height: '100%',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* ブラウザドット */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                </div>

                {/* コンテンツライン */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '80%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}></div>
                  <div style={{ width: '60%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}></div>
                  <div style={{ width: '90%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}></div>
                  <div style={{ width: '70%', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}></div>
                </div>

                {/* タグ */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <div style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' }}>
                    生成AI基礎
                  </div>
                  <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' }}>
                    プロンプト
                  </div>
                  <div style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' }}>
                    実践
                  </div>
                </div>
              </div>
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