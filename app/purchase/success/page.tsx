'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  Brain, 
  ArrowRight,
  BookOpen,
  BarChart3,
  Zap
} from 'lucide-react';
import { setPurchaseStatus } from '../../utils/purchase';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // 購入状態を保存
    if (sessionId) {
      setPurchaseStatus(sessionId);
    } else {
      setPurchaseStatus();
    }
  }, [sessionId]);

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

      {/* 成功メッセージセクション */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-success-200">
              <div className="mb-8">
                <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16 text-success-600" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  購入ありがとうございます！
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  決済が正常に完了しました。
                  <br />
                  これで、すべての機能をご利用いただけます。
                </p>
              </div>

              {sessionId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-600">
                    セッションID: <span className="font-mono text-gray-900">{sessionId}</span>
                  </p>
                </div>
              )}

              {/* 次のステップ */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  さっそく始めましょう
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link
                    href="/quiz"
                    className="card text-center hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      問題演習
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      300問の問題データベースから、試験対策を開始
                    </p>
                    <span className="text-primary-600 font-medium group-hover:underline flex items-center justify-center">
                      始める
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>

                  <Link
                    href="/analytics"
                    className="card text-center hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-secondary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      学習分析
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      あなたの学習進捗を可視化
                    </p>
                    <span className="text-secondary-600 font-medium group-hover:underline flex items-center justify-center">
                      確認する
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>

                  <Link
                    href="/"
                    className="card text-center hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-accent-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      コースを見る
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      5つの章で構成された学習コース
                    </p>
                    <span className="text-accent-600 font-medium group-hover:underline flex items-center justify-center">
                      閲覧する
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* 別の端末で利用する場合の案内 */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  別の端末で利用する場合
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  別のブラウザや端末で利用する場合は、購入時に使用したメールアドレスで購入状態を復元できます。
                </p>
                <Link 
                  href="/purchase/restore" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center underline"
                >
                  購入状態を復元する
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* ホームに戻るボタン */}
              <Link href="/" className="btn-primary text-lg px-8 py-4 inline-flex items-center mt-6">
                ホームに戻る
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
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
                    <Link href="/quiz" className="text-gray-300 hover:text-white transition-colors text-sm">
                      問題演習
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors text-sm">
                      学習分析
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
                  <li>
                    <Link href="/commerce" className="text-gray-300 hover:text-white transition-colors text-sm">
                      特定商取引法に基づく表記
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

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
