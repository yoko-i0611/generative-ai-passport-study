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
                最終更新日: 2026年1月10日
              </p>
              <p className="text-gray-700 leading-relaxed">
                本規約は、生成AIパスポート試験対策アプリ（以下「本アプリ」といいます）のご利用にあたっての条件を定めるものです。
                本アプリをご利用いただく前に、必ず本規約をお読みください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約は、本アプリの利用に関する当方と利用者との間の権利義務関係を定めることを目的とし、
                利用者と当方との間の本アプリの利用に関わる一切の関係に適用されるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（利用目的）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、生成AIパスポート試験の学習をサポートすることを目的としており、
                コース学習、問題演習、学習分析などの機能を提供しています。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（利用料金とご利用方法）</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">利用料金とサービス期間</h3>
                <p className="text-gray-700 leading-relaxed">
                  本アプリの利用料金は、購入時に表示される金額とします。
                </p>
                <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                  ※ サービス利用期間: 2026年12月31日まで（購入時期に関わらず）
                  <br />
                  ※ 試験制度の改定に対応するため、統一期限を設定しています
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">返品・返金について</h3>
                <p className="text-gray-700 leading-relaxed">
                  デジタルコンテンツの性質上、お客様都合による返品・返金には対応しておりません。
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  ただし、以下の場合は個別に対応いたします。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                  <li>決済エラーや二重課金が発生した場合</li>
                  <li>サービスに重大な不具合があり、利用できない場合</li>
                  <li>推奨動作環境を満たしているにも関わらず、サービスが正常に動作しない場合</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  返金をご希望の場合は、購入から14日以内に <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a> までご連絡ください。
                  調査の上、適宜対応いたします。
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">購入後のご利用方法</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  購入後は、以下の2つの方法でご利用いただけます。
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                      1. 購入した端末・ブラウザで使う場合（推奨・簡単）
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm ml-4">
                      購入完了後、そのまま同じ端末・ブラウザでご利用ください。
                      自動的に購入済みと認識されます。
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                      2. 別の端末や別のブラウザで使う場合
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm ml-4 mb-2">
                      （例: PCで購入してスマホで使う、Chromeで購入してSafariで使う）
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm ml-4">
                      <Link href="/purchase/restore" className="text-primary-600 hover:text-primary-700 underline">「購入済みの方はこちら」</Link>ページから、購入時に登録したメールアドレスを入力することで、
                      購入済みであることを確認できます。
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4 text-sm mb-2">
                  <strong>注意事項:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2 text-sm">
                  <li>学習履歴は端末・ブラウザごとに保存されるため、別の端末や別のブラウザでは引き継がれません</li>
                  <li>購入確認用のメールアドレス情報を削除した場合、別の端末や別のブラウザでの購入確認ができなくなります</li>
                  <li>購入した端末・ブラウザでは、ブラウザのデータ（ローカルストレージ）が削除されていなければ、利用期限（2026年12月31日）までは引き続きご利用いただけます</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（禁止事項）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                利用者は、本アプリの利用にあたり、以下の行為を行ってはなりません。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>本アプリの内容を無断で複製、転載、配布する行為</li>
                <li>本アプリを商用目的で利用する行為</li>
                <li>本アプリの運営を妨害する行為</li>
                <li>不正な方法でアプリにアクセスする行為</li>
                <li>購入確認機能を不正に利用する行為</li>
                <li>その他、当方が不適切と判断する行為</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（サービス内容の性質と免責事項）</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">コンテンツの性質について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリは、生成AIパスポート試験の学習支援を目的として、
                  最新の試験内容に基づいた問題演習や学習コンテンツを提供しています。
                </p>
                <p className="text-gray-700 leading-relaxed mb-3 mt-4">
                  <strong>重要な注意事項:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                  <li>本アプリは、生成AIパスポート試験の公式・認定機関とは一切関係がありません</li>
                  <li>本アプリは、試験範囲を完全に網羅することを保証するものではありません</li>
                  <li>本アプリで提供するコンテンツや問題が、公式の試験内容と完全に一致することを保証するものではありません</li>
                  <li>試験制度や出題傾向は予告なく変更される場合があります</li>
                  <li>本アプリは学習支援ツールであり、試験合格を保証するものではありません</li>
                  <li>学習効果には個人差があります</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm">
                  ※ 試験に関する最新情報や公式情報については、必ず公式サイトや認定機関にてご確認ください。
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">免責事項</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  当方は、以下について責任を負いかねます。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>本アプリの利用により生じた間接的な損害</li>
                  <li>学習履歴の消失による損害（ブラウザの設定等により失われた場合）</li>
                  <li>試験の不合格による損害</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  ただし、サービスに重大な不具合がある場合や、
                  当方の故意または重大な過失による損害については、
                  この限りではありません。
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">学習履歴の保存について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリの学習履歴は、利用者のブラウザのローカルストレージに保存されます。
                  以下の場合、学習履歴が失われる可能性があります。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>ブラウザの設定で閲覧履歴データを削除した場合</li>
                  <li>ブラウザの再インストール</li>
                  <li>OSの再インストール</li>
                  <li>プライベートモード/シークレットモードの使用</li>
                  <li>ブラウザのストレージ容量が上限に達した場合</li>
                  <li>その他、ブラウザや端末の設定によりデータが削除される場合</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">購入確認機能について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリは、購入確認機能を提供するため、購入情報を当方のサーバーに保存します。
                  購入情報の有効期限は2026年12月31日です。
                  有効期限を過ぎた場合、購入情報は自動的に削除され、別の端末や別のブラウザでの購入確認ができなくなります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（サービス内容の変更・終了）</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方は、利用者への事前の告知をもって、本アプリの内容を変更、追加、削除することができるものとします。
                </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">サービス終了時の対応</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリは2026年12月31日をもってサービスを終了する予定です。
                  サービス終了前に、本アプリ上に通知いたします。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  サービス終了後は、本アプリへのアクセスができなくなります。
                  学習履歴のエクスポート機能を提供する予定ですが、保証するものではありません。
                </p>
              </div>
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
                当方は、必要に応じて本規約を変更することができます。
                重要な変更がある場合は、本アプリ上に表示し、事前に通知いたします。
                変更後の規約は、本アプリ上に表示した時点で効力を生じるものとします。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
