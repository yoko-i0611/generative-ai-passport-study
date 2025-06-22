'use client';

export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">CSS テストページ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tailwind CSS のテスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tailwind CSS テスト</h2>
            <div className="space-y-4">
              <div className="bg-blue-500 text-white p-4 rounded">青色の背景</div>
              <div className="bg-green-500 text-white p-4 rounded">緑色の背景</div>
              <div className="bg-red-500 text-white p-4 rounded">赤色の背景</div>
              <div className="bg-yellow-500 text-white p-4 rounded">黄色の背景</div>
            </div>
          </div>

          {/* カスタムCSS クラスのテスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">カスタムCSS テスト</h2>
            <div className="space-y-4">
              <button className="btn-primary">プライマリボタン</button>
              <button className="btn-secondary">セカンダリボタン</button>
              <button className="btn-outline">アウトラインボタン</button>
              <div className="card">カードコンポーネント</div>
            </div>
          </div>

          {/* グラデーションのテスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">グラデーションテスト</h2>
            <div className="space-y-4">
              <div className="bg-gradient-primary text-white p-4 rounded">プライマリグラデーション</div>
              <div className="bg-gradient-secondary text-white p-4 rounded">セカンダリグラデーション</div>
              <div className="bg-gradient-accent text-white p-4 rounded">アクセントグラデーション</div>
            </div>
          </div>

          {/* テキストグラデーションのテスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">テキストグラデーションテスト</h2>
            <div className="space-y-4">
              <h3 className="text-gradient text-3xl font-bold">グラデーションテキスト</h3>
              <p className="text-gray-600">通常のテキスト</p>
              <div className="badge badge-primary">プライマリバッジ</div>
              <div className="badge badge-secondary">セカンダリバッジ</div>
            </div>
          </div>
        </div>

        {/* レスポンシブデザインのテスト */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">レスポンシブデザインテスト</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded text-center">1</div>
            <div className="bg-green-100 p-4 rounded text-center">2</div>
            <div className="bg-red-100 p-4 rounded text-center">3</div>
            <div className="bg-yellow-100 p-4 rounded text-center">4</div>
          </div>
        </div>
      </div>
    </div>
  );
} 