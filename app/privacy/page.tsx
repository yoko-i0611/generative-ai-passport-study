'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <p className="text-gray-600 text-sm mb-4">
                最終更新日: 2026年1月4日
              </p>
              <p className="text-gray-700 leading-relaxed">
                生成AIパスポート試験対策アプリ（以下「本アプリ」）は、利用者の個人情報の取り扱いについて、
                以下のとおりプライバシーポリシーを定めます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（個人情報の収集）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、以下の情報を収集する場合があります。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>学習履歴データ（問題演習の結果、正答率、解答時間など）</li>
                <li>学習進捗データ（コースの閲覧状況、完了状況など）</li>
                <li>ブラウザ情報（ユーザーエージェント、IPアドレスなど）</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                これらの情報は、ブラウザのローカルストレージに保存され、当方のサーバーには送信されません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（個人情報の利用目的）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、収集した情報を以下の目的で利用します。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>学習進捗の表示</li>
                <li>学習分析機能の提供</li>
                <li>アプリの機能向上</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（個人情報の管理）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリで収集される情報は、利用者のブラウザのローカルストレージに保存されます。
                当方のサーバーには送信されず、第三者と共有されることはありません。
                利用者は、ブラウザの設定によりデータを削除することができます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（Cookieについて）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、Cookieを使用する場合があります。
                Cookieは、利用者のブラウザに保存される小さなテキストファイルです。
                本アプリでは、機能の提供に必要な最小限のCookieのみを使用します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（第三者提供）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、法令に基づく場合を除き、利用者の個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（データの削除）</h2>
              <p className="text-gray-700 leading-relaxed">
                利用者は、ブラウザの設定により、本アプリが保存したデータを削除することができます。
                データを削除すると、学習履歴や進捗情報が失われます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（プライバシーポリシーの変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、利用者の承諾を得ることなく、本プライバシーポリシーを変更することができるものとします。
                変更後のプライバシーポリシーは、本アプリ上に表示した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（お問い合わせ）</h2>
              <p className="text-gray-700 leading-relaxed">
                本プライバシーポリシーに関するお問い合わせは、本アプリの販売ページよりご連絡ください。
                なお、本アプリは低価格で提供されているため、個別のサポートは行いません。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
