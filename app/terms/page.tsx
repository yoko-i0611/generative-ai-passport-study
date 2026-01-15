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
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>本アプリの内容を無断で複製、転載、配布する行為</li>
                <li>本アプリを商用目的で利用する行為</li>
                <li>本アプリの運営を妨害する行為</li>
                <li>不正な方法でアプリにアクセスする行為</li>
                <li>購入確認機能を不正に利用する行為</li>
                <li>その他、当方が不適切と判断する行為</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>違反時の措置:</strong>
              </p>
              <p className="text-gray-700 leading-relaxed mt-2 mb-3">
                利用者が上記の禁止事項に違反した場合、当方は以下の措置を講じることができるものとします。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>本アプリの利用を停止または終了すること</li>
                <li>購入確認機能の利用を停止すること</li>
                <li>違反行為による損害について、返金等の対応を行わないこと</li>
                <li>その他、当方が必要と判断する措置</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条の2（知的財産権）</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本アプリに含まれるすべてのコンテンツ（問題、解説、画像、ロゴ、UIデザイン、プログラムコード等）の著作権その他の知的財産権は、当方または正当な権利者に帰属します。
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                利用者は、本アプリの利用に必要な範囲を超えて、以下の行為を行ってはなりません。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>本アプリのコンテンツを複製、転載、配布、改変すること</li>
                <li>本アプリのコンテンツを他のサービスや教材に流用すること</li>
                <li>本アプリのロゴやデザインを無断で使用すること</li>
                <li>本アプリのプログラムコードを逆コンパイル、逆アセンブル、リバースエンジニアリングすること</li>
                <li>その他、当方の知的財産権を侵害する行為</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                利用者は、本アプリの利用により、当方の知的財産権を取得するものではありません。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（無料提供機能について）</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">無料提供機能の内容</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本アプリは、学習をより効果的にサポートするため、詳細な学習分析機能を無料の付加機能として提供しています。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>学習進捗の可視化</li>
                  <li>章別の統計情報の表示</li>
                  <li>学習傾向の分析</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">機能の変更について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  継続的な改善を行っているため、機能の追加や仕様の変更を行う場合があります。
                  より良いサービス提供のため、ユーザーの皆様からのフィードバックをもとに機能を進化させていきます。
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">保証について</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  本機能は無料提供のため、サービス内容の保証対象外となります。
                  ただし、重大な不具合が発生した場合は、誠意をもって対応いたします。
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">お問い合わせ</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  本機能に関する不具合や改善要望がございましたら、<a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>までお気軽にお問い合わせください。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（サービス内容の性質と免責事項）</h2>
              
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
                <p className="text-gray-700 leading-relaxed mb-4">
                  当方は、本アプリの利用により生じた損害について、当方の故意または重過失による場合を除き、以下の損害について責任を負いません。ただし、消費者契約法その他の法令により、免責が認められない場合は、この限りではありません。
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-4">
                  <li>本アプリの利用により生じた間接的・派生的損害</li>
                  <li>学習履歴の消失による損害（利用者のブラウザ設定等による場合）</li>
                  <li>試験の不合格による損害</li>
                  <li>サービス提供の中断、停止、終了による損害</li>
                  <li>データの消失、改ざん、漏洩による損害（第三者の不正アクセス等、当方に過失がない場合）</li>
                </ol>
                <p className="text-gray-700 leading-relaxed mt-4">
                  なお、当方が損害賠償責任を負う場合であっても、当方の軽過失による損害に限り、その賠償額の上限は本サービスの利用料金（500円）とします。ただし、当方の故意または重過失による損害については、この限りではありません。
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                  ※ 個人情報の取り扱いに関する免責事項については、<Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">プライバシーポリシー</Link>をご確認ください。
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（サービス内容の変更・終了）</h2>
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
                  サービス終了後は、本アプリを利用できなくなります。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（未成年者の利用）</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>
                  本アプリの有料機能を購入する場合、未成年者（18歳未満の方）は親権者の同意を得る必要があります。
                </li>
                <li>
                  未成年者が親権者の同意なく購入した場合、親権者は民法第5条に基づき当該契約を取り消すことができます。
                </li>
                <li>
                  親権者による契約取消しを希望される場合は、以下の書類を添えて、<a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>までご連絡ください:
                  <div className="mt-2 ml-4">
                    <p className="text-gray-700 leading-relaxed mb-2">【必要書類】</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>親権者の本人確認書類（運転免許証、マイナンバーカード、健康保険証等のコピー）</li>
                      <li>未成年者との続柄を証明する書類（戸籍謄本、住民票等のコピー）</li>
                      <li>購入時のメールアドレス</li>
                      <li>購入日時（分かる範囲で可）</li>
                    </ul>
                  </div>
                </li>
                <li>
                  当方は、提出された書類の真正性を確認した上で、原則として14営業日以内に返金処理を行います。
                </li>
                <li>
                  以下の場合、返金をお断りすることがあります:
                  <div className="mt-2 ml-4">
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      <li>本サービス終了日（2026年12月31日）を経過している場合</li>
                      <li>書類の不備や真正性に疑義がある場合</li>
                      <li>正当な理由なく追加書類の提出に応じない場合</li>
                    </ol>
                  </div>
                </li>
                <li>
                  未成年者が本アプリを利用される場合は、保護者の方の監督のもとご利用ください。
                </li>
              </ol>
              <p className="text-gray-700 leading-relaxed text-sm mt-4">
                ※ 本条の期間制限は、円滑な返金処理のための合理的な手続き期間を定めたものです。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第9条（お問い合わせ）</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第10条（規約の変更）</h2>
              <p className="text-gray-700 leading-relaxed">
                当方は、必要に応じて本規約を変更することができます。
                重要な変更がある場合は、本アプリ上に表示し、事前に通知いたします。
                変更後の規約は、本アプリ上に表示した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第11条（準拠法・管轄裁判所）</h2>
              <p className="text-gray-700 leading-relaxed">
                本規約は、日本法に準拠して解釈されるものとします。
                本アプリの利用に関して生じた紛争については、東京地方裁判所（または東京簡易裁判所）を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
