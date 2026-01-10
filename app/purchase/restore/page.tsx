'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Brain, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { restorePurchaseByEmail } from '../../utils/purchase';
import { useRouter } from 'next/navigation';

export default function RestorePurchasePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: 'メールアドレスを入力してください。',
      });
      return;
    }

    // メールアドレスの形式をチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: 'error',
        text: '正しいメールアドレスを入力してください。',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await restorePurchaseByEmail(email);

      if (result.success) {
        setMessage({
          type: 'success',
          text: '購入状態を復元しました！',
        });
        
        // 3秒後にホームページにリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.message || '購入状態の復元に失敗しました。',
        });
      }
    } catch (error) {
      console.error('Restore purchase error:', error);
      setMessage({
        type: 'error',
        text: '購入状態の復元に失敗しました。もう一度お試しください。',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">生成AIパスポート試験対策</span>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  購入状態を復元
                </h1>
                <p className="text-lg text-gray-600">
                  購入時に使用したメールアドレスを入力してください。
                  <br />
                  購入履歴が確認できた場合、購入状態を復元します。
                </p>
              </div>

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* メッセージ表示 */}
                {message && (
                  <div
                    className={`p-4 rounded-lg flex items-start space-x-3 ${
                      message.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : message.type === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : message.type === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    )}
                    <p
                      className={`text-sm ${
                        message.type === 'success'
                          ? 'text-green-800'
                          : message.type === 'error'
                          ? 'text-red-800'
                          : 'text-blue-800'
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                {/* ボタン */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg px-8 py-4 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      確認中...
                    </>
                  ) : (
                    <>
                      購入状態を復元
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* 注意事項 */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                  ご注意
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>購入時にStripeに登録したメールアドレスを入力してください。</li>
                  <li>購入履歴が見つからない場合、正しいメールアドレスかご確認ください。</li>
                  <li>購入状態が復元されると、このブラウザで有料コンテンツにアクセスできるようになります。</li>
                  <li>購入状態の復元機能は、2026年12月31日まで利用可能です（いつ購入しても、2026年12月31日までご利用いただけます）。</li>
                  <li>学習履歴は端末ごとに保存されるため、端末を変えても学習履歴は共有されません。</li>
                </ul>
              </div>

              {/* ホームに戻るリンク */}
              <div className="mt-8 text-center">
                <Link 
                  href="/" 
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  ホームに戻る
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">生成AIパスポート試験対策</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                生成AIパスポート試験の学習をサポートするアプリです。
                問題演習や学習分析機能を通じて、効率的な学習をサポートします。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">クイックリンク</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                      ホーム
                    </Link>
                  </li>
                  <li>
                    <Link href="/purchase" className="text-gray-300 hover:text-white transition-colors text-sm">
                      購入ページ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">その他</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                      利用規約
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                      プライバシーポリシー
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} 生成AIパスポート試験対策. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

