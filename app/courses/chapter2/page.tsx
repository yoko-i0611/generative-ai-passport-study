'use client';

import { useState } from 'react';
import { courses } from '../../../data/courses';
import { ChevronLeft, Clock, BookOpen, CheckCircle, Brain, Circle } from 'lucide-react';
import Link from 'next/link';
import HybridContentCard from '../../components/HybridContentCard';
import ChatButton from '../../components/ChatButton';
import UnitQuizModal from '../../components/UnitQuizModal';

const courseId = 'chapter2';

// 新しい構造のテストデータ（YAMLファイルから将来的に読み込む）
const newChapter2Sections = [
  {
    id: 'unit01-generative-model-evolution',
    title: '生成モデルの誕生と進化',
    unitPoint: '現在の生成AIは、確率モデル・自己回帰モデル・画像生成モデル・言語モデルなどの技術を段階的に発展させて完成したものであり、その進化の流れと各技術の役割を理解することが目的です。',
    learningTips: `「識別の革命」と「生成の革命」の対比を理解する

RNN → LSTM → Transformer の「課題と解決」の流れを理解する

Transformerの三点セット（Self-Attention／並列処理／位置エンコーディング）を理解する`,
    cardDisplay: {
      slideImage: '/images/ch2_unit01_model_evolution.png',
      keyPoints: [
        'インプットからアウトプットの革命へ：識別（認識）から生成へ',
        'CNN：画像の局所的な特徴から全体を認識',
        'VAE：データを圧縮・再構築して生成',
        'GAN：生成器と識別器が競い合って高品質データを生成',
        'Transformer：Self-Attentionと並列処理で文脈を一括計算',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '生成AIの二つの革命：識別から生成へ',
        explanation: '2012〜2013年のディープラーニングの発展は、画像認識などの識別（インプット）の革命でした。一方、現在の生成AIの台頭は、新しいデータを生み出す生成（アウトプット）の革命と呼ばれます。この識別と生成の対比は、AIの進化を理解する上で重要な概念です。',
      },
      {
        category: '確率モデルの原点：ボルツマンマシンとRBM',
        explanation: 'ボルツマンマシンはデータの構造を確率的に学習する初期の生成モデルですが、計算量が膨大で実用が困難でした。これに制約を加えて学習を効率化したものが制約付きボルツマンマシン（RBM）です。',
      },
      {
        category: '自己回帰モデルの考え方',
        explanation: '自己回帰モデルは、過去のデータから次の値を予測するモデルで、現在の生成AIもこの「次を生成する」という考え方を基盤としています。「自己回帰＝ノイズ除去」という表現は誤りなので注意が必要です。',
      },
      {
        category: '画像生成を支えた主要モデル：CNN・VAE・GAN',
        explanation: 'CNNは画像の局所的特徴から全体構造を理解するモデルで、2012年の画像認識コンペティションで第3次AIブームの火付け役となりました。VAEはデータを潜在変数（ベクトル）に圧縮し、そこから復元することで新しいデータを生成するモデルです。GANは生成器と識別器が競い合いながら高品質なデータを生成する仕組みです。',
      },
      {
        category: '言語モデルの限界とTransformerの誕生',
        explanation: 'RNNやLSTMは長文処理や学習の並列化に限界がありました。2017年に登場したTransformerは、Self-Attentionによる重要度計算、並列処理、位置エンコーディングによりこれらの問題を解決し、現在の大規模言語モデルの基盤となっています。',
      },
      {
        category: 'BERT：双方向の文脈理解',
        explanation: 'BERT（Bidirectional Encoder Representations from Transformers）は、Transformerのエンコーダ部分を使用した自然言語処理モデルです。文章の前後（双方向）から文脈を理解し、マスクされた単語を予測する「Masked Language Model（MLM）」という手法で学習します。これにより、深い言語理解を実現しました。',
      },
    ],
    quizQuestions: [
      {
        question: '2012〜2013年のディープラーニングのブレークスルーは、画像認識などの「識別（インプット）」の革命でした。一方、現在の生成AIの台頭は、新たなデータを創り出す「生成（アウトプット）の革命」と言えます。この説明は正しいですか？',
        options: ['正しい', '誤り'],
        correctAnswer: '正しい',
        explanation: '2012〜2013年のディープラーニングのブレークスルーは画像認識などの「識別（インプット）」の革命でした。一方、現在の生成AIの台頭は、新しいデータを生み出す「生成（アウトプット）の革命」です。この対比はAIの進化を理解する上で重要な概念であり、表現は正確です。',
      },
      {
        question: 'AI研究の歴史において、2012年の画像認識コンペティションで圧倒的な精度を記録し、第3次AIブームの火付け役となった技術はどれか。',
        options: [
          'RNN（回帰型ニューラルネットワーク）',
          'CNN（畳み込みニューラルネットワーク）',
          'GAN（敵対的生成ネットワーク）',
          'Transformer',
        ],
        correctAnswer: 'CNN（畳み込みニューラルネットワーク）',
        explanation: '正解はCNNです。2012年のImageNetコンペティションでヒントン教授のチームがCNNを用いて圧勝し、ディープラーニングの有効性が世界に示されました。これが第3次AIブームの火付け役となりました。CNNは画像の局所的な特徴（畳み込み）を捉えるのに適しており、画像認識の革命を起こしました。RNNは時系列データ処理、GANは画像生成、Transformerは2017年登場でCNNより後に開発された技術です。',
      },
      {
        question: 'GAN（敵対的生成ネットワーク）の構成要素である「Generator（生成器）」と「Discriminator（識別器）」の関係として適切なものはどれか。',
        options: [
          '互いに協力して正解率を高める',
          '識別器が生成器に指示を出して画像を修正させる',
          '互いに競い合い（敵対し）、生成器は識別器を騙そうとし、識別器は真偽を見抜こうとする',
          '生成器が画像を生成した後、識別器が色付けを行う',
        ],
        correctAnswer: '互いに競い合い（敵対し）、生成器は識別器を騙そうとし、識別器は真偽を見抜こうとする',
        explanation: '正解は「互いに競い合う」関係です。GANでは、生成器（Generator）は識別器を騙そうと高品質なデータを生成し、識別器（Discriminator）はそのデータが本物か偽物かを見抜こうとします。この敵対的な競争により、生成データの品質が向上します。選択肢1の「協力して」は誤りです。選択肢2の「識別器が指示を出す」や選択肢4の「識別器が色付けを行う」もGANの仕組みとは異なります。',
      },
      {
        question: '2017年に登場し、現在のLLM（大規模言語モデル）の全ての基礎となっている「Transformer」モデルの最大の特徴はどれか。',
        options: [
          '畳み込み演算による画像特徴の抽出',
          '逐次処理による時系列データの学習',
          'Self-Attention（自己注意機構）による並列処理と長距離依存の学習',
          '敵対的学習によるデータ生成',
        ],
        correctAnswer: 'Self-Attention（自己注意機構）による並列処理と長距離依存の学習',
        explanation: '正解は「Self-Attention（自己注意機構）による並列処理と長距離依存の学習」です。Transformerの最大の特徴は、Self-Attentionにより文中の離れた単語同士の関係性を一括（並列）で計算できることです。これにより学習速度と性能が劇的に向上し、現在のLLMの全ての基礎となりました。選択肢1の「畳み込み演算」はCNNの特徴、選択肢2の「逐次処理」はRNN/LSTMの特徴、選択肢4の「敵対的学習」はGANの特徴です。',
      },
      {
        question: '自然言語処理モデル「BERT」の特徴として適切なものはどれか。',
        options: [
          '文章の生成に特化したモデルである',
          '文脈を「双方向」から理解し、マスクされた単語を予測する（MLM）',
          '画像とテキストを同時に処理するマルチモーダルモデルである',
          '時系列データを順に処理するRNNの一種である',
        ],
        correctAnswer: '文脈を「双方向」から理解し、マスクされた単語を予測する（MLM）',
        explanation: '正解は「文脈を双方向から理解し、マスクされた単語を予測する（MLM）」です。BERTはTransformerのエンコーダ部分を使用し、文章の前後（双方向）から文脈を読んで、マスクされた単語を予測する「Masked Language Model（MLM）」という手法で学習します。これにより深い言語理解を実現しました。選択肢1の「文章の生成に特化」は誤りで、BERTは理解に特化したモデルです。選択肢3の「マルチモーダル」や選択肢4の「RNNの一種」もBERTの特徴ではありません。',
      },
      {
        question: 'VAE（変分自己符号化器）の仕組みとして正しいものはどれか。',
        options: [
          'データを「潜在変数（ベクトル）」に圧縮し、そこから元のデータを復元・生成する',
          'テキストから画像を生成する専用モデルである',
          '生成器と識別器を競わせて画像を生成する',
          'ノイズから徐々に画像を浮かび上がらせる',
        ],
        correctAnswer: 'データを「潜在変数（ベクトル）」に圧縮し、そこから元のデータを復元・生成する',
        explanation: '正解は「データを潜在変数（ベクトル）に圧縮し、そこから元のデータを復元・生成する」です。VAEはデータを「潜在変数（ベクトル）」と呼ばれる低次元の表現に圧縮（エンコード）し、そこから元のデータを復元・再構築（デコード）する過程で新しいデータを生成します。選択肢2の「テキストから画像生成専用」は誤りで、VAEは様々なデータタイプに適用可能です。選択肢3の「生成器と識別器を競わせる」はGANの特徴、選択肢4の「ノイズから画像を浮かび上がらせる」は拡散モデルの特徴です。',
      },
      {
        question: 'Transformerの主要な特徴として正しいものはどれですか？',
        options: [
          'Self-Attentionと並列処理により、文脈を一括計算できる',
          '逐次処理により、長文の文脈を忘れない',
          'CNNベースの画像認識に特化している',
        ],
        correctAnswer: 'Self-Attentionと並列処理により、文脈を一括計算できる',
        explanation: '正解は「Self-Attentionと並列処理により、文脈を一括計算できる」です。TransformerはSelf-Attentionにより文中の単語同士の関係性を一括で計算し、並列処理により学習速度が飛躍的に向上しました。これにより長文の文脈も一度に計算できるようになり、RNN/LSTMの限界を解決しました。選択肢2の「逐次処理により長文の文脈を忘れない」は誤りで、これはRNN/LSTMの特徴ではなく、むしろ逐次処理が長文の文脈を忘れてしまうという課題がありました。選択肢3の「CNNベースの画像認識」はTransformerの特徴ではありません。',
      },
    ],
    textContent: `1. インプットからアウトプットの革命へ

2012〜2013年のディープラーニングのブレークスルーは、画像認識などの「識別（インプット）」の革命でした。対して、現在の生成AIの台頭は、新たなデータを創り出す「生成（アウトプット）の革命」と言えます。

2. 生成モデルの基礎技術

生成AIに至るまでには、いくつかの重要な技術的マイルストーンがあります。

CNN（畳み込みニューラルネットワーク）
画像の「局所的な特徴（線や色）」から全体を認識する技術。2012年の画像認識コンペティション（ImageNet）でヒントン教授のチームがCNNを用いて圧倒的な精度を記録し、第3次AIブームの火付け役となりました。画像生成の基礎ともなりました。

VAE（変分自己符号化器）
データを「潜在変数（ベクトル）」と呼ばれる低次元の表現に圧縮（エンコード）し、そこから元のデータを復元・再構築（デコード）する過程で新しいデータを生成します。

GAN（敵対的生成ネットワーク）
「偽札を作る犯人（生成器）」と「警察（識別器）」が競い合うように学習し、非常に高品質なデータを生成します。

3. 自然言語処理の転換点：Transformer

かつて主流だったRNN（回帰型ニューラルネットワーク）やLSTMは、文章を「先頭から順番に」処理していたため、長文になると文脈を忘れてしまう弱点がありました。

2017年に登場したTransformerは、この課題を解決しました。

• Self-Attention（自己注意機構）：文中の単語同士の関係性（重要度）を一括で計算します。
• 並列処理：逐次処理ではなく一度に計算するため、学習速度が飛躍的に向上しました。

これが、現在の大規模言語モデル（LLM）のすべての基盤となっています。

4. BERT：双方向の文脈理解

BERT（Bidirectional Encoder Representations from Transformers）は、Transformerのエンコーダ部分を使用した自然言語処理モデルです。文章の前後（双方向）から文脈を理解し、マスクされた単語を予測する「Masked Language Model（MLM）」という手法で学習します。これにより、深い言語理解が実現しました。`,
  },
  {
    id: 'unit02-paradigm-shift',
    title: '画像生成技術のパラダイムシフト',
    unitPoint: '画像生成AIは、従来主流だった拡散モデルから、2025年以降の最新モデルで採用が進む自己回帰型モデルへと大きく進化しています。本ユニットでは、両方式の仕組み・特徴・限界と、なぜ技術転換が起きたのかを理解することが目的です。',
    learningTips: `拡散モデル＝ノイズ除去方式であることを理解する

自己回帰型＝左上から右下へ順次描画であることを理解する

「なぜ自己回帰型に移行したか？」の理由は「画像内の文字生成・細部制御の精度向上」であることを理解する`,
    cardDisplay: {
      slideImage: '/images/ch2_unit02_diffusion_vs_autoregressive.png',
      keyPoints: [
        '従来技術：拡散モデル（Diffusion Model）- ノイズ除去方式',
        '最新技術：自己回帰型（Autoregressive）- 左上から順次描画',
        'メリット：画像内の文字生成が可能に',
        '重要な理解：拡散モデルと自己回帰型の仕組みの違いを明確に区別できることが重要',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '従来技術：拡散モデル（Diffusion Model）',
        explanation: '拡散モデルは、ノイズだらけの画像から少しずつノイズを除去し、元の画像を復元する方式で画像を生成します。Stable Diffusionなど従来の画像生成AIの中核技術です。高品質な画像生成が可能ですが、文字・細い線・レイアウトなどの細部制御が苦手という課題がありました。',
      },
      {
        category: '最新技術：自己回帰型画像生成（Autoregressive）',
        explanation: '自己回帰型は、画像をトークン（断片）として扱い、テキスト生成と同じように左上から右下へ順番に描画していく方式です。この方式により、画像内の文字、ロゴ、細かい線、レイアウトの精度が劇的に向上しました。',
      },
      {
        category: 'なぜ技術転換が起きたのか',
        explanation: '拡散モデルでは、画像内の文字生成や細部の位置制御が不安定でした。この課題を解決するため、文字や細部を正確に制御できる自己回帰型へと技術が転換されました。',
      },
    ],
    quizQuestions: [
      {
        question: '画像生成AIにおいて、2025年以降の最新モデル（GPT-4o統合機能など）で採用が進んでいる「自己回帰型（Autoregressive）」の説明として適切なものはどれか。',
        options: [
          'ノイズを徐々に除去することで画像を浮かび上がらせる',
          '画像をトークンとして扱い、左上から右下へ一つずつ描画していく',
          '生成器と識別器を競わせて画像を生成する',
          '画像を潜在ベクトルに圧縮してから復元する',
        ],
        correctAnswer: '画像をトークンとして扱い、左上から右下へ一つずつ描画していく',
        explanation: '正解は「画像をトークンとして扱い、左上から右下へ一つずつ描画していく」です。自己回帰型は、画像をトークン（断片）として扱い、テキスト生成と同じように左上から右下へ順番に描画していく方式です。これにより、画像内の文字、ロゴ、細かい線、レイアウトの精度が劇的に向上しました。選択肢1の「ノイズ除去」は拡散モデルの特徴、選択肢3の「生成器と識別器を競わせる」はGANの特徴、選択肢4の「潜在ベクトルに圧縮」はVAEの特徴です。',
      },
      {
        question: '従来の画像生成AI（Stable Diffusionなど）で主流だった「拡散モデル（Diffusion Model）」の仕組みとして正しいものはどれか。',
        options: [
          'ノイズ（砂嵐）から徐々にノイズを除去して画像を生成する',
          '2つのネットワークを競わせて画像を生成する',
          '過去のデータから未来の値を予測する',
          '画像の左上から順にピクセルを埋めていく',
        ],
        correctAnswer: 'ノイズ（砂嵐）から徐々にノイズを除去して画像を生成する',
        explanation: '正解は「ノイズ（砂嵐）から徐々にノイズを除去して画像を生成する」です。拡散モデルは、ノイズだらけの画像から少しずつノイズを除去し、元の画像を復元する方式で画像を生成します。Stable Diffusionなど従来の画像生成AIで主流だった技術です。選択肢2の「2つのネットワークを競わせる」はGANの特徴、選択肢3の「過去のデータから未来の値を予測する」は自己回帰モデルの一般的な説明、選択肢4の「左上から順にピクセルを埋める」は自己回帰型画像生成の特徴です。',
      },
      {
        question: 'GPT-4oやo3モデルに統合された最新の画像生成機能が採用している技術方式と、それによる主な改善点として適切な組み合わせはどれか。',
        options: [
          '拡散モデル（Diffusion） － ノイズ除去プロセスの高速化',
          '自己回帰型（Autoregressive） － 画像内の文字生成能力の向上',
          'GAN（敵対的生成ネットワーク） － 画像の解像度の向上',
          'VAE（変分自己符号化器） － 生成速度の安定化',
        ],
        correctAnswer: '自己回帰型（Autoregressive） － 画像内の文字生成能力の向上',
        explanation: '正解は「自己回帰型（Autoregressive） － 画像内の文字生成能力の向上」です。GPT-4oやo3モデルなどの最新モデルでは、従来のDALL-E 3などで採用されていた「拡散モデル」ではなく「自己回帰型」を採用しています。画像をトークンとして扱い、左上から右下へ順次描画することで、看板の文字などを正確に描写できるようになりました。選択肢1の「拡散モデル」は従来技術で、ノイズ除去プロセスの高速化が主な改善点ではありませんでした。選択肢3の「GAN」や選択肢4の「VAE」は最新モデルで採用されている技術ではありません。',
      },
      {
        question: '自己回帰型画像生成が拡散モデルよりも優れている点として正しいものはどれか。',
        options: [
          '処理速度が速い',
          '画像内の文字生成や細部の位置制御の精度が高い',
          'ノイズが少ない',
        ],
        correctAnswer: '画像内の文字生成や細部の位置制御の精度が高い',
        explanation: '正解は「画像内の文字生成や細部の位置制御の精度が高い」です。自己回帰型は、画像をトークンとして扱い、左上から右下へ順次描画する方式により、画像内の文字、ロゴ、細かい線、レイアウトの精度が劇的に向上しました。これが拡散モデルから自己回帰型への技術転換の主な理由です。選択肢1の「処理速度が速い」は誤りで、自己回帰型は拡散モデルより処理が遅い場合もあります。選択肢3の「ノイズが少ない」は画像生成方式の違いとは直接関係ありません。',
      },
    ],
    textContent: `1. 従来技術：拡散モデル（Diffusion Model）

Stable Diffusionや初期のDALL-Eで採用されていた方式です。ノイズ（砂嵐のような画像）から、徐々にノイズを除去していくことで、鮮明な画像を浮かび上がらせます。高品質ですが、「画像の中に文字を書く」といった細かい制御は苦手でした。

2. 最新技術：自己回帰型（Autoregressive）

GPT-4oに統合された画像生成機能や、最新のo3/o4モデルでは、「自己回帰型」が採用されています。

• 仕組み：テキスト生成と同じように、画像をトークン（断片）として扱い、画像の左上から右下へ、一つずつ描画していきます。
• メリット：これにより、看板の文字や細かい線の描写が劇的に正確になりました。

⚠️ 重要な理解のポイント

• 「拡散モデル」と「自己回帰型」の仕組みの違い（ノイズ除去 vs 順次描画）を明確に区別できることが重要です。
• 「なぜ自己回帰型になったか？」の理由は「画像内の文字生成が可能になったから」であることを理解しましょう。`,
  },
  {
    id: 'unit03-openai-omni-series',
    title: 'OpenAIモデルの系譜①（Omni系列）',
    unitPoint: 'Omni系列（代表：GPT-4o）は、テキスト・画像・音声を1つのモデルで統合処理し、「速さ（低レイテンシ）」「リアルタイム体験」に強いモデル群です。"o＝Omni"の意味と、Reasoning系列（o1/o3/o4）との違いを理解することが重要です。',
    learningTips: `4o（Omni）＝体験/即応、o1/o3/o4（Reasoning）＝熟考/推論の対比を理解する

音声応答 最短232ms／平均320msは、Omni系列の特徴を理解する上で重要な具体値です

「マルチモーダル」と「オムニモーダル（4o）」の言葉の意味の違いを理解する`,
    cardDisplay: {
      slideImage: '/images/ch2_unit03_openai_omni_series.png',
      keyPoints: [
        '「o」はOmni（全て）の意',
        'ネイティブ・マルチモーダル：テキスト・音声・画像を単一モデルで処理',
        '低レイテンシ（高速応答）',
        'リアルタイム体験に最適：通訳、カメラ越しの状況説明',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'Omniの意味："o"はOmni（全て）',
        explanation: '要するに、GPT-4oの「o」はomni（全て）の意味です。なぜなら、テキスト・画像・音声を組み合わせて統合的に処理できる性質を、名前で示しているからです。"マルチモーダル"と区別して"オムニモーダル"と呼ぶ点は、この統合処理を理解する上で重要な概念です。',
      },
      {
        category: '低レイテンシ：リアルタイム体験が目的',
        explanation: '要するに、Omni系列は「速い返答」で価値が出ます。なぜなら、音声入力への応答が最短232ms、平均320msと、人間の会話に近い速度を狙って設計されているからです。この数値は、Omni系列の特徴を理解する上で重要な具体例です。',
      },
      {
        category: '注意：GPT-4o と GPT-o4 は別物',
        explanation: '要するに、GPT-4o（オムニ）とGPT-o4（推論）は「名前が似ているだけで系列が違う」です。なぜなら、4oはマルチモーダル即応（体験重視）、o4は熟考推論（Reasoning）の系統だからです。この違いは、OpenAIモデルを理解する上で重要なポイントです。',
      },
      {
        category: '得意・不得意の整理',
        explanation: '得意：会話・通訳・画像を見て説明など、"その場で返す"タスク（低レイテンシが武器）。苦手な領域：難問の推論・熟考が必要な問題は、Reasoning系列（o1/o3/o4）が適しています（「答える前にじっくり考える」設計思想）。この使い分けは、モデル選択を理解する上で重要です。',
      },
    ],
    quizQuestions: [
      {
        question: 'OpenAIのモデル名称における「o」の意味と、そのモデル特性に関する説明として正しいものはどれか。',
        options: [
          '「GPT-4o」の「o」は「Optimal（最適）」を意味し、コストパフォーマンスを最優先している。',
          '「GPT-o1」の「o」は「Omni（全て）」を意味し、テキスト・音声・画像をリアルタイムに処理する。',
          '「GPT-4o」の「o」は「Omni（全て）」を意味し、マルチモーダルな処理を単一モデルで高速に行う。',
          '「GPT-o1」と「GPT-4o」は、発売時期が異なるだけで内部構造は同じである。',
        ],
        correctAnswer: '「GPT-4o」の「o」は「Omni（全て）」を意味し、マルチモーダルな処理を単一モデルで高速に行う。',
        explanation: '正解は「GPT-4oの『o』は『Omni（全て）』を意味し、マルチモーダルな処理を単一モデルで高速に行う」です。GPT-4oの「o」は「Omni（全て）」を意味し、テキスト・画像・音声を1つのモデルで統合処理する体験重視のマルチモーダルモデルです。選択肢1の「Optimal（最適）」は誤りで、コストパフォーマンスが主目的ではありません。選択肢2の「GPT-o1の『o』はOmni」は誤りで、GPT-o1はReasoning（推論）特化型です。選択肢4の「発売時期が異なるだけで構造は同じ」も誤りで、GPT-4oとGPT-o1は全く異なる系列のモデルです。',
      },
      {
        question: '「マルチモーダルAI」の定義として最も適切なものはどれか。',
        options: [
          '複数の言語を話せるAI',
          'テキスト、画像、音声、動画など、複数の種類のデータ形式を統合して処理できるAI',
          '複数のPCで同時に動作するAI',
          '複数のユーザーと同時に会話できるAI',
        ],
        correctAnswer: 'テキスト、画像、音声、動画など、複数の種類のデータ形式を統合して処理できるAI',
        explanation: '正解は「テキスト、画像、音声、動画など、複数の種類のデータ形式を統合して処理できるAI」です。マルチモーダル（Multimodal）は「複数のモード（様式）」を意味し、テキスト以外の情報（画像・音声・動画など）も扱えるAIを指します。選択肢1の「複数の言語を話せる」は多言語対応であり、マルチモーダルの定義ではありません。選択肢3の「複数のPCで同時に動作」や選択肢4の「複数のユーザーと同時に会話」は、マルチモーダルとは関係ない概念です。',
      },
      {
        question: 'GPT-4o（Omni系列）の音声応答の特徴として正しいものはどれか。',
        options: [
          '最短232ms、平均320msの低レイテンシ',
          '最短500ms、平均800msの応答速度',
          '最短1秒、平均2秒の応答速度',
        ],
        correctAnswer: '最短232ms、平均320msの低レイテンシ',
        explanation: '正解は「最短232ms、平均320msの低レイテンシ」です。GPT-4o（Omni系列）は人間の会話に近い速度を狙って設計されており、音声入力への応答が最短232ms、平均320msと非常に高速です。これによりリアルタイム体験が実現されています。選択肢2の「最短500ms、平均800ms」や選択肢3の「最短1秒、平均2秒」は、GPT-4oの実際の応答速度より遅く、正確ではありません。',
      },
    ],
    textContent: `1. 「o」はOmni（全て）の意

GPT-4oに代表される「Omni」系列は、テキスト・音声・画像を単一のモデルで処理する「ネイティブ・マルチモーダル」モデルです。

2. 特徴と得意領域

• 低レイテンシ（高速応答）：人間との会話のように、瞬時に反応します。
• リアルタイム体験：通訳機能や、カメラ越しの状況説明など、ライブ感が求められるタスクに最適です。
• 苦手なこと：複雑な論理パズルや、長時間の深い思考が必要な数学的課題では、後述するReasoningモデルに劣ります。`,
  },
  {
    id: 'unit04-openai-reasoning-series',
    title: 'OpenAIモデルの系譜②（Reasoning系列）',
    unitPoint: 'Reasoning系列（GPT-o1 / o3 / o4 / GPT-5 Thinking）は、「速さ」ではなく「正確さ・深い思考」を重視した推論特化型モデル群であり、回答前に内部でChain-of-Thought（思考の連鎖）を実行する点が最大の特徴です。Omni系列との役割分担と、数値スペックも押さえておきましょう。',
    learningTips: `「4o＝体験・即応」「o1/o3/o4＝熟考・推論」の対比を理解する

Chain-of-Thought＝Reasoningモデルの核心として必ず説明できるようにする

ハルシネーション80%減少 / 100万トークンなどの数値は、モデルの特徴を理解する上で重要な具体例`,
    cardDisplay: {
      slideImage: '/images/ch2_unit04_openai_reasoning_series.png',
      keyPoints: [
        '「思考の連鎖」を行う推論モデル',
        'GPT-5 Thinking：ハルシネーションが約80%減少',
        'GPT-4.1：最大100万トークン対応',
        'GPT-4o（オムニ）とGPT-o4（推論）は別モデル',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
        tokenLimit: '100万トークン',
        hallucinationReduction: '約80%減少',
      },
    },
    importantExplanations: [
      {
        category: 'Reasoningモデルとは何か：思考してから答えるAI',
        explanation: 'GPT-o1 / o3 / o4 / GPT-5 Thinking は、回答を出す前に内部で複数ステップの推論（Chain-of-Thought）を実行する「推論特化型」モデルです。従来の即応型モデルと違い、一度立ち止まって考えてから答える構造が、数学・論理・設計問題などで高精度を生み出します。「Chain-of-Thoughtを内部処理として持つモデル群」がReasoning系列、と整理しておきましょう。',
      },
      {
        category: '重要なスペック数値（2025–2026基準）',
        explanation: 'GPT-5 Thinking：ハルシネーション 約80%減少。GPT-4.1：最大100万トークン対応。これらの数値は、Reasoning系列の特徴を理解する上で重要な具体例です。',
      },
      {
        category: '名前の紛らわしさに注意：4o と o4',
        explanation: 'GPT-4o（オムニ）：速さ・マルチモーダル・体験重視。GPT-o4（推論）：熟考・高精度・論理特化。この2つを混同しないよう、それぞれの違いを理解することが重要です。「4o＝Omni」「o4＝Reasoning」とセットで理解してください。',
      },
      {
        category: 'なぜReasoningモデルが生まれたのか？',
        explanation: '要するに、即応モデルだけでは"難しい問題が解けない"限界に達したからです。複雑な論理・数学・設計・検証タスクには、高速応答よりも「途中思考の質」が必要になり、その要求に応えるためにReasoning系列が誕生しました。',
      },
    ],
    quizQuestions: [
      {
        question: '「GPT-5 Thinking」モデルの性能報告として、正しい記述を選びなさい。',
        options: [
          '従来のモデルと比較して、計算速度が10倍になった。',
          'o3モデルと比較して、ハルシネーション（幻覚）が約80%減少した。',
          '画像生成機能が削除され、テキスト処理に特化した。',
          '日本語の学習データが含まれなくなった。',
        ],
        correctAnswer: 'o3モデルと比較して、ハルシネーション（幻覚）が約80%減少した。',
        explanation: '正解は「o3モデルと比較して、ハルシネーション（幻覚）が約80%減少した」です。GPT-5 Thinkingは深い推論能力を持ち、o3モデルと比較してハルシネーションが約80%減少したと報告されています。この数値は試験の重要ポイントです。選択肢1の「計算速度が10倍になった」は性能報告として記述されていません。選択肢3の「画像生成機能が削除」や選択肢4の「日本語の学習データが含まれなくなった」も、GPT-5 Thinkingの性能報告には含まれていません。',
      },
      {
        question: 'プロンプトエンジニアリングにおける「Chain-of-Thought（思考の連鎖）」プロンプティングの効果は何か。',
        options: [
          'AIに「ステップバイステップで考えて」と指示することで、論理的推論の精度を向上させる',
          'AIに過去の会話を全て忘れさせる',
          'AIの応答速度を最大化する',
          '画像生成の画質を向上させる',
        ],
        correctAnswer: 'AIに「ステップバイステップで考えて」と指示することで、論理的推論の精度を向上させる',
        explanation: '正解は「AIに『ステップバイステップで考えて』と指示することで、論理的推論の精度を向上させる」です。Chain-of-Thoughtプロンプティングは、思考過程を出力させることで、複雑な計算や論理問題の正答率を高める手法です。Reasoningモデル（GPT-o1/o3/o4/GPT-5 Thinking）は、このChain-of-Thoughtを内部処理として持つモデル群です。選択肢2の「過去の会話を全て忘れさせる」、選択肢3の「応答速度を最大化」、選択肢4の「画像生成の画質を向上」は、Chain-of-Thoughtプロンプティングの効果ではありません。',
      },
      {
        question: 'GPT-4.1の最大トークン数として正しいものはどれか。',
        options: [
          '50万トークン',
          '100万トークン',
          '200万トークン',
        ],
        correctAnswer: '100万トークン',
        explanation: '正解は「100万トークン」です。GPT-4.1は開発者向けの実務モデルとして、最大100万トークンという長コンテキストに対応しています。この数値は、Reasoning系列の特徴を理解する上で重要な具体例です。選択肢1の「50万トークン」や選択肢3の「200万トークン」は、GPT-4.1の実際のトークン数ではありません。',
      },
    ],
    textContent: `1. 「思考の連鎖」を行う推論モデル

GPT-o1 / o3 / o4 などの「oシリーズ」および GPT-5 Thinking は、「Reasoning（推論）特化型」です。ユーザーに回答を返す前に、内部で「Chain-of-Thought（思考の連鎖）」と呼ばれるプロセスを経て、じっくりと考えてから答えを出します。

2. 重要な最新スペック数値

この分野は数値データが重要な特徴を示します。以下の数字を理解しておくことが重要です。

⚠️ 重要なスペック数値（2025-2026基準）

• GPT-5 Thinking：o3モデルと比較して、ハルシネーション（幻覚）が約80%減少したと報告されています。
• GPT-4.1：開発者向けの実務モデルとして、最大100万トークンという長コンテキストに対応しています。

3. 名前の紛らわしさに注意

• GPT-4o（オムニ）と GPT-o4（推論）は、名前は似ていますが全く別のモデルです。
• 前者は「速さ・体験」、後者は「深さ・正確性」です。`,
  },
  {
    id: 'unit05-autonomous-ai-agents',
    title: '自律型AIエージェント',
    unitPoint: '自律型AIエージェントは、従来の「質問に答えるAI」を超えて、タスクの計画・実行・修正までを自分で行うAIです。今後のAI活用を理解する上で、Operator と Codex の役割の違いと、「自律性」という概念の整理が重要な理解ポイントになります。',
    learningTips: `エージェント＝作業を代行するAIと一文で説明できるようにする

Operator（ブラウザ操作）／Codex（開発支援）の役割を整理する

従来のチャットAIとの違いを意識して読む`,
    cardDisplay: {
      slideImage: '/images/ch2_unit05_autonomous_agents.png',
      keyPoints: [
        'Operator：ブラウザ操作エージェント（2025年1月公開）',
        'Codex：開発エージェント（2025年5月公開）',
        'Operator：ECサイト購入、レストラン予約、フォーム入力',
        'Codex：GitHubプルリク、バグ修正、機能追加',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '自律型AIエージェントとは何か',
        explanation: '自律型AIエージェントとは、目標を与えると、計画 → 実行 → 結果確認 → 修正を自分で回しながらタスクを完遂するAIです。単なるチャットAIが「質問に答える存在」であるのに対し、エージェントは作業そのものを代行する存在へと進化しています。',
      },
      {
        category: 'Operator：ブラウザ操作エージェント',
        explanation: 'Operator は、人間が行うブラウザ操作をそのまま代行するエージェントです。ECサイトでの商品購入、フォーム入力、レストラン予約といった日常業務を、画面を画像として認識し、クリックや入力を自律的に行います。「画面を理解して操作するAI」という点が、従来AIとの大きな違いです。',
      },
      {
        category: 'Codex：開発エージェント',
        explanation: 'Codex は、ソフトウェア開発に特化したエージェントです。GitHubのプルリクエスト作成、バグ修正、新機能追加、テストが通るまで自律的に修正などの開発工程を、クラウド上のサンドボックス環境で繰り返し実行します。「テストが通るまで自己修正する」という挙動が、エージェントの自律性を象徴しています。',
      },
      {
        category: 'なぜエージェントが重要なのか',
        explanation: '要するに、AIが「答える存在」から「働く存在」へ進化しているという点です。今後の業務自動化・生産性向上・人とAIの役割分担を理解する上で、エージェントは中核となる概念です。',
      },
    ],
    quizQuestions: [
      {
        question: '2025年に公開されたAIエージェント「Operator」の主な機能として、最も適切なものはどれか。',
        options: [
          'ユーザーの代わりに会議に出席して発言する。',
          '独自の仮想ブラウザを起動し、予約・購入・フォーム入力などのWeb操作を自律的に代行する。',
          'ソフトウェアのバグを自動的に修正し、GitHubへプルリクエストを送る。',
          'テキストから高品質な動画を生成する。',
        ],
        correctAnswer: '独自の仮想ブラウザを起動し、予約・購入・フォーム入力などのWeb操作を自律的に代行する。',
        explanation: '正解は「独自の仮想ブラウザを起動し、予約・購入・フォーム入力などのWeb操作を自律的に代行する」です。Operatorは2025年1月に公開された「ブラウザ操作エージェント」で、Web上のタスク（予約や購入など）を画面を画像として認識し、クリックや入力を自律的に行います。選択肢1の「会議に出席して発言」はOperatorの機能ではありません。選択肢3の「ソフトウェアのバグ修正やGitHubプルリクエスト」は「Codex」の役割です。選択肢4の「テキストから動画生成」は画像生成モデルの機能です。',
      },
      {
        question: 'AIエージェントが、従来のチャットボットと決定的に異なる点は何か。',
        options: [
          'ユーザーと会話ができる点',
          '自律的に計画を立て、ツールを使用してタスクを実行（行動）できる点',
          'インターネットに接続されている点',
          'スマートフォンで使える点',
        ],
        correctAnswer: '自律的に計画を立て、ツールを使用してタスクを実行（行動）できる点',
        explanation: '正解は「自律的に計画を立て、ツールを使用してタスクを実行（行動）できる点」です。AIエージェントは、目標を与えると計画→実行→結果確認→修正を自分で回しながらタスクを完遂します。チャットボットは「会話」が主ですが、エージェントは目標達成のために自律的に「行動（ツール実行、ブラウザ操作など）」する点が決定的な違いです。選択肢1の「会話ができる」、選択肢3の「インターネット接続」、選択肢4の「スマートフォンで使える」は、チャットボットとエージェントの両方に当てはまるため、決定的な違いではありません。',
      },
      {
        question: 'Codex（開発エージェント）の特徴として正しいものはどれか。',
        options: [
          'ブラウザ操作を代行する',
          'クラウド上のサンドボックス環境でコードを実行し、テストが通るまで自律的に修正を繰り返す',
          '画像生成に特化している',
        ],
        correctAnswer: 'クラウド上のサンドボックス環境でコードを実行し、テストが通るまで自律的に修正を繰り返す',
        explanation: 'Codexはソフトウェア開発に特化したエージェントで、GitHubのプルリクエスト作成、バグ修正、新機能追加などの開発工程を、クラウド上のサンドボックス環境で繰り返し実行します。',
      },
    ],
    textContent: `1. Operator（ブラウザ操作エージェント）

2025年1月に公開されたOperatorは、人間がブラウザで行う操作を代行します。

• できること：ECサイトでの商品購入、レストラン予約、フォーム入力など。
• 特徴：画面を画像として認識し、クリックや入力を自律的に行います。

2. Codex（開発エージェント）

2025年5月に公開されたCodexは、ソフトウェアエンジニアリングに特化しています。

• できること：GitHubのプルリクエスト作成、バグ修正、機能追加。
• 特徴：クラウド上のサンドボックス（隔離環境）でコードを実行し、テストが通るまで自律的に修正を繰り返します。`,
  },
  {
    id: 'unit06-competitive-models',
    title: '競合モデルの最新動向（Google & Anthropic & Microsoft）',
    unitPoint: 'OpenAI 以外の主要AIモデルとして、Google（Gemini）、Anthropic（Claude）、Microsoft（Copilot）の設計思想と得意分野を整理し、「各社が何を重視してAIを作っているか」を理解することが重要です。',
    learningTips: `会社名 → モデル名 → 強みをセットで覚える

Gemini＝マルチモーダル / Claude＝安全性 / Copilot＝業務統合と一言で言えるようにする

「性能」より設計思想の違いに注目する`,
    cardDisplay: {
      slideImage: '/images/ch2_unit06_competitive_models.png',
      keyPoints: [
        'Gemini 2.5 Pro：最大約104万トークン対応',
        'Gemini 2.5 Flash：高速・低コスト',
        'Claude 4 / Opus 4.1：安全性とハイブリッド設計を重視',
        'Microsoft Copilot：GPT-5ベース、Microsoft 365に統合',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'Google Gemini ファミリー',
        explanation: 'Google の最新世代モデルは Gemini 2.5 系列です。Gemini 2.5 Pro：最上位モデル、長大コンテキスト処理に強い。Gemini 2.5 Flash：高速・低コストのバランス型。Google の最大の特徴は、ネイティブ・マルチモーダル設計です。最初から画像・音声・テキストを同時に理解する前提で作られており、特に音声対話の低遅延を重視しています。',
      },
      {
        category: 'Anthropic Claude ファミリー',
        explanation: 'Anthropic の最新世代は Claude 4 / Opus 4.1 です。Opus 4.1：最上位モデル。実運用・エージェント的タスク・高度なコーディングに強い。Sonnet 4：性能とコストのバランス型。最大の特徴は安全性を最優先する設計思想です。Constitutional AI（憲法AI）という独自のアプローチにより、「無害・正直・役に立つ」を中心にモデルの振る舞いが設計されています。また、拡張推論モードでは外部ツールを並列で呼び出しながら、長時間タスクを遂行できる構造になっています。',
      },
      {
        category: 'Microsoft Copilot',
        explanation: 'Microsoft Copilot は、業務アプリへの統合に特化したAIです。Word / Excel / Teams / Outlook などと深く連携し、商用データ保護のもとでAIを安全に利用可能です。要するに、Copilot は「仕事の中に自然に溶け込むAI」として設計されており、企業利用を強く意識した実務志向のモデル群です。',
      },
      {
        category: '各社の思想の違いを一言で整理',
        explanation: '企業別の設計思想の核：OpenAI＝汎用知能・能力拡張、Google＝マルチモーダル体験、Anthropic＝安全性・信頼性、Microsoft＝業務統合・実用性。この「思想の違い」を理解すると、モデル選択の理由が自然に説明できるようになります。',
      },
    ],
    quizQuestions: [
      {
        question: 'Anthropic社が開発する「Claude」シリーズの特徴である、安全性と無害性を最優先する設計思想を何と呼ぶか。',
        options: [
          'Generative Adversarial Networks (GAN)',
          'Reinforcement Learning from Human Feedback (RLHF)',
          'Constitutional AI (憲法AI)',
          'Chain-of-Thought Prompting',
        ],
        correctAnswer: 'Constitutional AI (憲法AI)',
        explanation: '正解は「Constitutional AI（憲法AI）」です。Anthropic Claudeは「Constitutional AI（憲法AI）」という独自のアプローチを採用しており、「無害・正直・役に立つ」という原則に基づいてモデルが自己修正を行う仕組みを持っています。これがClaudeの最大の特徴である安全性を最優先する設計思想です。選択肢1の「GAN」は敵対的生成ネットワークの略で、画像生成の技術です。選択肢2の「RLHF」は人間のフィードバックからの強化学習で、アライメントの手法の一つですが、Constitutional AIとは異なります。選択肢4の「Chain-of-Thought」は推論手法であり、Claudeの設計思想ではありません。',
      },
      {
        question: 'Google Geminiモデルの最大の特徴は何ですか？',
        options: [
          '安全性と信頼性',
          '最高速度の応答',
          'ネイティブ・マルチモーダル設計',
        ],
        correctAnswer: 'ネイティブ・マルチモーダル設計',
        explanation: '正解は「ネイティブ・マルチモーダル設計」です。Google Geminiは最初から画像・音声・テキストを同時に理解する前提で作られたネイティブ・マルチモーダルモデルです。「ネイティブAudioモデル」による低遅延な会話が特徴です。選択肢1の「安全性と信頼性」はAnthropic Claudeの特徴（Constitutional AI）です。選択肢2の「最高速度の応答」はGPT-4o（Omni系列）により明確に特徴として示されているため、Geminiの「最大の特徴」としては適切ではありません。',
      },
      {
        question: 'Microsoft Copilotの最大の特徴は何ですか？',
        options: [
          '最高速度の応答',
          '業務アプリへの統合と商用データ保護',
          '最低コストでの利用',
        ],
        correctAnswer: '業務アプリへの統合と商用データ保護',
        explanation: '正解は「業務アプリへの統合と商用データ保護」です。Microsoft Copilotは、WordやExcel、Teams、OutlookなどのMicrosoft 365アプリ内で、GPT-5ベースのAIを安全な環境（商用データ保護）で利用できるよう設計されています。これは「仕事の中に自然に溶け込むAI」として設計された、企業利用を強く意識した実務志向の特徴です。選択肢1の「最高速度の応答」はGPT-4o（Omni系列）の特徴です。選択肢3の「最低コストでの利用」はGemini 2.5 Flashなどの特徴ですが、Copilotの「最大の特徴」としては適切ではありません。',
      },
    ],
    textContent: `1. Google Gemini ファミリー

最新世代：Gemini 2.5 系列

• 2.5 Pro：最上位モデル。最大約104万トークン対応。
• 2.5 Flash：高速・低コスト。

強み：ネイティブ・マルチモーダル

最初から画像や音声を理解するように設計されています。「ネイティブAudioモデル」による低遅延な会話が特徴です。

2. Anthropic Claude ファミリー

最新世代：Claude 4 / Opus 4.1

• Opus 4.1：最上位モデル。エージェント的タスクや実運用のコーディングに強い。
• Sonnet 4：バランス型。

強み：安全性とハイブリッド設計

• Constitutional AI（憲法AI）：「無害・正直・役に立つ」を最優先する設計思想。
• 拡張推論モード：外部ツールを並列で呼び出しながら長時間のタスクを遂行します。

3. Microsoft Copilot

• 特徴：ビジネス統合。WordやExcel、TeamsなどのMicrosoft 365アプリ内で、GPT-5ベースのAIを安全な環境（商用データ保護）で利用できます。`,
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

export default function Chapter2Page() {
  const course = courses.find(c => c.id === courseId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // 全ユニットの問題を集約してランダムにシャッフル
  const getAllUnitQuestions = () => {
    const allQuestions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }> = [];
    newChapter2Sections.forEach((section) => {
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
    const section = newChapter2Sections.find(s => s.id === sectionId);
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
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
            {newChapter2Sections.map((section) => (
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

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="mb-8">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      問題 {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700">{questions[currentQuestionIndex]?.question}</p>
                  </div>

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
  );
} 