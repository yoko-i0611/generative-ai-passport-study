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
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f8faff 0%, #e8f4ff 50%, #f0f8ff 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* 左側コンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              paddingRight: '40px',
            }}
          >
            {/* ヘッダー部分 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
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
                }}
              >
                🧠
              </div>
              <div
                style={{
                  fontSize: '24px',
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
                fontSize: '56px',
                fontWeight: 'bold',
                lineHeight: '1.1',
                marginBottom: '24px',
                color: '#1F2937',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                生成AIパスポート
              </span>
              <br />
              試験対策プラットフォーム
            </div>

            {/* 説明文 */}
            <div
              style={{
                fontSize: '20px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '500px',
              }}
            >
              生成AIパスポート試験に合格するための包括的な学習プラットフォームです。5つの章で構成されたカリキュラムで、基礎から実践まで段階的に学習できます。
            </div>

            {/* アクションボタン（デザインのみ） */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ▶ 学習を始める
              </div>
              <div
                style={{
                  border: '2px solid #3B82F6',
                  color: '#3B82F6',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
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
                gap: '24px',
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
                width: '400px',
                height: '280px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* ブラウザ風モックアップ */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  height: '100%',
                  padding: '24px',
                  position: 'relative',
                }}
              >
                {/* ブラウザのドット */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                </div>

                {/* コンテンツバー */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ width: '80%', height: '16px', backgroundColor: '#F3F4F6', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '60%', height: '16px', backgroundColor: '#F3F4F6', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '90%', height: '16px', backgroundColor: '#F3F4F6', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '70%', height: '16px', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                </div>

                {/* タグ */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '20px',
                  }}
                >
                  <div style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    生成AI基礎
                  </div>
                  <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    プロンプト
                  </div>
                  <div style={{ background: '#FEF3C7', color: '#92400E', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    実践
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右下のURL */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '30px',
              fontSize: '14px',
              color: '#9CA3AF',
              fontWeight: '500',
            }}
          >
            generative-ai-passport-study.vercel.app
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