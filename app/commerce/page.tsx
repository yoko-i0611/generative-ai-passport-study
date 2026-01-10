'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft } from 'lucide-react';

export default function CommercePage() {
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ホームに戻る
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <p className="text-gray-600 text-sm mb-6">
                最終更新日: 2026年1月10日
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">事業者名</h2>
              <p className="text-gray-700 leading-relaxed">
                tayoima
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">運営責任者</h2>
              <p className="text-gray-700 leading-relaxed">
                今村陽子
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">所在地</h2>
              <p className="text-gray-700 leading-relaxed">
                〒124-0001 東京都葛飾区小菅 3-18-4
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ先</h2>
              <p className="text-gray-700 leading-relaxed">
                メールアドレス: <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>
                <br />
                運営元: <a href="https://www.tayoima.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">https://www.tayoima.com/</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">販売価格</h2>
              <p className="text-gray-700 leading-relaxed">
                500円（税込）
              </p>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                ※ サービス利用期間: 2026年12月31日まで（購入時期に関わらず）
                <br />
                ※ 試験制度の改定に対応するため、統一期限を設定しています
                <br />
                ※ 価格は予告なく変更する場合があります
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">商品・サービスの名称</h2>
              <p className="text-gray-700 leading-relaxed">
                生成AIパスポート試験対策プラットフォーム
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>内容:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                <li>300問の問題演習</li>
                <li>ユニットごとのインプット学習</li>
                <li>詳細な学習分析機能</li>
                <li>その他、学習支援に関する機能</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">代金の支払方法</h2>
              <p className="text-gray-700 leading-relaxed">
                クレジットカード決済（Stripe経由）
                <br />
                対応: Visa、Mastercard、American Express、JCB
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">代金の支払時期</h2>
              <p className="text-gray-700 leading-relaxed">
                クレジットカード決済の場合、各クレジットカード会社の規定に従います。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">サービス提供時期</h2>
              <p className="text-gray-700 leading-relaxed">
                決済完了後、即座にご利用いただけます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">返品・返金について</h2>
              <p className="text-gray-700 leading-relaxed">
                デジタルコンテンツの性質上、お客様都合による返品・返金には対応しておりません。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                ただし、以下の場合は個別に対応いたします。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>決済エラーや二重課金が発生した場合</li>
                <li>サービスに重大な不具合があり、利用できない場合</li>
                <li>推奨動作環境を満たしているにも関わらず、サービスが正常に動作しない場合</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                返金をご希望の場合は、購入から14日以内に <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a> までご連絡ください。
                調査の上、対応いたします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">動作環境</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                本サービスは、以下の環境で動作することを確認しております。
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">推奨ブラウザ</p>
                  <p className="text-gray-700 text-sm">
                    Chrome、Edge、Safari、Firefoxの最新版
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">必要な機能</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                    <li>JavaScriptが有効になっていること</li>
                    <li>LocalStorageが利用可能であること</li>
                    <li>Cookieが有効になっていること（一部の機能で使用する場合があります）</li>
                    <li>インターネット接続が必要です</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                ※ 上記以外の環境でも動作する場合がありますが、動作保証はいたしかねます
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

