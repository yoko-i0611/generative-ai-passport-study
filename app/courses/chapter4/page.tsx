'use client';

import { useState } from 'react';
import { ChevronLeft, BookOpen, Brain, CheckCircle, Circle, Clock } from 'lucide-react';
import Link from 'next/link';
import { courses } from '../../../data/courses';
import HybridContentCard from '../../components/HybridContentCard';
import ChatButton from '../../components/ChatButton';
import UnitQuizModal from '../../components/UnitQuizModal';

const courseId = 'chapter4';

// 新しい構造のテストデータ（YAMLファイルから将来的に読み込む）
const newChapter4Sections = [
  {
    id: 'unit01-internet-literacy',
    title: 'インターネットリテラシーの基礎',
    unitPoint: '生成AI時代において不可欠となるインターネットリテラシーの基本概念と、情報を安全かつ適切に扱うための判断力を身につけることを目的とします。',
    learningTips: `「便利さ」と「危険性」は常にセットで考える癖をつけましょう

AIの話題でも、最終的に問われるのは人間側のリテラシーであると意識すると理解が深まります`,
    cardDisplay: {
      slideImage: '/images/ch4_unit01_internet_literacy.png',
      keyPoints: [
        'フィッシング：偽サイトへの誘導',
        'ソーシャルエンジニアリング：人間の心理的な隙を突く',
        '対策：多要素認証、URL確認、不審なファイルを開かない',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'インターネットリテラシーとは何か',
        explanation: 'インターネットリテラシーとは、インターネットを安全かつ適切に活用するために必要な知識・判断力・行動力の総称です。情報リテラシー、セキュリティ、プライバシー、デジタル市民権などが含まれます。',
      },
      {
        category: 'フィッシング詐欺と関連手口',
        explanation: 'フィッシング詐欺は、偽のメールやWebサイトで個人情報を盗み取る手口です。スミッシング（SMS詐欺）、ヴィッシング（音声詐欺）、スピアフィッシングなど、手口は多様化しています。',
      },
      {
        category: 'マルウェアとランサムウェア',
        explanation: 'マルウェアは悪意あるソフトウェアの総称です。ランサムウェアはデータを暗号化して身代金を要求する攻撃で、企業・個人ともに深刻な被害をもたらします。',
      },
      {
        category: 'ソーシャルエンジニアリング攻撃',
        explanation: '技術ではなく人の心理を突く攻撃です。なりすまし、偽装、脅迫、ベイト攻撃などによって情報を引き出します。',
      },
      {
        category: 'セキュリティリスクの全体像',
        explanation: 'インターネットには、フィッシング詐欺、マルウェア、ランサムウェア、スミッシング、ヴィッシング、悪意あるQRコードなど様々な脅威が存在します。Wi-Fiの盗聴、アップロードサービスの詐欺、危険なWebアクセスなど、日常利用にも多くのリスクが潜んでいます。',
      },
      {
        category: 'プライバシー侵害の危険性',
        explanation: '個人情報が一度流出すると、取り消すことはできません。生成AIに入力した情報も学習やログとして保存される可能性があるため、機密情報の扱いには細心の注意が必要です。',
      },
      {
        category: '生成AI特有のリスク',
        explanation: 'AIが生成した情報の誤用や流出、個人情報の無意識な入力、学習データの偏りによる差別的結果など、新たなリスクが生まれています。AIは便利な反面、管理を誤ると被害が拡大しやすい特性を持っています。',
      },
      {
        category: '生成AI時代のリスク拡大',
        explanation: '生成AIによって詐欺文面や偽情報の作成が容易になり、攻撃の規模と精度が急速に拡大しています。だからこそ、最終防衛線は人間のリテラシーになります。',
      },
    ],
    quizQuestions: [
      {
        question: '攻撃者が緊急性や権威を装い、人間の心理的な隙や行動のミスにつけ込んで機密情報を盗み出す攻撃手法を何と呼ぶか。',
        options: [
          'SQLインジェクション',
          'ソーシャルエンジニアリング',
          'DDoS攻撃',
          'ゼロデイ攻撃',
        ],
        correctAnswer: 'ソーシャルエンジニアリング',
        explanation: '正解は「ソーシャルエンジニアリング」です。技術的な脆弱性ではなく、人間の心理（焦りや恐怖など）を利用して情報を盗む手法です。AIによるなりすましもこの一種として警戒が必要です。選択肢1の「SQLインジェクション」はデータベースへの不正なSQL文の挿入、選択肢3の「DDoS攻撃」は大量のトラフィックを送りつける攻撃、選択肢4の「ゼロデイ攻撃」は未知の脆弱性を突く攻撃です。',
      },
      {
        question: '生成AI技術の悪用により、実在する人物の声色や話し方をAIで模倣し、電話で金銭を騙し取る詐欺手法として、テキストで紹介されている事例はどれか。',
        options: [
          'ワンクリック詐欺',
          'ディープフェイクボイス詐欺（オレオレ詐欺の高度化）',
          'ランサムウェア攻撃',
          'クロスサイトスクリプティング',
        ],
        correctAnswer: 'ディープフェイクボイス詐欺（オレオレ詐欺の高度化）',
        explanation: '正解は「ディープフェイクボイス詐欺（オレオレ詐欺の高度化）」です。AIによる音声合成（音声クローン）技術が悪用され、親族や取引先になりすます詐欺が発生しています。生成AI技術の悪用により、実在する人物の声色や話し方をAIで模倣し、電話で金銭を騙し取る手法です。選択肢1の「ワンクリック詐欺」はクリックだけで料金が発生する詐欺、選択肢3の「ランサムウェア攻撃」はデータを暗号化して身代金を要求する攻撃、選択肢4の「クロスサイトスクリプティング」はWebサイトへのスクリプト注入攻撃です。',
      },
      {
        question: 'フィッシング詐欺への対策として、組織内で実施すべき「技術的対策」と「人的対策」の組み合わせとして最も適切なものはどれか。',
        options: [
          'パスワードを紙に書いて貼る・全員で共有する',
          '多要素認証（MFA）の導入・不審なメールを見抜くための疑似訓練',
          'ウイルス対策ソフトをアンインストールする・全てのリンクをクリックする',
          '社外との通信を全て遮断する・パソコンを使わない',
        ],
        correctAnswer: '多要素認証（MFA）の導入・不審なメールを見抜くための疑似訓練',
        explanation: '正解は「多要素認証（MFA）の導入・不審なメールを見抜くための疑似訓練」です。システム側での多要素認証（MFA）と、人間側でのリテラシー向上（訓練）の両輪が不可欠です。技術的対策と人的対策を組み合わせることで、フィッシング詐欺への防御が強化されます。選択肢1、3、4は不適切な対策です。',
      },
      {
        question: '公衆Wi-Fi（フリーWi-Fi）を利用する際のリスクと対策として、適切な記述はどれか。',
        options: [
          'パスワードがかかっていれば絶対に安全である。',
          '攻撃者が設置した偽のアクセスポイント（なりすましWi-Fi）に接続すると、通信内容を盗聴される恐れがあるため、VPNの利用や機密情報の入力を避ける対策が必要である。',
          'スマートフォンの「Wi-Fi自動接続」は常にオンにしておくべきである。',
          'Wi-Fi経由ではウイルスには感染しない。',
        ],
        correctAnswer: '攻撃者が設置した偽のアクセスポイント（なりすましWi-Fi）に接続すると、通信内容を盗聴される恐れがあるため、VPNの利用や機密情報の入力を避ける対策が必要である。',
        explanation: '正解は選択肢2です。正規のWi-Fiに見せかけた罠（Evil Twin）が存在するため、自動接続をオフにし、VPNを利用する等の対策が推奨されます。公衆Wi-Fiを利用する際は、偽のアクセスポイントに接続されないよう注意し、VPNの利用や機密情報の入力を避けることが重要です。選択肢1、3、4は誤りです。',
      },
    ],
    textContent: `インターネットリテラシーとは、インターネットを安全かつ適切に使うために必要な知識や判断力、行動力のことです。情報を見極める力、セキュリティの知識、プライバシーの保護、デジタル社会での適切な行動などが含まれます。

フィッシング詐欺は、偽のメールやWebサイトを使って個人情報を盗み取る手口です。AIを使うことで、文面が自然になり、見抜きにくくなっています。スミッシング（SMS詐欺）、ヴィッシング（音声詐欺）、スピアフィッシングなど、手口は様々です。

マルウェアは悪意のあるソフトウェアの総称です。ランサムウェアは、データを暗号化して身代金を要求する攻撃で、企業や個人に深刻な被害をもたらします。

ソーシャルエンジニアリング攻撃は、技術ではなく人の心理を突く攻撃です。なりすまし、偽装、脅迫、ベイト攻撃などによって情報を引き出します。

生成AIの時代では、詐欺の文面や偽の情報を作ることが簡単になり、攻撃の規模と精度が急速に拡大しています。だからこそ、最終的な防衛線は人間のリテラシーになります。

対策としては、多要素認証を使う、URLを確認する、不審なファイルを開かない、パスワードを使い回さない、二要素認証を導入するなどが重要です。組織では、多要素認証（MFA）の導入と、不審なメールを見抜くための疑似訓練などの人的対策を組み合わせることが不可欠です。不審なリンクを開かない、怪しい添付ファイルを実行しない、アクセス管理やログ監視なども重要です。

公衆Wi-Fi（フリーWi-Fi）を利用する際は、攻撃者が設置した偽のアクセスポイント（なりすましWi-Fi）に接続すると、通信内容を盗聴される恐れがあります。そのため、VPNの利用や機密情報の入力を避ける対策が必要です。スマートフォンの「Wi-Fi自動接続」は常にオンにしておくべきではありません。

生成AI技術の悪用により、実在する人物の声色や話し方をAIで模倣し、電話で金銭を騙し取るディープフェイクボイス詐欺（オレオレ詐欺の高度化）も発生しています。

プライバシー侵害の危険性として、個人情報が一度流出すると、取り消すことはできません。生成AIに入力した情報も、学習データやログとして保存される可能性があるため、機密情報の扱いには細心の注意が必要です。生成AI特有のリスクとして、AIが生成した情報の誤用や流出、個人情報の無意識な入力、学習データの偏りによる差別的な結果など、新たなリスクが生まれています。インターネットには、悪意あるQRコード、アップロードサービスの詐欺、危険なWebサイトへのアクセスなど、日常的な利用にも多くのリスクが潜んでいます。`,
  },
  {
    id: 'unit02-personal-info-ai',
    title: '個人情報保護と生成AI',
    unitPoint: '個人情報保護法の基本的な考え方と、生成AIを活用する際に特に注意すべき個人情報の取り扱いについて理解し、法的リスクと社会的責任を意識したAI利用を身につけます。',
    learningTips: `「何が個人情報か」「何が特に厳重に扱うべき情報か」を明確に区別して整理しましょう

AI利用では入力した情報の行き先まで意識することが重要です`,
    cardDisplay: {
      slideImage: '/images/ch4_unit02_personal_info.png',
      keyPoints: [
        '個人情報：生存する個人を特定できる情報',
        '要配慮個人情報：差別や不利益につながる可能性が高い情報',
        '生成AI活用時の注意：個人情報や機密情報を直接入力しない',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '個人情報とは何か',
        explanation: '個人情報とは、生存する個人を識別できる情報です。氏名、住所、電話番号、メールアドレス、顔写真などが該当し、他の情報と組み合わせて個人を特定できるものも含まれます。',
      },
      {
        category: '要配慮個人情報と機微情報',
        explanation: '要配慮個人情報とは、人種、信条、病歴、犯罪歴など、差別や不利益につながる可能性が高い情報です。機微情報も同様に、慎重な取り扱いが求められます。',
      },
      {
        category: '匿名加工情報とマスキング',
        explanation: '匿名加工情報は、特定の個人を識別できないように加工し、かつ、元の個人情報を復元できないようにした情報です。単なるマスキング（一部の情報を伏せ字などで隠す処理）とは異なり、特定の個人を識別できず、かつ「復元も不可能」な状態に加工した情報を指します。これらはAI学習データとして活用されることも多く、適切な処理が必須です。',
      },
      {
        category: '改正個人情報保護法の対象範囲',
        explanation: '改正個人情報保護法において、個人情報を取り扱う事業者の対象範囲は、取り扱う個人情報の数に関わらず、全ての個人情報取扱事業者が法の適用対象となりました。かつての「5,000人要件」は撤廃され、小規模事業者や個人事業主を含むすべての事業者が法の適用対象となっています。',
      },
      {
        category: '金融分野の機微情報',
        explanation: '金融分野のガイドラインにおける「機微（センシティブ）情報」は、要配慮個人情報に加え、労働組合への加盟や性生活なども含み、原則として取得・利用・第三者提供が禁止されています。金融分野では「機微情報」として、要配慮個人情報よりも広い範囲を含み、原則取得禁止という厳しい制限があります。',
      },
      {
        category: '生成AI活用時の注意点',
        explanation: '生成AIに個人情報や機密情報を直接入力することは、情報漏えいリスクを高めます。業務利用では入力制限、データ管理ルール、利用ガイドラインの整備が不可欠です。',
      },
    ],
    quizQuestions: [
      {
        question: '個人情報保護法において、本人の人種、信条、社会的身分、病歴、犯罪歴など、不当な差別や偏見が生じる可能性があるため、取得にあたって原則として本人の同意が必要な情報を何と呼ぶか。',
        options: [
          '機微情報（センシティブ情報）',
          '特定個人情報',
          '要配慮個人情報',
          '基本個人情報',
        ],
        correctAnswer: '要配慮個人情報',
        explanation: '正解は「要配慮個人情報」です。法令上の用語は「要配慮個人情報」です。「機微情報」は金融ガイドライン等で使われるより広い概念ですが、法の定義としては要配慮個人情報が正解です。人種、信条、社会的身分、病歴、犯罪歴など、差別や不利益につながる可能性が高い情報です。',
      },
      {
        question: 'AIサービスを利用する際、入力したデータがAIモデルの学習に再利用されないようにするために行うべき設定や手続きを何と呼ぶか。',
        options: [
          'オプトイン',
          'オプトアウト',
          'サインアップ',
          'バックアップ',
        ],
        correctAnswer: 'オプトアウト',
        explanation: '正解は「オプトアウト」です。「学習利用を拒否する（利用させない）」意思表示や設定をオプトアウトと呼びます。企業利用では必須の確認事項です。選択肢1の「オプトイン」は同意を得て利用する方式、選択肢3の「サインアップ」はサービスへの登録、選択肢4の「バックアップ」はデータの複製保存です。',
      },
      {
        question: '「匿名加工情報」の定義として、正しい記述はどれか。',
        options: [
          '特定の個人を識別できないように加工し、かつ、元の個人情報を復元できないようにした情報。',
          '名前だけを黒塗りにした情報（他の記述から特定できてもよい）。',
          '暗号化して保存した個人情報。',
          '特定の個人を識別できるが、外部には漏らさない情報。',
        ],
        correctAnswer: '特定の個人を識別できないように加工し、かつ、元の個人情報を復元できないようにした情報。',
        explanation: '正解は選択肢1です。単なるマスキングではなく、特定の個人を識別できず、かつ「復元も不可能」な状態に加工した情報を指します。匿名加工情報は、特定の個人を識別できないように加工し、かつ、元の個人情報を復元できないようにした情報です。選択肢2は単なるマスキング、選択肢3は暗号化（復号可能）、選択肢4は識別可能な情報なので誤りです。',
      },
      {
        question: '改正個人情報保護法において、個人情報を取り扱う事業者の対象範囲はどう変化したか。',
        options: [
          '大企業のみが対象となった。',
          '5,000人以上の個人情報を保有する事業者のみが対象となった。',
          '取り扱う個人情報の数に関わらず、全ての個人情報取扱事業者が法の適用対象となった。',
          'AIを利用する企業のみが対象となった。',
        ],
        correctAnswer: '取り扱う個人情報の数に関わらず、全ての個人情報取扱事業者が法の適用対象となった。',
        explanation: '正解は選択肢3です。かつての「5,000人要件」は撤廃され、小規模事業者や個人事業主を含むすべての事業者が法の適用対象となっています。改正個人情報保護法において、個人情報を取り扱う事業者の対象範囲は、取り扱う個人情報の数に関わらず、全ての個人情報取扱事業者が法の適用対象となりました。選択肢1、2、4は誤りです。',
      },
      {
        question: '金融分野のガイドラインにおける「機微（センシティブ）情報」の取り扱いとして、適切なものはどれか。',
        options: [
          '自由に売買できる。',
          '要配慮個人情報に加え、労働組合への加盟や性生活なども含み、原則として取得・利用・第三者提供が禁止されている。',
          '本人の同意がなくても自由にWebで公開できる。',
          '社内であれば自由に共有できる。',
        ],
        correctAnswer: '要配慮個人情報に加え、労働組合への加盟や性生活なども含み、原則として取得・利用・第三者提供が禁止されている。',
        explanation: '正解は選択肢2です。金融分野では「機微情報」として、要配慮個人情報よりも広い範囲（労組加盟など）を含み、原則取得禁止という厳しい制限があります。金融分野のガイドラインにおける「機微（センシティブ）情報」は、要配慮個人情報に加え、労働組合への加盟や性生活なども含み、原則として取得・利用・第三者提供が禁止されています。選択肢1、3、4は誤りです。',
      },
    ],
    textContent: `個人情報とは、生存する個人を識別できる情報のことです。氏名、住所、電話番号、メールアドレス、顔写真などが該当します。他の情報と組み合わせて個人を特定できるものも含まれます。

要配慮個人情報とは、人種、信条、病歴、犯罪歴など、差別や不利益につながる可能性が高い情報です。機微情報も同様に、慎重な取り扱いが求められます。

匿名加工情報は、特定の個人を識別できないように加工し、かつ、元の個人情報を復元できないようにした情報です。単なるマスキング（一部の情報を伏せ字などで隠す処理）とは異なり、特定の個人を識別できず、かつ「復元も不可能」な状態に加工した情報を指します。これらはAIの学習データとして活用されることも多く、適切な処理が必須です。

改正個人情報保護法において、個人情報を取り扱う事業者の対象範囲は、取り扱う個人情報の数に関わらず、全ての個人情報取扱事業者が法の適用対象となりました。かつての「5,000人要件」は撤廃され、小規模事業者や個人事業主を含むすべての事業者が法の適用対象となっています。

金融分野のガイドラインにおける「機微（センシティブ）情報」は、要配慮個人情報に加え、労働組合への加盟や性生活なども含み、原則として取得・利用・第三者提供が禁止されています。金融分野では「機微情報」として、要配慮個人情報よりも広い範囲を含み、原則取得禁止という厳しい制限があります。

生成AIを活用する際には、個人情報や機密情報を直接入力することは、情報漏えいのリスクを高めます。業務で使う場合は、入力制限、データ管理ルール、利用ガイドラインの整備が不可欠です。`,
  },
  {
    id: 'unit03-copyright',
    title: '制作物に関わる権利（知的財産権）',
    unitPoint: '生成AIによって生み出された制作物に関わる法的な権利関係を理解し、どこまでが許され、何が問題となるのかを正しく判断できる力を身につけます。',
    learningTips: `「誰が権利を持つのか」「どんな行為が侵害になるのか」を具体例と一緒に整理すると理解が定着します

AIが作ったから自由に使えるという考え方は誤りであることを常に意識しましょう`,
    cardDisplay: {
      slideImage: '/images/ch4_unit03_copyright.png',
      keyPoints: [
        '権利侵害：「類似性」と「依拠性」の両方が必要',
        'AI生成物の著作権：人間の創作的寄与があれば認められる可能性',
        '商用利用：規約確認、他者の権利侵害調査が必要',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '知的財産権の基本構造',
        explanation: '知的財産権には、著作権、特許権、商標権、意匠権、肖像権、パブリシティ権などがあります。創作物やブランド、発明、デザイン、人物の権利を法的に保護する仕組みです。',
      },
      {
        category: '生成AIと著作権',
        explanation: 'AIが生成した作品であっても、既存作品と類似性が高い場合、著作権侵害となる可能性があります。著作権侵害と判断されるためには、「類似性」と「依拠性（既存の著作物を知っていて、それに基づいたこと）」の両方が必要です。また、AI単体には著作権は認められず、原則として人間の関与の程度が重要になります。文化庁の見解（令和6年）において、AI生成物が「著作物」として認められるためには、「創作意図」と「人間による創作的寄与（試行錯誤や加筆修正など）」が必要です。',
      },
      {
        category: '肖像権とパブリシティ権',
        explanation: '実在の人物の顔や姿を無断で生成・利用すると、肖像権やパブリシティ権の侵害になる可能性があります。特にディープフェイクとの関係で社会問題化しています。',
      },
      {
        category: '不正競争防止法と営業秘密',
        explanation: '企業の営業秘密や限定提供データを無断で利用・公開する行為は不正競争防止法違反となります。不正競争防止法によって保護される「営業秘密」の3要件は、「秘密管理性（秘密として管理されていること）」「有用性（事業活動に有用であること）」「非公知性（公然と知られていないこと）」です。生成AI利用時にも守るべき重要な法的枠組みです。',
      },
      {
        category: '商標権と意匠権',
        explanation: '商標権や意匠権は、著作権とは異なり「依拠性（マネする意図）」がなくても、登録された権利と類似していれば侵害となります。AIを利用して他人の登録商標と類似したロゴを作成し、商用利用した場合、模倣する意図がなくても、結果的に類似しており、商用利用すれば商標権侵害となる可能性があります。',
      },
      {
        category: 'AI生成物の責任所在',
        explanation: 'AIが作ったからといって責任が免除されることはありません。生成物を利用・公開した人間が法的責任を負う点が極めて重要です。',
      },
    ],
    quizQuestions: [
      {
        question: '他人の著作物の権利を侵害している（著作権侵害）と判断されるために必要な2つの要件は、「類似性」ともう一つは何か。',
        options: [
          '独創性',
          '依拠性（いきょせい）',
          '商業性',
          '芸術性',
        ],
        correctAnswer: '依拠性（いきょせい）',
        explanation: '正解は「依拠性（いきょせい）」です。侵害成立には「似ていること（類似性）」に加え、「既存の著作物を知っていて、それに基づいたこと（依拠性）」の両方が必要です。著作権侵害と判断されるためには、「類似性」と「依拠性（既存の著作物を知っていて、それに基づいたこと）」の両方が必要です。選択肢1の「独創性」、選択肢3の「商業性」、選択肢4の「芸術性」は著作権侵害の要件ではありません。',
      },
      {
        question: '文化庁の見解（令和6年）において、AI生成物が「著作物」として認められるために必要な要素は、「創作意図」ともう一つは何か。',
        options: [
          'AIの性能の高さ',
          'プロンプトの長さ',
          '人間による「創作的寄与」（試行錯誤や加筆修正など）',
          '有料ツールの使用',
        ],
        correctAnswer: '人間による「創作的寄与」（試行錯誤や加筆修正など）',
        explanation: '正解は選択肢3です。AIが自律的に生成しただけでは著作物にならず、人間が道具としてAIを使いこなし、創作的に寄与したと認められる必要があります。文化庁の見解（令和6年）において、AI生成物が「著作物」として認められるためには、「創作意図」と「人間による創作的寄与（試行錯誤や加筆修正など）」が必要です。選択肢1、2、4は著作物として認められる条件ではありません。',
      },
      {
        question: '日本の著作権法において、個人の著作物の保護期間は原則としていつまでか。',
        options: [
          '創作から50年',
          '著作者の死後70年',
          '公表から20年',
          '永久に保護される',
        ],
        correctAnswer: '著作者の死後70年',
        explanation: '正解は「著作者の死後70年」です。原則として著作者の死後70年まで保護されます。保護期間が終了したものはパブリックドメインとなります。日本の著作権法では、原則として著作者の死後70年まで著作権が保護されます。選択肢1、3、4は誤りです。',
      },
      {
        question: '著名人の肖像（顔や姿）や氏名が持つ「顧客吸引力（経済的価値）」を排他的に利用する権利を何と呼ぶか。AI生成物で無断利用した場合に侵害となる恐れがある。',
        options: [
          '肖像権',
          'パブリシティ権',
          '商標権',
          '意匠権',
        ],
        correctAnswer: 'パブリシティ権',
        explanation: '正解は「パブリシティ権」です。プライバシーの保護（肖像権）とは別に、有名人の名前や姿を勝手に商品に使って利益を得ることを防ぐ権利が「パブリシティ権」です。著名人の肖像（顔や姿）や氏名が持つ「顧客吸引力（経済的価値）」を排他的に利用する権利です。選択肢1の「肖像権」はプライバシー保護の権利、選択肢3の「商標権」は商標の権利、選択肢4の「意匠権」はデザインの権利です。',
      },
      {
        question: '「不正競争防止法」によって保護される「営業秘密」の3要件に含まれないものはどれか。',
        options: [
          '秘密管理性（秘密として管理されていること）',
          '有用性（事業活動に有用であること）',
          '非公知性（公然と知られていないこと）',
          '審美性（見た目が美しいこと）',
        ],
        correctAnswer: '審美性（見た目が美しいこと）',
        explanation: '正解は選択肢4です。営業秘密の3要件は「秘密管理性」「有用性」「非公知性」です。審美性は意匠権などの要件です。不正競争防止法によって保護される「営業秘密」の3要件は、「秘密管理性（秘密として管理されていること）」「有用性（事業活動に有用であること）」「非公知性（公然と知られていないこと）」です。選択肢4の「審美性」は含まれません。',
      },
      {
        question: 'AIを利用して他人の登録商標と類似したロゴを作成し、商用利用した場合の法的判断として正しいものはどれか。',
        options: [
          'AIが作ったものなので、責任はAI開発者にある。',
          '模倣する意図がなくても、結果的に類似しており、商用利用すれば商標権侵害となる可能性がある。',
          'プロンプトに商標名を入れなければ侵害にはならない。',
          '商標権はAI生成物には適用されない。',
        ],
        correctAnswer: '模倣する意図がなくても、結果的に類似しており、商用利用すれば商標権侵害となる可能性がある。',
        explanation: '正解は選択肢2です。商標権や意匠権は、著作権とは異なり「依拠性（マネする意図）」がなくても、登録された権利と類似していれば侵害となります。AIを利用して他人の登録商標と類似したロゴを作成し、商用利用した場合、模倣する意図がなくても、結果的に類似しており、商用利用すれば商標権侵害となる可能性があります。選択肢1、3、4は誤りです。',
      },
    ],
    textContent: `知的財産権には、著作権、特許権、商標権、意匠権、肖像権、パブリシティ権などがあります。創作物やブランド、発明、デザイン、人物の権利を法的に保護する仕組みです。

AIが生成した作品であっても、既存の作品と似ている場合、著作権侵害となる可能性があります。著作権侵害と判断されるためには、「類似性」と「依拠性（既存の著作物を知っていて、それに基づいたこと）」の両方が必要です。AI単体には著作権は認められず、原則として人間がどの程度関与したかが重要になります。文化庁の見解（令和6年）において、AI生成物が「著作物」として認められるためには、「創作意図」と「人間による創作的寄与（試行錯誤や加筆修正など）」が必要です。

実在の人物の顔や姿を無断で生成したり利用したりすると、肖像権やパブリシティ権の侵害になる可能性があります。特にディープフェイクとの関係で社会問題になっています。

企業の営業秘密や限定提供データを無断で利用したり公開したりする行為は、不正競争防止法違反となります。不正競争防止法によって保護される「営業秘密」の3要件は、「秘密管理性（秘密として管理されていること）」「有用性（事業活動に有用であること）」「非公知性（公然と知られていないこと）」です。生成AIを使う時にも守るべき重要な法的枠組みです。

商標権や意匠権は、著作権とは異なり「依拠性（マネする意図）」がなくても、登録された権利と類似していれば侵害となります。AIを利用して他人の登録商標と類似したロゴを作成し、商用利用した場合、模倣する意図がなくても、結果的に類似しており、商用利用すれば商標権侵害となる可能性があります。

AIが作ったからといって責任が免除されることはありません。生成物を利用したり公開したりした人間が法的責任を負う点が極めて重要です。`,
  },
  {
    id: 'unit04-ai-guidelines',
    title: 'AI社会の基本理念とAI社会原則',
    unitPoint: 'AIが社会に深く浸透する時代において、どのような価値観とルールのもとでAIを活用すべきかを理解し、技術だけでなく社会的責任の視点からAIを捉える力を養います。',
    learningTips: `「技術が進歩すると何が起こるか」ではなく、「どのような社会を目指すか」という視点で整理すると理解が深まります

理念と原則は実務の判断基準として使えるレベルで理解しておきましょう`,
    cardDisplay: {
      slideImage: '/images/ch4_unit04_ai_guidelines.png',
      keyPoints: [
        'AI事業者ガイドライン第1.1版：AI開発者、提供者、利用者の3主体の責務',
        'AI社会原則：「人間中心」「公平性」「透明性」などが柱',
        'AI新法：2025年交付、大規模モデル開発者への規制',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'AI社会の基本理念',
        explanation: '日本におけるAI活用の指針は、人間の尊厳が尊重される社会、多様な背景を持つ人々が多様な幸せを追求できる社会、持続可能な社会という三つの理念に基づいています。AIは人間の能力を拡張し、社会全体の幸福と発展に貢献する存在であるべきとされています。',
      },
      {
        category: 'AI社会原則',
        explanation: 'AI活用において守るべき基本原則として、人間中心の考え方、安全性、公平性、プライバシー保護、セキュリティ確保、透明性、アカウンタビリティが定められています。これらは技術開発・導入・運用のすべての段階で考慮されるべき判断基準です。',
      },
      {
        category: '共通の指針としての役割',
        explanation: 'これらの理念と原則は、企業、行政、開発者、利用者すべてに共通する行動指針となります。AIの進歩が人間社会に利益をもたらす一方で、リスクを最小化するための社会的なルールでもあります。',
      },
      {
        category: 'AI時代の人間の役割',
        explanation: 'AIが高度化するほど、人間の判断、倫理観、責任の重要性は増していきます。AI社会原則は、技術の暴走を防ぎ、人間中心の社会を維持するための基盤となります。',
      },
    ],
    quizQuestions: [
      {
        question: '「AI事業者ガイドライン（第1.1版）」において、AIビジネスに関わる主体は3つに分類されている。「AI開発者」「AI提供者」に加え、もう1つは何か。',
        options: [
          'AI利用者（AI Business User）',
          'AI監視者',
          'AI規制者',
          'AI消費者',
        ],
        correctAnswer: 'AI利用者（AI Business User）',
        explanation: '正解は「AI利用者（AI Business User）」です。ガイドラインでは、AIモデルを作る「開発者」、サービスとして提供する「提供者」、それを事業で活用する「利用者（主に企業）」の3主体それぞれの責務を規定しています。「AI事業者ガイドライン（第1.1版）」において、AIビジネスに関わる主体は「AI開発者（AIモデルを作る）」「AI提供者（サービスとして提供する）」「AI利用者（AI Business User、事業で活用する主に企業）」の3つに分類されています。選択肢2、3、4は誤りです。',
      },
      {
        question: 'AI事業者ガイドラインにおいて、「AI利用者（事業者）」に求められる重要な責務の一つはどれか。',
        options: [
          'AIモデルのアルゴリズムをゼロから開発すること',
          'AIの判断結果に過度に依存せず、最終的な判断は人間が行う（人間中心の判断）こと',
          'すべてのデータを公開すること',
          'AIの利用を禁止すること',
        ],
        correctAnswer: 'AIの判断結果に過度に依存せず、最終的な判断は人間が行う（人間中心の判断）こと',
        explanation: '正解は選択肢2です。利用者はAIを鵜呑みにせず、適正利用やリスク管理を行い、最終的な意思決定に責任を持つことが求められます。AI事業者ガイドラインにおいて、AI利用者（事業者）に求められる重要な責務の一つは、AIの判断結果に過度に依存せず、最終的な判断は人間が行う（人間中心の判断）ことです。選択肢1は開発者の責務、選択肢3、4は不適切です。',
      },
      {
        question: '2025年に交付された「AI新法（人工知能関連技術の研究開発及び活用の推進に関する法律）」の特徴的な規制アプローチはどれか。',
        options: [
          'すべてのAI開発を一律に禁止する',
          'リスクベース・アプローチ（AIのリスクの大きさに応じて、異なるレベルの義務や規制を課す）',
          'AI利用者のみを処罰する',
          '開発者の国籍で規制を変える',
        ],
        correctAnswer: 'リスクベース・アプローチ（AIのリスクの大きさに応じて、異なるレベルの義務や規制を課す）',
        explanation: '正解は選択肢2です。AI新法や欧州AI法（EU AI Act）などは、高リスクなAIには厳しい規制を、低リスクなAIには緩やかな規制を適用する「リスクベース・アプローチ」を採用しています。2025年に交付された「AI新法（人工知能関連技術の研究開発及び活用の推進に関する法律）」の特徴的な規制アプローチは、リスクベース・アプローチです。AIのリスクの大きさに応じて、異なるレベルの義務や規制を課す方式で、高リスクなAIには厳しい規制を、低リスクなAIには緩やかな規制を適用します。選択肢1、3、4は誤りです。',
      },
      {
        question: 'AI倫理において、ブラックボックス化を防ぎ、判断根拠を説明できるようにすることを何と呼ぶか？',
        options: [
          '公平性',
          '透明性・説明可能性',
          '人間中心',
          '安全性',
        ],
        correctAnswer: '透明性・説明可能性',
        explanation: '正解は「透明性・説明可能性」です。AI倫理において、ブラックボックス化を防ぎ、判断根拠を説明できるようにすることを透明性・説明可能性と呼びます。これはAI社会原則の柱の一つです。選択肢1の「公平性」、選択肢3の「人間中心」、選択肢4の「安全性」もAI倫理の重要な概念ですが、判断根拠の説明可能性を指すのは「透明性・説明可能性」です。',
      },
      {
        question: 'AI社会原則の一つである「人間中心（Human-centric）」の考え方として適切なものはどれか。',
        options: [
          'AIが人間の代わりに全ての政治的決定を行うべきである。',
          'AIは人間の尊厳や基本的人権を尊重し、人間の幸福や能力拡張のために利用されるべきである。',
          '人間はAIの進化のために奉仕すべきである。',
          'AIの効率性を最優先し、人間の雇用は考慮しなくてよい。',
        ],
        correctAnswer: 'AIは人間の尊厳や基本的人権を尊重し、人間の幸福や能力拡張のために利用されるべきである。',
        explanation: '正解は選択肢2です。AIはあくまで人間のための道具であり、人間の尊厳や権利が脅かされないよう、人間がコントロール権を持つべきという原則です。AI社会原則の「人間中心（Human-centric）」の考え方とは、AIは人間の尊厳や基本的人権を尊重し、人間の幸福や能力拡張のために利用されるべきであるという考え方です。AIは人間の能力を拡張し、社会全体の幸福と発展に貢献する存在であるべきとされています。選択肢1、3、4は誤りです。',
      },
    ],
    textContent: `日本におけるAI活用の指針は、三つの理念に基づいています。一つ目は、人間の尊厳が尊重される社会です。二つ目は、多様な背景を持つ人々が多様な幸せを追求できる社会です。三つ目は、持続可能な社会です。AIは人間の能力を拡張し、社会全体の幸福と発展に貢献する存在であるべきとされています。

AI活用において守るべき基本原則として、人間中心の考え方、安全性、公平性、プライバシー保護、セキュリティ確保、透明性、アカウンタビリティが定められています。これらは技術開発、導入、運用のすべての段階で考慮されるべき判断基準です。

「AI事業者ガイドライン（第1.1版）」において、AIビジネスに関わる主体は3つに分類されています。「AI開発者（AIモデルを作る）」「AI提供者（サービスとして提供する）」「AI利用者（AI Business User、事業で活用する主に企業）」の3主体それぞれの責務を規定しています。AI利用者（事業者）に求められる重要な責務の一つは、AIの判断結果に過度に依存せず、最終的な判断は人間が行う（人間中心の判断）ことです。

2025年に交付された「AI新法（人工知能関連技術の研究開発及び活用の推進に関する法律）」の特徴的な規制アプローチは、リスクベース・アプローチです。AIのリスクの大きさに応じて、異なるレベルの義務や規制を課す方式で、高リスクなAIには厳しい規制を、低リスクなAIには緩やかな規制を適用します。

AI倫理における「説明可能性（Explainability）」とは、AIがなぜその結論に至ったのか、判断の根拠やプロセスを人間が理解できるように説明できることを意味します。ブラックボックス化を防ぎ、AIの判断根拠を利用者に説明できる能力を指します。

これらの理念と原則は、企業、行政、開発者、利用者すべてに共通する行動指針となります。AIの進歩が人間社会に利益をもたらす一方で、リスクを最小化するための社会的なルールでもあります。

AIが高度化するほど、人間の判断、倫理観、責任の重要性は増していきます。AI社会原則は、技術の暴走を防ぎ、人間中心の社会を維持するための基盤となります。`,
  },
];

const getBadgeClass = (color: string) => {
  switch (color) {
    case 'primary': return 'bg-primary-100 text-primary-800';
    case 'secondary': return 'bg-secondary-100 text-secondary-800';
    case 'accent': return 'bg-accent-100 text-accent-800';
    case 'info': return 'bg-info-100 text-info-800';
    case 'yellow': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-primary-100 text-primary-800';
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case 'primary': return 'bg-primary-50';
    case 'secondary': return 'bg-secondary-50';
    case 'accent': return 'bg-accent-50';
    case 'info': return 'bg-info-50';
    case 'yellow': return 'bg-yellow-50';
    default: return 'bg-primary-50';
  }
};

export default function Chapter4Page() {
  const course = courses.find(c => c.id === courseId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // 全ユニットの問題を集約してランダムにシャッフル
  const getAllUnitQuestions = () => {
    const allQuestions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }> = [];
    newChapter4Sections.forEach((section) => {
      if (section.quizQuestions && section.quizQuestions.length > 0) {
        allQuestions.push(...section.quizQuestions);
      }
    });
    // ランダムにシャッフル（Fisher-Yatesアルゴリズム）
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const [questions, setQuestions] = useState(() => getAllUnitQuestions());
  
  // ユニット別確認問題の状態管理
  const [unitQuizOpen, setUnitQuizOpen] = useState(false);
  const [currentUnitQuiz, setCurrentUnitQuiz] = useState<{
    sectionId: string;
    title: string;
    questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }>;
  } | null>(null);

  const handleOpenUnitQuiz = (sectionId: string, questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }>) => {
    const section = newChapter4Sections.find(s => s.id === sectionId);
    setCurrentUnitQuiz({
      sectionId,
      title: section?.title || '',
      questions,
    });
    setUnitQuizOpen(true);
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCorrectAnswersCount = () => {
    return questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    // 問題を再シャッフル
    const newQuestions = getAllUnitQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">コースが見つかりません</h1>
            <p className="text-gray-600">指定されたコースは存在しません。</p>
            <Link href="/" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800">
              <ChevronLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <PurchaseGuard>
      <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            コース一覧に戻る
          </Link>
        </div>
        
        <div className={`p-8 rounded-2xl mb-8 ${getColorClass(course.color)}`}>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getBadgeClass(course.color)}`}>
            {course.difficulty}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{course.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.time}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setShowQuiz(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !showQuiz 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            学習内容
          </button>
          <button
            onClick={() => setShowQuiz(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              showQuiz 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            問題演習
          </button>
        </div>

        {!showQuiz ? (
          /* 学習内容 - 新しいハイブリッドカードUI */
          <div className="space-y-6">
            {/* 新しい構造のセクション */}
            {newChapter4Sections.map((section) => (
              <HybridContentCard
                key={section.id}
                slideImage={section.cardDisplay.slideImage}
                title={section.title}
                unitPoint={section.unitPoint}
                learningTips={section.learningTips}
                keyPoints={section.cardDisplay.keyPoints}
                importantExplanations={section.importantExplanations}
                versionInfo={section.cardDisplay.versionInfo}
                textContent={section.textContent}
                quizQuestions={section.quizQuestions}
                sectionId={section.id}
                onOpenQuiz={handleOpenUnitQuiz}
              />
            ))}
          </div>
        ) : (
          /* Quiz */
          <div className="bg-white rounded-lg shadow-sm p-8 border">
            {!quizCompleted ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">問題演習</h2>
                  <div className="text-sm text-gray-600">
                    問題 {currentQuestionIndex + 1} / {questions.length}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question display */}
                <div className="mb-8">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      問題 {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700">{questions[currentQuestionIndex]?.question}</p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {questions[currentQuestionIndex]?.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          answers[currentQuestionIndex] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[currentQuestionIndex] === option
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestionIndex] === option && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    前の問題
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestionIndex]}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      !answers[currentQuestionIndex]
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {currentQuestionIndex === questions.length - 1 ? '結果を見る' : '次の問題'}
                  </button>
                </div>
              </div>
            ) : (
              /* Results */
              <div className="text-center">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">演習完了！</h2>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {getCorrectAnswersCount()} / {questions.length}
                    </div>
                    <div className="text-gray-600">
                      正答率: {Math.round((getCorrectAnswersCount() / questions.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Question results */}
                <div className="space-y-4 mb-8">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        answers[index] === question.correctAnswer
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">問題 {index + 1}</span>
                        {answers[index] === question.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                      <div className="text-sm">
                        <span className="text-gray-600">あなたの答え: </span>
                        <span className="font-medium">{answers[index]}</span>
                      </div>
                      {answers[index] !== question.correctAnswer && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">正解: </span>
                          <span className="font-medium text-green-600">{question.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetQuiz}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  もう一度挑戦
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 右下固定のチャットボタン */}
      <ChatButton />

      {/* ユニット別確認問題モーダル */}
      {currentUnitQuiz && (
        <UnitQuizModal
          isOpen={unitQuizOpen}
          onClose={() => {
            setUnitQuizOpen(false);
            setCurrentUnitQuiz(null);
          }}
          questions={currentUnitQuiz.questions}
          unitTitle={currentUnitQuiz.title}
        />
      )}
    </div>
    </PurchaseGuard>
  );
} 