'use client';

import { useState } from 'react';
import { ChevronLeft, BookOpen, Brain, CheckCircle, Circle, Clock } from 'lucide-react';
import Link from 'next/link';
import { courses } from '../../../data/courses';
import HybridContentCard from '../../components/HybridContentCard';
import ChatButton from '../../components/ChatButton';
import UnitQuizModal from '../../components/UnitQuizModal';
import PurchaseGuard from '../../components/PurchaseGuard';

const courseId = 'chapter3';

// 新しい構造のテストデータ（YAMLファイルから将来的に読み込む）
const newChapter3Sections = [
  {
    id: 'unit01-generative-ai-modality',
    title: '生成AIができることと主なサービス',
    unitPoint: '現代の生成AIによって実現できる生成物の種類（テキスト・画像・音声・動画など）と、それを支える代表的なサービスや技術の全体像を理解し、生成AIの現在地を把握することが目的です。',
    learningTips: `「何を生成できるのか」と「それを支える技術やサービス」を必ずセットで整理すると混乱しません

生成対象ごとに用途とリスクも一緒にイメージして覚えると理解が安定します`,
    cardDisplay: {
      slideImage: '/images/ch3_unit01_modality.png',
      keyPoints: [
        '画像生成：拡散モデルや自己回帰型が主流',
        '音声生成：TTS（テキスト読み上げ）、リップシンク技術',
        '動画生成：Sora（OpenAI）、Veo3（Google）',
        '音楽生成：著作権侵害のリスクに注意',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '生成AIとは何か',
        explanation: '生成AI（ジェネレーティブAI）とは、既存データをもとに新しいコンテンツを生成するAIです。従来のAIが「分類・予測・判断」を主としていたのに対し、生成AIは「文章・画像・音声・動画・音楽などを創り出す」点が最大の特徴です。要するに、認識のAIから創造のAIへの転換が起きています。',
      },
      {
        category: 'テキスト生成AI',
        explanation: '文章作成、要約、翻訳、対話、コード生成などを行います。代表例としてChatGPT、Claude、Geminiなどがあり、業務文書作成やカスタマーサポート、自動要約など幅広く活用されています。',
      },
      {
        category: '画像生成AI',
        explanation: 'テキスト指示から画像を生成し、リサイズ、正規化、データ拡張（augmentation）なども可能です。マーケティング素材作成、デザイン補助、広告制作などで利用されています。従来の拡散モデル（Diffusion Model）はノイズから画像を生成する方式でしたが、最新の自己回帰型（Autoregressive）モデルは画像をトークン列として扱い、左上から右下へ順次描画することで、画像内の文字（看板やロゴなど）を正確に描写・制御できるようになりました。',
      },
      {
        category: '自己回帰型画像生成モデルの特徴',
        explanation: '自己回帰型モデルは、画像をトークン（断片）として扱い、テキスト生成と同じように左上から右下へ順番に描画していく方式です。拡散モデルでは苦手だった画像内の文字、ロゴ、細かい線、レイアウトの精度が劇的に向上しました。GPT-4oや最新の画像生成AIで採用が進んでいます。',
      },
      {
        category: 'VAE（変分自己符号化器）',
        explanation: 'VAEは、エンコーダとデコーダで構成されます。エンコーダは入力データを「潜在ベクトル（データの特徴を要約した情報）」という低次元の表現に変換します。デコーダは潜在ベクトルから元の画像を復元します。VAEはデータを圧縮・復元することで新しいデータを生成するモデルです。',
      },
      {
        category: '音声生成AI',
        explanation: '音声合成、ナレーション生成、音声変換などを行います。コールセンター自動応答、ナレーション制作、音声アシスタントなどに応用されています。リップシンク（Lip Sync）技術により、特定の人物の画像の口の動きを、生成された音声に同期させることも可能になり、バーチャルヒューマンなどの表現力が向上しています。',
      },
      {
        category: '動画生成AI',
        explanation: 'テキストや画像から動画を生成します。SoraやVeo3などが代表的で、広告・教育・コンテンツ制作などの分野に影響を与えています。2025年にGoogle DeepMindが発表したVeo3は、高精細な映像の生成に加え、環境音やセリフなどの音声も一括で合成できる統合的な生成が可能であることが特徴です。',
      },
      {
        category: 'マルチモーダルAIの登場',
        explanation: 'テキスト・画像・音声・動画を統合的に処理できるAIが登場し、生成AIは単一機能から総合知能へと進化しています。これにより複雑なタスクの自動化や高精度な対話が可能になっています。',
      },
      {
        category: '生成AI活用のメリットと課題',
        explanation: '業務効率化、創作支援、生産性向上などの大きなメリットがある一方で、誤情報生成、著作権、プライバシー、セキュリティといったリスク管理も不可欠です。技術と社会的責任をセットで理解することが、生成AI活用において極めて重要になります。',
      },
    ],
    quizQuestions: [
      {
        question: 'GPT-4oや最新の画像生成AIにおいて採用が進んでいる「自己回帰型（Autoregressive）」モデルの特徴として、従来の「拡散モデル（Diffusion）」と比較した際の主な利点はどれか。',
        options: [
          'ノイズを除去するプロセスにより、芸術的な抽象画が生成しやすくなる。',
          '画像をトークン列として左上から処理することで、画像内の文字（看板やロゴなど）を正確に描写・制御しやすくなる。',
          '計算コストが拡散モデルの10倍になるが、画質は変わらない。',
          '静止画しか生成できず、動画生成には応用できない。',
        ],
        correctAnswer: '画像をトークン列として左上から処理することで、画像内の文字（看板やロゴなど）を正確に描写・制御しやすくなる。',
        explanation: '正解は選択肢2です。拡散モデルから自己回帰型への転換により、これまで苦手だった「文字の描写」が正確になった点が強調されています。自己回帰型は画像をトークンとして扱い、左上から右下へ順次描画することで、画像内の文字、ロゴ、細かい線、レイアウトの精度が劇的に向上しました。選択肢1は拡散モデルの特徴、選択肢3と4は誤りです。',
      },
      {
        question: '2025年にGoogle DeepMindが発表した動画生成AI「Veo3」の画期的な特徴として、最も適切なものはどれか。',
        options: [
          'テキストのみを出力する。',
          '5秒以内の無音動画しか生成できない。',
          '高精細な映像の生成に加え、環境音やセリフなどの音声も一括で合成できる。',
          '著作権フリーの素材のみを使用して生成する。',
        ],
        correctAnswer: '高精細な映像の生成に加え、環境音やセリフなどの音声も一括で合成できる。',
        explanation: '正解は選択肢3です。Veo3は映像だけでなく、音声（環境音やセリフ）も含めた統合的な生成が可能であることが特徴です。動画生成AIの進化により、映像と音声を一括で生成できるようになりました。選択肢1、2、4は誤りです。',
      },
      {
        question: 'テキスト生成AI（LLM）における「自然言語処理（NLP）」の説明として、最も適切なものはどれか。',
        options: [
          'コンピュータがプログラミング言語を人間の言語に変換する技術。',
          '人間が日常的に使っている言語の曖昧さや複雑さを扱い、理解・生成するための技術の総称。',
          '画像データをテキストデータに変換する技術のみを指す。',
          '音声データを数値データに変換する技術のみを指す。',
        ],
        correctAnswer: '人間が日常的に使っている言語の曖昧さや複雑さを扱い、理解・生成するための技術の総称。',
        explanation: '正解は選択肢2です。NLPは人間が使う自然言語をコンピュータが扱うための基盤技術であり、LLMの根幹をなします。コンピュータが日本語や英語などの自然な言葉を理解し、生成するための技術です。選択肢1、3、4は誤りです。',
      },
      {
        question: '音声生成AIにおいて、特定の人物の画像の口の動きを、生成された音声に同期させる技術を何と呼ぶか。',
        options: [
          'リップシンク（Lip Sync）',
          'ボイスチェンジャー',
          'マスキング',
          'トークナイゼーション',
        ],
        correctAnswer: 'リップシンク（Lip Sync）',
        explanation: '正解は選択肢1です。音声生成に加え、口の動きを同期させるリップシンク技術の進化により、バーチャルヒューマンなどの表現力が向上しています。選択肢2の「ボイスチェンジャー」は声質を変える技術、選択肢3の「マスキング」は情報を隠す処理、選択肢4の「トークナイゼーション」はテキストを分割する処理です。',
      },
      {
        question: '画像生成AIの学習手法として知られる「VAE（変分自己符号化器）」の構成要素である「エンコーダ」の役割はどれか。',
        options: [
          'ノイズから画像を生成する。',
          '生成された画像が本物かどうかを識別する。',
          '入力データを「潜在ベクトル（データの特徴を要約した情報）」という低次元の表現に変換する。',
          '潜在ベクトルから元の画像を復元する。',
        ],
        correctAnswer: '入力データを「潜在ベクトル（データの特徴を要約した情報）」という低次元の表現に変換する。',
        explanation: '正解は選択肢3です。VAEはエンコーダ（特徴を抽出して圧縮）とデコーダ（復元）で構成されます。エンコーダは入力データを潜在ベクトルに変換します。選択肢1は拡散モデルの特徴、選択肢2はGANの識別器の役割、選択肢4はデコーダの役割です。',
      },
    ],
    textContent: `生成AI（ジェネレーティブAI）は、機械学習を使って新しいデータを作り出すAIです。テキスト、プログラムコード、画像、動画、音声、音楽など、様々な種類のコンテンツを生成できます。現在も進化し続けています。

テキスト生成AIは、コンピュータが人間の言葉を理解して、文章を作り出します。これには自然言語処理という技術が使われます。自然言語処理とは、コンピュータが日本語や英語などの自然な言葉を扱うための技術です。この技術と機械学習を組み合わせることで、文章の自動生成が可能になります。ChatGPT、Claude、Geminiなどが代表的なサービスです。

画像生成AIは、テキストで指示すると、その内容に合わせた画像を作ります。マーケティングの素材作り、デザインの補助、広告の制作などに使われています。従来は拡散モデル（Diffusion Model）が主流でしたが、最新の自己回帰型（Autoregressive）モデルでは、画像をトークン列として左上から右下へ順次描画することで、画像内の文字（看板やロゴなど）を正確に描写できるようになりました。

音声生成AIは、テキストから音声を作り出したり、ナレーションを生成したりします。コールセンターの自動応答、ナレーション制作、音声アシスタントなどに使われています。リップシンク（Lip Sync）技術により、特定の人物の画像の口の動きを、生成された音声に同期させることも可能になり、バーチャルヒューマンなどの表現力が向上しています。

音楽生成AIは、音楽を作ることができます。ただし、著作権の問題があるため、使う際には注意が必要です。

動画生成AIは、テキストや画像から動画を作ります。OpenAIのSoraやGoogleのVeo3などが代表的なサービスです。2025年にGoogle DeepMindが発表したVeo3は、高精細な映像の生成に加え、環境音やセリフなどの音声も一括で合成できる統合的な生成が可能であることが特徴です。

マルチモーダルAIは、テキスト、画像、音声、動画など、様々な種類のデータを同時に扱えるAIです。文章と画像を組み合わせて指示を出すこともできます。生成AIは、一つの機能に限られていたものから、様々なデータを扱える総合的なAIへと進化しています。

生成AIを使うことで、仕事の効率が上がったり、創作活動が支援されたりするなど、多くのメリットがあります。一方で、間違った情報が生成されたり、著作権の問題が起きたり、プライバシーやセキュリティのリスクもあるため、注意が必要です。`,
  },
  {
    id: 'unit02-deepfake',
    title: 'ディープフェイク技術とその危険性',
    unitPoint: '生成AIの発展によって可能になったディープフェイク技術の仕組みと、それが社会にもたらすリスクを理解し、なぜ情報リテラシーがこれまで以上に重要になっているのかを整理します。',
    learningTips: `「技術的に何ができるか」と「社会にどんな影響が出るか」を必ずセットで整理すると理解が定着します

便利さと危険性の両面を同時に考える習慣をつけましょう`,
    cardDisplay: {
      slideImage: '/images/ch3_unit02_deepfake.png',
      keyPoints: [
        'ディープフェイク：AIで人物の顔や声を合成',
        'リスク：政治的混乱、金融詐欺、社会的信用の毀損',
        '対策：技術的検知ツールと人間のリテラシー',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'ディープフェイクとは何か',
        explanation: 'ディープフェイクとは、ディープラーニングを用いて人の顔や声、映像を本物のように合成・生成する技術です。画像・音声・動画すべてが対象となり、現実と見分けがつかないレベルまで精度が向上しています。',
      },
      {
        category: 'ディープフェイクが可能にすること',
        explanation: '本人が話していない発言動画の生成、存在しない出来事の映像作成、音声のなりすましなどが可能になります。要するに、「現実を偽造できる技術」が誰でも使える状態になっています。',
      },
      {
        category: '社会的リスク',
        explanation: '偽情報の拡散、詐欺、名誉毀損、選挙介入、金融犯罪など深刻な問題を引き起こします。特にSNSと組み合わさることで誤情報が爆発的に拡散し、社会的混乱を招く危険性があります。2023年には、アメリカ国防総省（ペンタゴン）近くで爆発があったとする偽画像がSNSで拡散され、米国株式市場（ダウ平均株価）の一時的な下落を引き起こした事件が発生しました。また、イギリスの企業では、音声生成AIを用いて親会社のCEOの声を模倣し、電話で巨額の送金を指示するディープフェイクボイス詐欺も発生しています。',
      },
      {
        category: 'ディープフェイク対策の重要性',
        explanation: '技術的な検出技術の開発だけでなく、利用者側の情報リテラシー向上が不可欠です。生成物は必ず一次情報を確認し、拡散の前に真偽を検証する姿勢が求められます。',
      },
      {
        category: '生成AI時代の情報リテラシー',
        explanation: '「AIが生成したから正しい」とは限らないという認識が重要です。人間の判断と検証がこれまで以上に重要な役割を持つ時代になっています。',
      },
    ],
    quizQuestions: [
      {
        question: 'ディープフェイク技術が悪用された事例として、2023年に発生し、米国株式市場（ダウ平均株価）の一時的な下落を引き起こした事件の内容はどれか。',
        options: [
          '有名俳優が選挙に立候補したという偽動画。',
          'アメリカ国防総省（ペンタゴン）近くで爆発があったとする偽画像。',
          'ある企業のCEOが辞任するという偽音声。',
          '火星に宇宙人がいるという偽ニュース。',
        ],
        correctAnswer: 'アメリカ国防総省（ペンタゴン）近くで爆発があったとする偽画像。',
        explanation: '正解は選択肢2です。ペンタゴン爆発の偽画像がSNSで拡散され、金融市場に混乱を与えた事例は、AI生成物の社会的リスクとして重要です。この事件は、ディープフェイク技術が金融市場に与える影響を示す具体例として知られています。選択肢1、3、4は誤りです。',
      },
      {
        question: 'イギリスの企業で発生した「ディープフェイクボイス詐欺」の手口として、正しいものはどれか。',
        options: [
          '取引先の担当者になりすましたメールを送りつけた。',
          '音声生成AIを用いて親会社のCEOの声を模倣し、電話で巨額の送金を指示した。',
          '無言電話を繰り返して業務を妨害した。',
          '社内会議の議事録を改ざんした。',
        ],
        correctAnswer: '音声生成AIを用いて親会社のCEOの声を模倣し、電話で巨額の送金を指示した。',
        explanation: '正解は選択肢2です。音声生成AIの悪用により、信頼できる人物の声（CEOや取引先）を模倣して金銭を騙し取る詐欺が発生しています。このようなディープフェイクボイス詐欺は、オレオレ詐欺の高度化版として深刻な問題となっています。選択肢1、3、4は誤りです。',
      },
      {
        question: 'ディープフェイク（Deepfake）の定義として、最も適切な記述はどれか。',
        options: [
          'AIが作成した芸術的な絵画のこと。',
          'ディープラーニング等を利用して、実在しない人物や実際には行っていない言動を含む、真偽の識別が困難な合成コンテンツを作成する技術。',
          '検索エンジンの検索結果を偽装する技術。',
          'コンピュータウイルスの別名。',
        ],
        correctAnswer: 'ディープラーニング等を利用して、実在しない人物や実際には行っていない言動を含む、真偽の識別が困難な合成コンテンツを作成する技術。',
        explanation: '正解は選択肢2です。ディープフェイクは、ディープラーニングを用いて人の顔や声、映像を本物のように合成する技術です。人を欺く目的で使用されることが多く、真偽不明な合成メディアを作成する技術を指します。画像、音声、動画すべてが対象となり、現実と見分けがつかないレベルまで精度が向上しています。選択肢1、3、4は誤りです。',
      },
    ],
    textContent: `ディープフェイクは、ディープラーニングを使って人の顔や声、映像を本物そっくりに合成する技術です。画像、音声、動画すべてが対象で、現実と見分けがつかないほど精度が高くなっています。

この技術を使うと、実在しない人物の動画や音声を作ることができます。本人が話していないのに話しているように見える動画、実際には起きていない出来事の映像、他人の声に成りすますことなどが可能です。オレオレ詐欺や偽の動画を作るなど、悪用される危険性があります。

ディープフェイクによる社会的なリスクとして、偽の情報が広まること、詐欺、名誉を傷つけること、選挙への影響、金融犯罪など、深刻な問題が指摘されています。特にSNSと組み合わさると、誤った情報が爆発的に広まり、社会が混乱する危険性があります。2023年には、アメリカ国防総省（ペンタゴン）近くで爆発があったとする偽画像がSNSで拡散され、米国株式市場（ダウ平均株価）の一時的な下落を引き起こした事件が発生しました。また、イギリスの企業では、音声生成AIを用いて親会社のCEOの声を模倣し、電話で巨額の送金を指示するディープフェイクボイス詐欺も発生しています。

ディープフェイクに対応するため、技術的に見分ける方法の開発が進められています。また、使う側が情報を見極める力をつけることも大切です。AIが作ったものは必ず元の情報を確認し、広める前に本当かどうか調べることが求められます。

生成AIの時代では、AIが作ったからといって必ず正しいとは限りません。情報が本当かどうかを見極める力が、これまで以上に重要になっています。人間が判断し、確かめることが大きな役割を果たす時代です。`,
  },
  {
    id: 'unit03-rag',
    title: 'RAG（検索拡張生成）',
    unitPoint: '生成AIの弱点である情報の古さや誤情報（ハルシネーション）を補うために開発されたRAGの仕組みと、その実用的な価値を理解します。',
    learningTips: `「なぜRAGが必要なのか」「生成AI単体と何が違うのか」を意識して整理すると理解が深まります

検索と生成がどの順番で組み合わさっているかをイメージできるようにしましょう`,
    cardDisplay: {
      slideImage: '/images/ch3_unit03_rag.png',
      keyPoints: [
        '課題：LLMは学習していない最新情報を知らない',
        '解決策：外部データベースを検索して回答を生成',
        'メリット：ハルシネーション低減、再学習なしで知識更新、根拠の提示',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'RAGとは何か',
        explanation: 'RAGとは、Retrieval Augmented Generation（検索拡張生成）の略で、生成AIが回答を作る前に外部データベースや文書を検索し、その情報をもとに文章を生成する仕組みです。要するに、生成AIに「調べてから答えさせる」構造です。',
      },
      {
        category: 'RAGが生まれた背景',
        explanation: '通常の生成AIは、学習時点までの知識しか持たず、最新情報や社内文書などの外部データに直接アクセスできません。また、誤った情報を事実のように生成するハルシネーションの問題も抱えています。RAGはこれらの課題を解決するために登場しました。',
      },
      {
        category: 'RAGの仕組み',
        explanation: 'まずユーザーの質問を小さな単位（チャンク）に分解します。長い文書を意味のまとまりごとに分割する処理をチャンク分割（Chunking）と呼び、これにより検索精度が向上します。次に、テキストを多次元の数値ベクトルに変換する処理（ベクトル化・エンベッディング）を行い、ベクトルデータベースを用いて関連情報を高速検索します。検索結果をプロンプトに組み込み、その情報を根拠としてAIが回答を生成します。',
      },
      {
        category: 'RAGの提唱と背景',
        explanation: '2020年にFacebook AI Research（現Meta AI）のPatrick LewisらのチームがRAGの概念を正式に提案しました。従来のファインチューニング（追加学習）と比較すると、RAGはデータの更新が容易（データベースに追加するだけでよい）、回答の根拠（出典）を明示しやすい、再学習にかかる膨大なコストや時間を削減できるといったメリットがあります。ただし、RAGはハルシネーションを「低減」しますが、「完全にゼロ」にすることはできません。',
      },
      {
        category: 'RAGのメリット',
        explanation: '最新情報や社内資料を反映できる。回答の根拠を明示できるため信頼性が高まる。ハルシネーションの発生率を大きく下げられる。',
      },
      {
        category: 'RAGの主なユースケース',
        explanation: '社内ナレッジ検索、FAQ自動応答、法務・医療文書検索、カスタマーサポート支援など、業務システムとの親和性が非常に高い技術です。',
      },
    ],
    quizQuestions: [
      {
        question: '生成AIにおける「ナレッジカットオフ」の問題を解決するために用いられる、RAG（検索拡張生成）の基本的な動作原理はどれか。',
        options: [
          'モデルのパラメータ数を無限に増やす。',
          '質問に対して、まず外部データベースから関連情報を「検索（Retrieve）」し、その情報を基に回答を「生成（Generate）」する。',
          '毎日すべてのデータを再学習（ファインチューニング）し続ける。',
          'インターネット接続を遮断して、内部知識のみで回答させる。',
        ],
        correctAnswer: '質問に対して、まず外部データベースから関連情報を「検索（Retrieve）」し、その情報を基に回答を「生成（Generate）」する。',
        explanation: '正解は選択肢2です。RAGは「検索（Retrieval）」と「生成（Generation）」を組み合わせることで、学習データに含まれない最新情報や社内情報に対応します。通常の生成AIは学習時点までの知識しか持たず、最新情報や社内文書などの外部データに直接アクセスできませんが、RAGはこの課題を解決します。選択肢1、3、4は誤りです。',
      },
      {
        question: 'RAGシステムを構築する際、検索精度を高めるために長い文書を意味のまとまりごとに分割する処理を何と呼ぶか。',
        options: [
          'チャンク分割（Chunking）',
          'スクレイピング',
          'プロンプトエンジニアリング',
          'バイアス除去',
        ],
        correctAnswer: 'チャンク分割（Chunking）',
        explanation: '正解は選択肢1です。文書を適切なサイズ（チャンク）に分割し、ベクトル化して保存することがRAGの精度向上に不可欠です。長い文書をそのまま扱うと検索精度が下がるため、意味のまとまりごとに分割することで、関連する情報を正確に検索できるようになります。選択肢2の「スクレイピング」はWebページからデータを抽出する技術、選択肢3の「プロンプトエンジニアリング」はプロンプトを最適化する技術、選択肢4の「バイアス除去」はデータの偏りを減らす処理です。',
      },
      {
        question: '文書や質問の意味的な類似性を計算するために、RAGシステムにおいてテキストデータを数値の列に変換する処理を何と呼ぶか。',
        options: [
          '暗号化',
          '圧縮',
          'ベクトル化（エンベッディング）',
          '翻訳',
        ],
        correctAnswer: 'ベクトル化（エンベッディング）',
        explanation: '正解は選択肢3です。コンピュータが意味の近さを計算できるように、テキストを多次元の数値ベクトルに変換することをエンベッディングと呼びます。これにより、意味的に似た文書や質問を検索できるようになります。選択肢1の「暗号化」は情報を秘匿する処理、選択肢2の「圧縮」はデータサイズを減らす処理、選択肢4の「翻訳」は言語を変換する処理です。',
      },
      {
        question: '従来のファインチューニング（追加学習）と比較した際の、RAGのメリットとして誤っているものはどれか。',
        options: [
          'データの更新が容易である（データベースに追加するだけでよい）。',
          '回答の根拠（出典）を明示しやすい。',
          'ハルシネーション（もっともらしい嘘）を完全にゼロにできる。',
          '再学習にかかる膨大なコストや時間を削減できる。',
        ],
        correctAnswer: 'ハルシネーション（もっともらしい嘘）を完全にゼロにできる。',
        explanation: '正解は選択肢3です。RAGはハルシネーションを「低減」しますが、「完全にゼロ」にすることはできません。他の選択肢はRAGの明確なメリットです。選択肢1は、RAGではデータベースに情報を追加するだけで知識を更新できるため、再学習が不要です。選択肢2は、RAGでは検索した情報を根拠として提示できるため、回答の信頼性が高まります。選択肢4は、再学習にかかるコストや時間を削減できる点がRAGの大きなメリットです。',
      },
      {
        question: '企業内でRAGを活用するユースケースとして、最も適切なものはどれか。',
        options: [
          '社内マニュアルや過去のトラブル事例を検索対象とし、新人オペレーターの質問に即座に回答させる。',
          '一般的な雑談相手として利用する。',
          '競合他社の機密情報を違法に収集させる。',
          '社内のPCのパスワードを強制的に解除させる。',
        ],
        correctAnswer: '社内マニュアルや過去のトラブル事例を検索対象とし、新人オペレーターの質問に即座に回答させる。',
        explanation: '正解は選択肢1です。企業固有の知識（社内規定、マニュアル、過去事例）に基づいた回答生成は、RAGの最も代表的な活用例です。社内ナレッジ検索、FAQ自動応答、法務・医療文書検索、カスタマーサポート支援など、業務システムとの親和性が非常に高い技術です。選択肢2は一般的な用途でRAGの特徴を活かせません。選択肢3、4は違法または不適切な用途です。',
      },
      {
        question: '2020年にRAGの概念を提唱した論文を発表した組織はどこか。',
        options: [
          'OpenAI',
          'Google DeepMind',
          'Facebook AI Research (現Meta AI)',
          'Apple',
        ],
        correctAnswer: 'Facebook AI Research (現Meta AI)',
        explanation: '正解は選択肢3です。2020年にFacebook AI ResearchのPatrick LewisらのチームがRAGの概念を正式に提案しました。RAGは第4版テキストの最重要項目の一つであり、生成AIの弱点である情報の古さや誤情報（ハルシネーション）を補うために開発された技術です。選択肢1、2、4は誤りです。',
      },
    ],
    textContent: `RAG（検索拡張生成）は、生成AIが答えを作る前に、外部のデータベースや文書を調べて、その情報をもとに文章を生成する技術です。

通常の生成AIは、学習した時点までの知識しか持っていません。そのため、最新の情報や会社の中の文書など、学習していないデータには直接アクセスできません。また、間違った情報を正しいかのように作ってしまうハルシネーションという問題もあります。RAGは、こうした問題を解決するために作られました。

RAGの仕組みは、まずユーザーの質問を小さな単位（チャンク）に分けます。長い文書を意味のまとまりごとに分割する処理をチャンク分割（Chunking）と呼び、これにより検索精度が向上します。次に、テキストを多次元の数値ベクトルに変換する処理（ベクトル化・エンベッディング）を行い、ベクトルデータベースを使って関連する情報を素早く探します。見つけた情報をプロンプトに入れて、その情報を基にAIが答えを作ります。2020年にFacebook AI Research（現Meta AI）のPatrick LewisらのチームがRAGの概念を正式に提案しました。従来のファインチューニング（追加学習）と比較すると、RAGはデータの更新が容易、回答の根拠を明示しやすい、再学習にかかるコストや時間を削減できるといったメリットがあります。

RAGを使うことで、最新の情報や会社の資料を反映できます。また、答えの根拠を示すことができるため、より信頼できる回答ができます。さらに、ハルシネーションが起きる確率を大きく下げることができます。

RAGは、会社の中の知識を検索する、よくある質問への自動応答、法律や医療の文書を検索する、お客様サポートを支援するなど、業務で使うシステムとの相性が良い技術です。`,
  },
  {
    id: 'unit04-ai-agent',
    title: 'AIエージェント',
    unitPoint: '生成AIが単に回答を返す存在から、自ら考え、判断し、行動する存在へと進化した「AIエージェント」の概念と仕組みを理解し、従来の生成AIとの違いを整理します。',
    learningTips: `「生成AI＝答える」「AIエージェント＝行動する」という役割の違いをまず押さえましょう

目的・計画・実行・評価という一連の流れで捉えると理解しやすくなります`,
    cardDisplay: {
      slideImage: '/images/ch3_unit04_ai_agent.png',
      keyPoints: [
        '定義：自律的に計画を立て、ツールを使ってタスクを完遂',
        'タイプ：ワークフロー型（決まった手順）と自律型（目標だけ指示）',
        'MCP：AIと外部ツールを繋ぐ標準規格',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'AIエージェントとは何か',
        explanation: 'AIエージェントとは、与えられた目標を達成するために、自律的に考え、行動し、結果を評価しながらタスクを遂行するAIです。単発の質問に答える生成AIとは異なり、複数の工程を連続的に処理できる点が特徴です。',
      },
      {
        category: '生成AIとの違い',
        explanation: '生成AIは主に「入力に対して出力を返す」役割を担います。一方AIエージェントは、状況を理解し、次に何をすべきかを判断し、必要に応じてツールを使い分けながら行動します。要するに、受動的なAIから能動的なAIへの進化です。',
      },
      {
        category: 'AIエージェントの基本構造',
        explanation: '目標設定として「何を達成するか」を定義します。次に計画立案として、達成までの手順を考えます。実行段階では、外部ツールやAPI、Web操作などを用いて行動します。最後に結果を評価し、必要であれば計画を修正して再実行します。',
      },
      {
        category: '外部ツールとの連携',
        explanation: 'AIエージェントは、検索エンジン、データベース、ブラウザ操作、業務システムなどと連携します。これにより、情報取得から処理、実行までを一貫して自動化できます。',
      },
      {
        category: '代表的なAIエージェントの例',
        explanation: 'ブラウザ操作を代行するエージェントは、予約、購入、フォーム入力などを自律的に行います。開発者向けエージェントは、コード生成からテスト、修正、デプロイ補助まで対応します。業務支援エージェントは、社内業務の自動化や意思決定支援に活用されています。',
      },
      {
        category: 'AIエージェント活用時の注意点',
        explanation: '誤った判断や暴走を防ぐため、人間による監督と制御が不可欠です。権限管理、ログ取得、実行範囲の制限などを設計段階で考慮する必要があります。',
      },
    ],
    quizQuestions: [
      {
        question: '第4版テキストにおける「AIエージェント」の定義として、従来のチャットボットと決定的に異なる特徴はどれか。',
        options: [
          '音声で会話ができる点。',
          '感情を持っている点。',
          '目標を与えられると、自律的に「計画→行動→評価」のループを回し、ツールを使用してタスクを完遂しようとする点。',
          '常にインターネットから切断されている点。',
        ],
        correctAnswer: '目標を与えられると、自律的に「計画→行動→評価」のループを回し、ツールを使用してタスクを完遂しようとする点。',
        explanation: '正解は選択肢3です。単なる応答（Chat）ではなく、自律的に計画し行動（Action）する点がエージェントの本質です。AIエージェントは、与えられた目標を達成するために、自分で考え、行動し、結果を見て評価しながら作業を進めるAIシステムです。チャットボットが「会話」が主なのに対し、エージェントは目標達成のために自律的に「行動（ツール実行、ブラウザ操作など）」する点が特徴です。選択肢1、2、4は誤りです。',
      },
      {
        question: 'Anthropic社が提唱している、AIモデルと外部ツール（データベースやAPI）を接続するためのオープンな標準規格であり、「AI版のUSB」とも例えられる技術は何か。',
        options: [
          'API Gateway',
          'MCP (Model Context Protocol)',
          'SQL',
          'RESTful API',
        ],
        correctAnswer: 'MCP (Model Context Protocol)',
        explanation: '正解は選択肢2です。MCPは、LLMと外部ツールを安全かつ標準的に接続するためのプロトコルで、個別のコネクタ開発を不要にする「AI版USB」です。これにより、AIエージェントが様々な外部ツールと連携しやすくなります。選択肢1の「API Gateway」はAPIの管理システム、選択肢3の「SQL」はデータベース言語、選択肢4の「RESTful API」はWeb APIの設計方式です。',
      },
      {
        question: '2025年にOpenAIが公開したAIエージェント「Operator」の主な機能として正しいものはどれか。',
        options: [
          '動画を生成する。',
          '音楽を作曲する。',
          '独自の仮想ブラウザを起動し、予約・購入・フォーム入力などのWeb操作を自律的に代行する。',
          'スマートフォンのロックを解除する。',
        ],
        correctAnswer: '独自の仮想ブラウザを起動し、予約・購入・フォーム入力などのWeb操作を自律的に代行する。',
        explanation: '正解は選択肢3です。Operatorはブラウザ操作に特化したエージェントで、人間が行うWeb上のタスク（予約や購入など）を代行します。画面を画像として認識し、クリックや入力を自律的に行います。選択肢1、2、4は誤りです。',
      },
      {
        question: 'AIエージェントの実装アプローチのうち、「ワークフロー型」の説明として適切なものはどれか。',
        options: [
          '最終目標だけを与えれば、AIが勝手に手順を考えて実行する。',
          'あらかじめ定義された業務フロー（手順や分岐）に従って、LLMがタスクを実行する。RPAに近い考え方。',
          '完全にランダムに行動する。',
          '常に人間が操作する必要がある。',
        ],
        correctAnswer: 'あらかじめ定義された業務フロー（手順や分岐）に従って、LLMがタスクを実行する。RPAに近い考え方。',
        explanation: '正解は選択肢2です。エージェントには「ワークフロー型（手順固定）」と「自律型（目標のみ指定）」があり、前者は定型業務の自動化に向いています。ワークフロー型は、決まった手順に従ってタスクを実行するため、RPA（Robotic Process Automation）に近い考え方です。選択肢1は自律型の説明、選択肢3、4は誤りです。',
      },
      {
        question: 'シンガポール発のAIエージェント「Manus」の特徴として紹介されている機能はどれか。',
        options: [
          '多数の履歴書を分析し、評価結果をExcelにまとめるなどの複雑な事務処理を、人手を介さず全自動で遂行する。',
          'ゲームをプレイする。',
          '天気予報のみを行う。',
          '画像生成のみを行う。',
        ],
        correctAnswer: '多数の履歴書を分析し、評価結果をExcelにまとめるなどの複雑な事務処理を、人手を介さず全自動で遂行する。',
        explanation: '正解は選択肢1です。Manusは汎用エージェントとして、複雑なオンライン業務や事務処理の全自動化が可能とされています。AIエージェントは、単発の質問に答える生成AIとは異なり、複数の工程を連続的に処理できる点が特徴です。選択肢2、3、4は誤りです。',
      },
      {
        question: 'AIエージェントが外部ツールを実行したり情報を取得したりするために必要な、拡張LLMの3つの機能要素は「検索(Retrieval)」「メモリ(Memory)」ともう一つは何か。',
        options: [
          'ツール呼び出し（Tool Use）',
          '画像認識',
          '音声合成',
          '感情分析',
        ],
        correctAnswer: 'ツール呼び出し（Tool Use）',
        explanation: '正解は選択肢1です。エージェントが行動するためには、外部の機能を実行するための「ツール呼び出し（Tool Use）」機能が不可欠です。AIエージェントは、検索エンジン、データベース、ブラウザ操作、業務システムなどと連携し、情報取得から処理、実行までを一貫して自動化できます。選択肢2、3、4は誤りです。',
      },
    ],
    textContent: `AIエージェントは、与えられた目標を達成するために、自分で考え、行動し、結果を見て評価しながら作業を進めるAIシステムです。一つの質問に答えるだけの生成AIとは違い、複数の作業を順番に進められるのが特徴です。

生成AIは主に、何かを聞かれたら答えるという役割です。一方、AIエージェントは、状況を理解して、次に何をすべきか判断し、必要に応じて様々なツールを使いながら行動します。従来のチャットボットが「会話」が主な機能だったのに対し、エージェントは目標を達成するために自分で「行動」するのが特徴です。例えば、ブラウザを操作したり、ツールを実行したりします。

AIエージェントは、目標を決める、計画を立てる、実行する、結果を評価する、という流れで動きます。まず「何を達成するか」を決め、そのために必要な手順を考えます。実行する時は、外部のツールやAPI、Web操作などを使います。最後に結果を見て、必要なら計画を修正して、もう一度実行します。

AIエージェントは、検索エンジン、データベース、ブラウザ操作、業務システムなどとつなげて使うことができます。これにより、情報を集めて、処理して、実行するまでの一連の流れを自動化できます。

代表的な例として、ブラウザ操作を代わりに行うエージェントは、予約、購入、フォーム入力などを自分で行います。2025年にOpenAIが公開したOperatorは、独自の仮想ブラウザを起動し、Web操作を自律的に代行するエージェントです。開発者向けのエージェントは、コードを作る、テストする、修正する、デプロイを支援するなど、開発の作業に対応します。シンガポール発のAIエージェントManusは、多数の履歴書を分析し、評価結果をExcelにまとめるなどの複雑な事務処理を、人手を介さず全自動で遂行します。業務を支援するエージェントは、会社の業務を自動化したり、意思決定を支援したりします。Anthropic社が提唱しているMCP（Model Context Protocol）は、AIモデルと外部ツール（データベースやAPI）を接続するためのオープンな標準規格で、「AI版USB」とも例えられます。AIエージェントが外部ツールを実行したり情報を取得したりするためには、「検索(Retrieval)」「メモリ(Memory)」「ツール呼び出し（Tool Use）」の3つの機能要素が必要です。

AIエージェントを使う時は、間違った判断をしたり、暴走したりしないよう、人間が監督し、コントロールすることが不可欠です。誰が使えるか、何ができるかの管理、実行記録を残すこと、実行できる範囲を制限することなど、設計の段階から考える必要があります。`,
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

export default function Chapter3Page() {
  const course = courses.find(c => c.id === courseId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // 全ユニットの問題を集約してランダムにシャッフル
  const getAllUnitQuestions = () => {
    const allQuestions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }> = [];
    newChapter3Sections.forEach((section) => {
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
    const section = newChapter3Sections.find(s => s.id === sectionId);
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
        {/* ヘッダー */}
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

        {/* タブ切り替え */}
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
            {newChapter3Sections.map((section) => (
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
          /* 問題演習 */
          <div className="bg-white rounded-lg shadow-sm p-8 border">
            {!quizCompleted ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">問題演習</h2>
                  <div className="text-sm text-gray-600">
                    問題 {currentQuestionIndex + 1} / {questions.length}
                  </div>
                </div>

                {/* 進捗バー */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* 問題表示 */}
                <div className="mb-8">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      問題 {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700">{questions[currentQuestionIndex]?.question}</p>
                  </div>

                  {/* 選択肢 */}
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

                {/* ナビゲーションボタン */}
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
              /* 結果表示 */
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

                {/* 問題別結果 */}
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