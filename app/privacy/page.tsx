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
                最終更新日: 2026年1月10日
              </p>
              <p className="text-gray-700 leading-relaxed">
                生成AIパスポート試験対策アプリ（以下「本アプリ」といいます）は、利用者の個人情報の取り扱いについて、
                以下のとおりプライバシーポリシーを定めます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（個人情報の収集）</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                本アプリは、以下の情報を収集する場合があります。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>学習履歴データ（問題演習の結果、正答率、解答時間など）</li>
                <li>学習進捗データ（コースの閲覧状況、完了状況など）</li>
                <li>ブラウザ情報（ユーザーエージェント、IPアドレスなど）</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                上記の学習履歴データ、学習進捗データ、ブラウザ情報は、ブラウザのローカルストレージに保存され、当方のサーバーには送信されません。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                ただし、決済処理に必要な情報（メールアドレス、決済情報など）は、決済サービスStripe経由で処理されます。
                Stripeのプライバシーポリシーについては、<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">https://stripe.com/privacy</a>をご確認ください。
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">購入確認機能について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  購入完了後、別の端末や別のブラウザでもご利用いただけるよう、
                  以下の最小限の情報を当方のサーバーに保存します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>メールアドレス（購入時にStripeに登録したメールアドレス）</li>
                  <li>購入日時</li>
                  <li>有効期限（2026年12月31日）</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  これらの情報は、購入確認機能を提供する目的でのみ使用されます。
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>購入完了メールについて:</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mt-2 text-sm">
                  購入完了時にお客様のメールアドレスに、購入完了のお知らせメールを送信します。
                  このメールには、サービス利用期間、ホームページへのリンク、利用方法などの情報を記載します。
                  このメール送信は、購入確認機能の提供に含まれます。
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>有効期限:</strong> 2026年12月31日までです（購入時期に関わらず、すべてのユーザーが同じ日に期限となります）。
                  有効期限を過ぎた場合、データは自動的に削除され、別の端末や別のブラウザでの購入確認ができなくなります。
                </p>
                <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                  ※ 統一期限の理由: 生成AIパスポート試験の制度変更に対応するため、また、コンテンツの品質を維持するため、
                  すべてのユーザーが同じ日に期限となるように設定しています。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（個人情報の利用目的）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本アプリは、収集した情報を以下の目的で利用します。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>学習進捗の表示</li>
                <li>学習分析機能の提供</li>
                <li>アプリの機能向上</li>
                <li>購入確認機能の提供（購入完了メールの送信を含む）</li>
                <li>購入履歴の確認</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（個人情報の管理）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本アプリで収集される学習データは、利用者のブラウザのローカルストレージに保存されます。
                当方のサーバーには送信されず、第三者と共有されることはありません。
              </p>
              <p className="text-gray-700 leading-relaxed">
                ただし、決済処理に必要な情報は、決済サービスStripeを通じて安全に処理されます。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                利用者は、ブラウザの設定によりデータを削除することができます。
              </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">学習データの保存</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリの学習履歴（問題の正答率、解答時間、進捗状況など）は、
                  お使いの端末のブラウザにのみ保存されます。
                  当方のサーバーには送信されません。
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold mb-2 mt-4">
                  重要な注意事項:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>学習履歴は端末・ブラウザごとに独立して保存されます</li>
                  <li>別の端末や別のブラウザでは、学習履歴は引き継がれません</li>
                  <li>ブラウザの閲覧データを削除すると、学習履歴も削除されます</li>
                  <li>一度削除された学習履歴は復元できません</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>データの保存期間:</strong> 
                  学習履歴は、ユーザーが手動で削除するまで、または上記の理由により削除されるまで保存されます。
                  当方では、学習履歴の保存期間を保証するものではありません。
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">購入確認の仕組み</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリは、購入済みかどうかの確認を以下の方法で行います。
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4 mb-4">
                  <li className="mb-3">
                    <strong>購入した端末・ブラウザで使う場合（推奨）</strong>
                    <br />
                    <span className="text-sm ml-4">自動的に購入済みと認識されます（サーバーへの問い合わせ不要）</span>
                  </li>
                  <li className="mb-3">
                    <strong>別の端末や別のブラウザで使う場合</strong>
                    <br />
                    <span className="text-sm ml-4">（例: PCで購入してスマホで使う、Chromeで購入してSafariで使う）</span>
                    <br />
                    <span className="text-sm ml-4">
                      <Link href="/purchase/restore" className="text-primary-600 hover:text-primary-700 underline">「購入済みの方はこちら」</Link>ページから、購入時に登録したメールアドレスを入力することで、
                      購入済みであることを確認できます。
                    </span>
                  </li>
                </ol>
                <p className="text-gray-700 leading-relaxed mb-2 mt-4">
                  <strong>サーバーに保存される情報:</strong>
                </p>
                <p className="text-gray-700 leading-relaxed text-sm mb-2">
                  別の端末や別のブラウザでもご利用いただけるよう、以下の最小限の情報のみを当方のサーバーに保存しています。
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                  <li>購入時に登録したメールアドレス</li>
                  <li>購入日時</li>
                  <li>有効期限（2026年12月31日）</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm mt-3">
                  ※ 学習履歴や詳細な個人情報は保存されません
                  <br />
                  ※ 有効期限（2026年12月31日）を過ぎると、購入確認機能は利用できなくなります
                  <br />
                  ※ データは当方のサーバーに暗号化されて保存されます
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（Cookieについて）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、機能の提供に必要な最小限のCookieを使用します。
                Cookieは利用者のブラウザ設定で無効化できますが、一部機能が正常に動作しない場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（第三者提供）</h2>
              <p className="text-gray-700 leading-relaxed">
                本アプリは、法令に基づく場合を除き、利用者の個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（データの削除と利用者の権利）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                利用者は、以下の権利を有します。
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                    1. ローカルデータの削除
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm ml-4">
                    ブラウザの設定により、学習履歴や進捗情報を削除できます。
                    データを削除すると、学習履歴や進捗情報が失われます。
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-700 leading-relaxed font-semibold mb-2">
                    2. 購入確認用データの削除依頼
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm ml-4 mb-2">
                    購入確認用のメールアドレス情報の削除を希望される場合は、
                    <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a> までご連絡ください。
                    できる限り速やかに対応いたします。
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm ml-4 mt-3 mb-1">
                    <strong>注意事項:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-8 text-sm">
                    <li>削除後は、別の端末や別のブラウザでの購入確認ができなくなります</li>
                    <li>購入した端末・ブラウザでは、ブラウザのデータ（ローカルストレージ）が削除されていなければ、利用期限（2026年12月31日）までは引き続きご利用いただけます</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（プライバシーポリシーの変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、必要に応じて本プライバシーポリシーを変更することができるものとします。
                重要な変更がある場合は、本アプリ上に表示し、事前に通知いたします。
                変更後のプライバシーポリシーは、本アプリ上に表示した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（お問い合わせ）</h2>
              <p className="text-gray-700 leading-relaxed">
                本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                メールアドレス: <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>
              </p>
              <p className="text-gray-600 text-sm mt-4">
                ※ 返信までに3営業日程度かかる場合があります。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
