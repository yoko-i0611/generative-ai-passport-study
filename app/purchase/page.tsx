'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { isPurchased } from '../utils/purchase';
import { 
  Brain, 
  CheckCircle, 
  Star,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CreditCard,
  Lock,
  HelpCircle,
  BookOpen,
  FileText,
  Mail
} from 'lucide-react';

export default function PurchasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [showFreeFeatureDetails, setShowFreeFeatureDetails] = useState(false);

  useEffect(() => {
    setPurchased(isPurchased());
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Stripe Checkoutセッションを作成
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: 500,
          productName: '生成AIパスポート試験対策プラットフォーム',
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Stripe Checkoutページにリダイレクト
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL not found');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('決済処理でエラーが発生しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: '300問の問題演習',
      description: '生成AIパスポート試験の全範囲をカバーする300問の問題データベース',
      color: 'primary'
    },
    {
      icon: FileText,
      title: '試験範囲を網羅する学習コンテンツ',
      description: '各章をユニット単位で学習。各ユニットの確認テストで理解度を確認',
      color: 'accent'
    },
    {
      icon: Zap,
      title: '復習モード',
      description: '間違えた問題を自動で抽出し、効率的に復習できます',
      color: 'info'
    },
    {
      icon: Star,
      title: '推奨学習領域',
      description: 'AIがあなたの学習状況を分析し、最適な学習領域を提案',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: '進捗管理',
      description: '学習履歴をブラウザ内に自動保存し、いつでも進捗を確認可能（端末・ブラウザごとに保存）',
      color: 'success'
    }
  ];

  const faqs = [
    {
      question: '購入後、いつから利用できますか？',
      answer: '決済完了後、即座にご利用いただけます。アカウント作成や追加の設定は不要です。'
    },
    {
      question: '返金は可能ですか？',
      answer: 'デジタルコンテンツの性質上、お客様都合による返品・返金には対応しておりません。ただし、決済エラーや二重課金が発生した場合、サービスに重大な不具合があり利用できない場合、推奨動作環境を満たしているにも関わらずサービスが正常に動作しない場合は、購入から14日以内に info@tayoima.com までご連絡ください。調査の上、対応いたします。'
    },
    {
      question: 'どのような支払い方法に対応していますか？',
      answer: 'クレジットカード決済（Stripe経由）に対応しています。対応カード: Visa、Mastercard、American Express、JCB'
    },
    {
      question: 'サービス利用期間はどのくらいですか？',
      answer: '本サービスは2026年12月31日までご利用いただけます。購入時期に関わらず、すべてのユーザーが同じ日に期限となります。試験制度の改定に対応するため、統一期限を設定しております。'
    },
    {
      question: '別の端末や別のブラウザで利用するにはどうすればいいですか？',
      answer: '別の端末や別のブラウザでご利用いただく場合、「購入済みの方はこちら」ページから、購入時にStripeに登録したメールアドレスを入力していただくことで、購入確認ができます。購入確認機能は2026年12月31日まで利用可能です。'
    },
    {
      question: '学習履歴は別の端末に引き継がれますか？',
      answer: 'いいえ、学習履歴は端末・ブラウザごとにローカルストレージに保存されるため、別の端末や別のブラウザでは引き継がれません。ブラウザの閲覧データを削除した場合も、学習履歴は失われます。'
    },
    {
      question: 'モバイルデバイスでも利用できますか？',
      answer: 'はい、スマートフォンやタブレットからも快適にご利用いただけます。推奨ブラウザ: Chrome、Edge、Safari、Firefoxの最新版。JavaScriptとLocalStorageが有効であることが必要です。'
    }
  ];

  const getIconColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 text-primary-600';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-600';
      case 'accent':
        return 'bg-accent-100 text-accent-600';
      case 'info':
        return 'bg-info-100 text-info-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'success':
        return 'bg-success-100 text-success-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">生成AIパスポート試験対策</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                ホーム
              </Link>
              {purchased && (
                <>
                  <Link href="/quiz" className="text-gray-700 hover:text-primary-600 transition-colors">
                    問題演習
                  </Link>
                  <Link href="/analytics" className="text-gray-700 hover:text-primary-600 transition-colors">
                    学習分析
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient">生成AIパスポート試験対策を今すぐ購入</span>
              </h1>
              <div className="mb-6">
                <div className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  2026年試験最新シラバス対応
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                300問の問題演習、試験範囲を網羅する学習コンテンツ、復習モードなど、
                試験合格に必要なすべての機能を一度にご利用いただけます。
              </p>
              
              {/* 価格表示 */}
              <div className="mb-12">
                <div className="inline-block bg-white rounded-2xl p-8 shadow-xl border-2 border-primary-200">
                  <div className="flex items-baseline justify-center space-x-2 mb-4">
                    <span className="text-6xl font-bold text-gradient">¥500</span>
                    <span className="text-2xl text-gray-500">（税込）</span>
                  </div>
                  <p className="text-gray-600 mb-2">一度の購入で全機能を利用可能</p>
                  <p className="text-sm text-gray-500 mb-6">※ サービス利用期間: 2026年12月31日まで</p>
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="btn-primary text-lg px-12 py-4 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        処理中...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        今すぐ購入する
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <Lock className="w-4 h-4 mr-2" />
                    Stripeによる安全な決済
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/purchase/restore"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      購入済みの方はこちら
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 保証・特徴のバッジ */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">全機能利用可能</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Shield className="w-5 h-5 text-primary-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">安全な決済</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Zap className="w-5 h-5 text-warning-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">即座に利用開始</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 無料体験セクション */}
      <section className="py-16 bg-gradient-to-br from-success-50 to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              まずは無料体験
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              第1章の学習コンテンツと確認テストを試してみよう！
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-700">
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                会員登録なし
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                メアド不要
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                今すぐスタート
              </span>
            </div>
            <Link 
              href="/courses/chapter1" 
              className="btn-outline text-lg px-8 py-4 inline-flex items-center"
            >
              無料体験に進む
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              すべての機能が利用可能
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              2026年試験最新シラバスに対応した、試験合格に必要なすべての機能を、このプラットフォームで利用できます
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <div className={`w-16 h-16 ${getIconColorClass(feature.color)} rounded-full flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 価格詳細セクション */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              シンプルな価格設定
            </h2>
            <p className="text-xl text-gray-600">
              複雑なプランはありません。一度の購入で、すべての機能をご利用いただけます。
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border-2 border-primary-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                料金プラン
              </h3>
              <div className="flex items-baseline justify-center space-x-2 mb-6">
                <span className="text-5xl font-bold text-gradient">¥500</span>
                <span className="text-xl text-gray-500">（税込）</span>
              </div>
              <p className="text-gray-600 mb-2">一度の購入で全機能を利用可能</p>
              <p className="text-sm text-gray-500 mb-8">※ サービス利用期間: 2026年12月31日まで（購入時期に関わらず）</p>
            </div>

            <div className="space-y-4 mb-6">
              {[
                '2026年試験最新シラバス対応',
                '試験範囲を網羅する学習コンテンツ',
                '300問の問題演習',
                '復習モード機能',
                'すべてのコースコンテンツへのアクセス'
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* 無料の付加機能 */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <div 
                className="cursor-pointer"
                onClick={() => setShowFreeFeatureDetails(!showFreeFeatureDetails)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-base font-bold text-primary-600">【無料の付加機能】</span>
                    <div className="mt-1">
                      <span className="text-gray-700 font-medium">・学習分析機能</span>
                    </div>
                  </div>
                  <ArrowRight 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showFreeFeatureDetails ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
              
              {showFreeFeatureDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pl-4 border-l-4 border-info-500"
                >
                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-2">無料提供機能の内容:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>学習進捗の可視化（章別・スキル別の進捗をグラフで確認）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>章別の統計情報の表示（各章の正答率や回答数を詳細に分析）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>学習傾向の分析（学習の改善・安定・低下傾向を自動分析）</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-info-50 p-3 rounded-lg">
                      <p className="text-xs leading-relaxed mb-2">
                        <strong>無料提供機能について:</strong>
                        <br />
                        この機能は、皆様の学習をより効果的にサポートするため、無料の付加機能として提供しています。
                        <br />
                        ・継続的な改善を行っているため、機能の追加や仕様の変更を行う場合があります
                        <br />
                        ・より良いサービス提供のため、ユーザーの皆様からのフィードバックをもとに機能を進化させていきます
                        <br />
                        ・学習履歴はブラウザ内に安全に保存され、サーバーには送信されません
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs leading-relaxed">
                        <strong>※ 保証について:</strong>
                        <br />
                        本機能は無料提供のため、サービス内容の保証対象外となります。
                        ただし、重大な不具合が発生した場合は、誠意をもって対応いたします。
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  処理中...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  今すぐ購入する
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* よくある質問セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">
                よくある質問
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              よく寄せられる質問とその回答をご紹介します
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              今すぐ試験対策を始めませんか？
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              500円で、生成AIパスポート試験合格に必要なすべての機能を手に入れられます。
            </p>
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="bg-white text-primary-600 font-semibold py-4 px-12 rounded-lg shadow-xl hover:bg-gray-50 transition-all duration-300 text-lg flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  処理中...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  今すぐ購入する
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white">
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
                    {purchased ? (
                      <Link href="/quiz" className="text-gray-300 hover:text-white transition-colors text-sm">
                        問題演習
                      </Link>
                    ) : (
                      <Link href="/purchase" className="text-gray-300 hover:text-white transition-colors text-sm">
                        問題演習
                      </Link>
                    )}
                  </li>
                  <li>
                    {purchased ? (
                      <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors text-sm">
                        学習分析
                      </Link>
                    ) : (
                      <Link href="/purchase" className="text-gray-300 hover:text-white transition-colors text-sm">
                        学習分析
                      </Link>
                    )}
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
                  <li>
                    <a href="mailto:info@tayoima.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                      お問い合わせ
                    </a>
                  </li>
                  <li>
                    <Link href="/purchase/restore" className="text-gray-300 hover:text-white transition-colors text-sm">
                      購入済みの方はこちら
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

