'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <p className="text-gray-600 text-sm mb-4">
                最終更新日: 2026年1月4日
              </p>
              <p className="text-gray-700 leading-relaxed">
                本規約は、生成AIパスポート試験対策アプリ（以下「本アプリ」）のご利用にあたっての条件を定めるものです。
                本アプリをご利用いただく前に、必ず本規約をお読みください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約は、本アプリの利用に関する当方と利用者との間の権利義務関係を定めることを目的とし、
                利用者と当方との間の本アプリの利用に関わる一切の関係に適用されます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（利用目的）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、生成AIパスポート試験の学習をサポートすることを目的としています。
                コース学習、問題演習、学習分析などの機能を提供しています。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（利用料金）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリの利用は有料です。利用料金は、購入時に表示される金額とします。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                デジタルコンテンツの性質上、原則として返品・返金には応じかねます。
                ただし、サービスに重大な不具合がある場合や、当方に起因する問題が発生した場合は、個別に対応いたします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（禁止事項）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                利用者は、本アプリの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>本アプリの内容を無断で複製、転載、配布する行為</li>
                <li>本アプリを商用目的で利用する行為</li>
                <li>本アプリの運営を妨害する行為</li>
                <li>不正な方法でアプリにアクセスする行為</li>
                <li>その他、当方が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（保証の否認および免責）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、本アプリの内容が正確、完全、有用であることを保証するものではありません。
                また、本アプリの利用により生じた損害について、当方は一切の責任を負いません。
                試験の合格を保証するものではありません。
              </p>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">データの保存について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリの学習履歴は、利用者のブラウザのローカルストレージに保存されます。
                  以下の場合、学習履歴が失われる可能性があります：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>ブラウザの設定で閲覧履歴データを削除した場合</li>
                  <li>ブラウザの再インストール</li>
                  <li>OSの再インストール</li>
                  <li>プライベートモード/シークレットモードの使用</li>
                  <li>ブラウザのストレージ容量が上限に達した場合</li>
                  <li>その他、ブラウザや端末の設定によりデータが削除される場合</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  学習履歴が失われた場合、当方は一切の責任を負いません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（サービス内容の変更等）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、利用者への事前の告知をもって、本アプリの内容を変更、追加、削除することができるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（お問い合わせ）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリに関するお問い合わせは、以下までご連絡ください。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                メールアドレス: <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                不具合の報告やご質問には、可能な範囲で対応いたします。
              </p>
              <p className="text-gray-600 text-sm mt-4">
                返信までに3営業日程度かかる場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（規約の変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、利用者の承諾を得ることなく、本規約を変更することができるものとします。
                変更後の規約は、本アプリ上に表示した時点で効力を生じるものとします。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
