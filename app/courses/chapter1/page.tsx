'use client';

import { useState } from 'react';
import { courses } from '../../../data/courses';
import { ChevronLeft, Clock, BookOpen, CheckCircle, Brain, Circle } from 'lucide-react';
import Link from 'next/link';
import HybridContentCard from '../../components/HybridContentCard';
import ChatButton from '../../components/ChatButton';
import UnitQuizModal from '../../components/UnitQuizModal';

const courseId = 'chapter1';

// 新しい構造のテストデータ（YAMLファイルから将来的に読み込む）
const newChapter1Sections = [
  {
    id: 'unit01-ai-definition-history',
    title: 'AIの定義と歴史',
    unitPoint: 'AIとは何かを正確に定義し、「AIの4つのレベル」による分類、現在のAIがどの段階にあるのか（ANI／AGI）、さらに過去3回のAIブームと「冬の時代」の因果関係を理解することが目的です。',
    learningTips: `AIは「できること」ではなく「どういう仕組みで知能を実現しているか」という視点で整理すると混乱しません

3回のブームは「何が期待され」「なぜ失望されたのか」をセットで覚えると理解が定着します

「レベル1〜4」の具体例（家電、将棋、検索エンジン、自動運転）をセットで覚えましょう`,
    cardDisplay: {
      slideImage: '/images/ch1_unit01_ai_history.png',
      keyPoints: [
        'ANI（特化型AI）とAGI（汎用AI）の違い',
        '第1次ブーム：推論と探索',
        '第2次ブーム：エキスパートシステム',
        '第3次ブーム：機械学習・ディープラーニング',
        'シンギュラリティ：2045年問題',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'AIの定義とロボットとの違い',
        explanation: 'AI（Artificial Intelligence）は「人間の知能を再現する能力」を持つソフトウェアです。「AI＝脳（ソフト）」「ロボット＝体（ハード）」という区別が重要です。AIは物理的な身体がなくても成立します。',
      },
      {
        category: 'AIの4つのレベル',
        explanation: 'レベル1（制御）：エアコンや冷蔵庫など、決められたルール通りに動く単純制御。レベル2（ルールベース）：将棋プログラムや掃除ロボットなど、多くのルール（知識）を人間が入力したもの。レベル3（機械学習）：検索エンジンなど、データからルールを学ぶが、着眼点（特徴量）は人間が教えるもの。レベル4（ディープラーニング）：自動運転や画像認識など、「特徴量」も含めて自律的に学習するもの。',
      },
      {
        category: 'ANIとAGIの違い',
        explanation: 'ANI（弱いAI／特化型AI）：特定のタスクしかできない。現在のAI（ChatGPT含む）はすべてこれです。AGI（強いAI／汎用AI）：人間のようにあらゆる課題に対応できるAI。まだ理論上の存在です。',
      },
      {
        category: '第1次AIブーム：推論と探索（1956年〜）',
        explanation: 'ダートマス会議（1956年）で「AI」という言葉が初めて使われました。「推論」と「探索」で迷路などは解けましたが、現実の複雑な問題は解けず「冬の時代」へ。',
      },
      {
        category: '第2次AIブーム：エキスパートシステム（1980年代〜）',
        explanation: '専門家の知識をルールとして入力する「エキスパートシステム」が流行しました。しかし、知識入力の手間と管理の限界により、実用性が低く再び「冬の時代」へ。',
      },
      {
        category: '第3次AIブーム：機械学習とディープラーニング（2010年代〜）',
        explanation: 'ビッグデータの蓄積とディープラーニングの技術革新が要因です。2012年の画像認識コンペでCNNが圧勝したことが象徴的な転換点です。',
      },
      {
        category: 'シンギュラリティとAI効果',
        explanation: 'シンギュラリティ（技術的特異点）：AIが人間を超え自己進化を始める時点（カーツワイルは2045年と予測）。AI効果：「AIができたら、それはもうAIとは呼ばれなくなる（当たり前の技術になる）」ために、人々がいつまでもAIに満足できず失望を繰り返す心理現象。',
      },
    ],
    quizQuestions: [
      {
        question: 'AI（人工知能）とロボットの定義上の違いとして、最も適切な説明はどれか。',
        options: [
          'AIは物理的な身体を持つ機械であり、ロボットは知能を持つソフトウェアである。',
          'AIは「脳（ソフトウェア）」であり物理的な身体を必要としないが、ロボットは「体（ハードウェア）」を持つ機械である。',
          'AIとロボットは完全に同じ意味であり、区別する必要はない。',
          'AIは人間型である必要があり、ロボットは産業用である必要がある。',
        ],
        correctAnswer: 'AIは「脳（ソフトウェア）」であり物理的な身体を必要としないが、ロボットは「体（ハードウェア）」を持つ機械である。',
        explanation: '正解は「AIは「脳（ソフトウェア）」であり物理的な身体を必要としないが、ロボットは「体（ハードウェア）」を持つ機械である。」です。AIは知覚や学習を行うソフトウェア（脳）であり、物理的な身体がなくても機能します。一方、ロボットは物理的な機械（体）を指し、両者は明確に区別されます。選択肢1、3、4はいずれも誤りです。',
      },
      {
        question: 'AIの進化段階を示す「AIの4つのレベル」において、レベル3とレベル4の決定的な違いは何か。',
        options: [
          'レベル3はルールベースだが、レベル4は機械学習である。',
          'レベル3は家電製品に使われるが、レベル4は将棋プログラムに使われる。',
          'レベル3は人間が特徴量（着眼点）を指定する必要があるが、レベル4はAIが自ら特徴量を学習する（ディープラーニング）。',
          'レベル3は強いAI（AGI）だが、レベル4は弱いAI（ANI）である。',
        ],
        correctAnswer: 'レベル3は人間が特徴量（着眼点）を指定する必要があるが、レベル4はAIが自ら特徴量を学習する（ディープラーニング）。',
        explanation: '正解は「レベル3は人間が特徴量（着眼点）を指定する必要があるが、レベル4はAIが自ら特徴量を学習する（ディープラーニング）。」です。レベル3（検索エンジン等）は人間が特徴量を設定しますが、レベル4（自動運転等）はディープラーニングにより、特徴量の抽出も含めて自律的に学習します。選択肢1、2、4はいずれも誤りです。',
      },
      {
        question: '1956年に開催され、「人工知能（Artificial Intelligence）」という言葉が初めて使われた会議はどれか。',
        options: [
          'ダートマス会議',
          'シリコンバレー会議',
          'ケンブリッジ会議',
          '京都会議',
        ],
        correctAnswer: 'ダートマス会議',
        explanation: '正解は「ダートマス会議」です。ジョン・マッカーシーらが主催したダートマス会議がAI研究の始まりとされており、ここから第1次AIブームが始まりました。選択肢2、3、4はいずれも誤りです。',
      },
      {
        question: '「第2次AIブーム（1980年代）」が終焉し、再び「AIの冬」が訪れた主な技術的要因はどれか。',
        options: [
          'コンピュータの計算速度が速すぎたため。',
          'インターネットが普及し、AIが不要になったため。',
          '専門家の知識を入力・管理するコストが膨大になり、複雑な現実問題に対応できないことが露呈したため。',
          'ディープラーニングの計算コストが高すぎたため。',
        ],
        correctAnswer: '専門家の知識を入力・管理するコストが膨大になり、複雑な現実問題に対応できないことが露呈したため。',
        explanation: '正解は「専門家の知識を入力・管理するコストが膨大になり、複雑な現実問題に対応できないことが露呈したため。」です。第2次ブームの主役「エキスパートシステム」は、知識入力の手間と管理の難しさ（ボトルネック）により実用性が限定的となり、ブームは終焉しました。選択肢1、2、4はいずれも誤りです。',
      },
    ],
    textContent: `AI（人工知能）とは、人間の知能を再現するコンピュータの能力のことです。知覚、認識、理解、学習、問題解決などの能力が求められます。現在のAIは限定的な能力しか持っておらず、人間の知能を完全に再現することはできません。

AIとロボットは別物です。AIは「脳（ソフトウェア）」で、ロボットは「体（ハードウェア）」です。AIは物理的な身体がなくても機能します。

AIの進化は4つのレベルに分けられます。レベル1は制御で、エアコンや冷蔵庫のように決められたルール通りに動きます。レベル2はルールベースで、将棋プログラムのように人間が入力したルールに基づいて動作します。レベル3は機械学習で、検索エンジンのようにデータからルールを学びます。レベル4はディープラーニングで、自動運転のように特徴量も含めて自律的に学習します。

現在のAIはANI（特化型AI）の段階です。特定のタスクにしか対応できません。ChatGPTも含めて、現在のすべてのAIはANIです。一方、AGI（汎用AI）は人間のようにあらゆる課題に対応できるAIですが、まだ実現していません。

AIの歴史には3回のブームがありました。第1次ブーム（1956年〜）では「AI」という言葉が初めて使われ、「推論」と「探索」の技術が注目されました。しかし現実の問題は解けず「冬の時代」を迎えました。第2次ブーム（1980年代〜）では専門家の知識をルールとして入力する「エキスパートシステム」が流行しました。しかし知識入力の手間と管理の限界で再び「冬の時代」となりました。第3次ブーム（2010年代〜）はビッグデータとディープラーニングの技術革新により起こりました。2012年の画像認識コンペでCNNが圧勝したことが転換点です。

シンギュラリティとは、AIが人間を超えて自己進化を始める時点のことです。レイ・カーツワイルは2045年と予測しています。AI効果とは、「AIができると、それはもうAIとは呼ばれなくなる」ために、人々がいつまでもAIに満足できず失望を繰り返す心理現象です。`,
  },
  {
    id: 'unit02-machine-learning',
    title: '機械学習の仕組み（4つの学習手法）',
    unitPoint: 'AIに知能をもたらす中核技術である機械学習について、「なぜ学習できるのか」「どのような学習方法があるのか」を理解し、用途に応じた使い分けの考え方を整理します。',
    learningTips: `4つの学習手法は「正解があるか／ないか／報酬か／混在か」という視点で整理すると混乱しません

それぞれの学習方法と、代表的な活用場面を必ずセットで覚えましょう`,
    cardDisplay: {
      slideImage: '/images/ch1_unit02_machine_learning.png',
      keyPoints: [
        '教師あり学習：問題と正解のセットで学ぶ',
        '教師なし学習：正解なしでデータの特徴を見つける',
        '強化学習：報酬を最大化するように行動を学ぶ',
        '半教師あり学習：少量の正解データと大量の未ラベルデータを使う',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '機械学習とは何か',
        explanation: '機械学習とは、大量のデータからコンピュータが規則性やパターンを自ら見つけ出す技術です。人間がすべてのルールを与えるルールベースと異なり、データから学習してモデルを作ることが最大の特徴です。この学習結果をまとめたものが学習済みモデル（Pre-trained Model）です。',
      },
      {
        category: '① 教師あり学習',
        explanation: '入力データと正解ラベルのペアを与えて学習させる手法です。分類（スパム判定・画像分類など）や回帰（売上予測・需要予測）が得意です。要するに、「問題集と答え」を使って勉強する学習です。',
      },
      {
        category: '② 教師なし学習',
        explanation: '正解データを与えず、データそのものの構造や特徴を見つけ出す学習方法です。代表的な技法がクラスタリングと次元削減です。要するに、「答えなしでデータのクセを見抜く学習」です。',
      },
      {
        category: '③ 強化学習',
        explanation: 'AIが行動し、その結果に対して報酬を与えながら最適な行動を学習させる方法です。ゲームAI・ロボット制御・自動運転などで活用されます。要するに、「失敗と成功を繰り返して上達する学習」です。',
      },
      {
        category: '④ 半教師あり学習',
        explanation: '少量の正解データと大量の未ラベルデータを組み合わせて学習する手法です。ラベル付けコストを大幅に削減できる一方、精度が不安定になりやすいという特徴があります。',
      },
      {
        category: 'ノーフリーランチ定理',
        explanation: '「万能な学習アルゴリズムは存在しない」という重要原則です。データの種類・目的に応じて手法を選ぶ必要があることを意味します。この考え方は、AI設計全体の前提となる非常に重要な理解ポイントです。',
      },
    ],
    quizQuestions: [
      {
        question: '「正解データ」を与えずに、データそのものが持つ構造やパターン（似たもの同士のグループなど）を見つけ出す学習手法はどれか。',
        options: [
          '教師あり学習',
          '教師なし学習',
          '強化学習',
          '深層学習',
        ],
        correctAnswer: '教師なし学習',
        explanation: '正解は「教師なし学習」です。正解（ラベル）を与えない学習は「教師なし学習」です。代表的な手法にクラスタリングや次元削減があります。選択肢1の「教師あり学習」は正解データを必要とします。選択肢3の「強化学習」は報酬に基づいて学習します。選択肢4の「深層学習」は学習手法の分類ではありません。',
      },
      {
        question: '「強化学習」のプロセスとして最も適切な説明はどれか。',
        options: [
          '過去のデータを読み込み、未来の数値を予測する。',
          '猫や犬の画像にラベルを付け、それを手本に分類を行う。',
          'コンピュータが行動を選択し、得られる「報酬」を最大化するように試行錯誤して学習する。',
          '少量のエラーデータを人間が修正する。',
        ],
        correctAnswer: 'コンピュータが行動を選択し、得られる「報酬」を最大化するように試行錯誤して学習する。',
        explanation: '正解は「コンピュータが行動を選択し、得られる「報酬」を最大化するように試行錯誤して学習する。」です。強化学習は、行動の結果として得られる報酬（スコアなど）を最大化するように、試行錯誤を通じて最適な行動を学習します。選択肢1は時系列予測、選択肢2は教師あり学習、選択肢4は半教師あり学習の説明です。',
      },
      {
        question: '機械学習における「ノーフリーランチ定理」の意味として正しいものはどれか。',
        options: [
          '無料のランチのように、コストがかからないAIモデルが存在する。',
          'あらゆる問題に対して万能に高性能を発揮できる、唯一のモデルは存在しない。',
          'データを増やせば増やすほど、必ず精度が向上する。',
          '学習には必ず人間による食事（データ入力）が必要である。',
        ],
        correctAnswer: 'あらゆる問題に対して万能に高性能を発揮できる、唯一のモデルは存在しない。',
        explanation: '正解は「あらゆる問題に対して万能に高性能を発揮できる、唯一のモデルは存在しない。」です。特定の問題に特化したモデルは他の問題では性能が落ちる可能性があり、あらゆる問題に万能なモデルは存在しないという定理です。選択肢1、3、4はいずれも誤りです。',
      },
      {
        question: '「半教師あり学習」が採用される主なメリットは何か。',
        options: [
          'ラベル付け（アノテーション）のコストを大幅に削減しつつ、大量のデータを利用できる。',
          '学習時間がゼロになる。',
          'コンピュータの電力を消費しない。',
          '教師あり学習よりも必ず精度が高くなる。',
        ],
        correctAnswer: 'ラベル付け（アノテーション）のコストを大幅に削減しつつ、大量のデータを利用できる。',
        explanation: '正解は「ラベル付け（アノテーション）のコストを大幅に削減しつつ、大量のデータを利用できる。」です。少量のラベル付きデータと大量のラベルなしデータを組み合わせることで、全てのデータにラベルを付けるコストを削減できるのがメリットです。選択肢2、3、4はいずれも誤りです。',
      },
    ],
    textContent: `AIに知能をもたらす仕組みには、ルールベースと機械学習の2つがあります。現在主流なのは機械学習です。

ルールベースは、人間が作ったルールや知識をプログラムに組み込む方法です。しかし、ルールをたくさん作る必要があり、管理が大変です。これが第二次AIブームが終わった理由の一つです。

機械学習は、大量のデータからコンピュータが自分で学ぶ技術です。1959年にアーサー・サミュエルが定義しました。データを学んだ後のモデルを「学習済みモデル」と呼びます。スパムメールの分類、顔認識、音声認識、画像認識、自動運転などで使われています。

機械学習には、主に3つの手法があります。教師あり学習は、データと正解のペアで学ぶ方法です。分類や予測に適しています。教師なし学習は、正解なしでデータのパターンを見つける方法です。クラスタリング（似た特徴のグループ分け）が代表例です。強化学習は、環境とやり取りしながら報酬を最大化する行動を学ぶ方法です。ゲームやロボット制御に適しています。半教師あり学習は、少しの正解データと多くの未ラベルデータを効率的に使う方法です。`,
  },
  {
    id: 'unit03-deep-learning',
    title: 'ディープラーニングとニューラルネットワーク',
    unitPoint: '人間の脳の仕組みを数式モデルとして再現したニューラルネットワークと、それを多層化したディープラーニングが、現在のAIの認識能力の基盤となっていることを理解します。',
    learningTips: `「脳 → ニューロン → シナプス → ニューラルネットワーク → ディープラーニング」という対応関係をイメージでつなげて覚えると理解が安定します

学習とは結局「重みを調整する作業」であるという視点で整理すると全体像が見えやすくなります`,
    cardDisplay: {
      slideImage: '/images/ch1_unit03_deep_learning.png',
      keyPoints: [
        'ニューロンとシナプス：脳の神経回路を数式モデル化',
        'ディープラーニング：隠れ層を多層化して複雑な特徴を自動抽出',
        '重み（Weight）：入力情報の重要度を調整するパラメータ',
        '学習とは重みを最適化すること',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: 'ニューラルネットワークの基本構造',
        explanation: 'ニューラルネットワークは人間の神経細胞（ニューロン）を模倣した数理モデルです。入力層・隠れ層・出力層という層構造を持ち、各ノード間は重み付きで接続されています。この重みが情報の重要度を表し、学習とはこの重みを最適化するプロセスです。つまり、AIの学習とは「知識を覚える」ことではなく「重みを調整する」ことです。',
      },
      {
        category: 'ディープラーニングとは何か',
        explanation: 'ディープラーニングとは、ニューラルネットワークの隠れ層を多層化（ディープ化）した技術です。層を重ねることで、単純な特徴から複雑な特徴までを自動的に抽出できるようになります。要するに、ディープラーニングは「特徴量設計を人間がしなくてよくなった」ことが最大の革新です。',
      },
      {
        category: '人間の脳との対応関係',
        explanation: '人間の脳では、弱い信号は無視され、複数の信号が集まると次の神経へ伝達されます。この仕組みがニューラルネットワークでは重みと活性化関数として再現されています。繰り返し刺激されるとシナプスが強化されるように、AIも学習によって重みが調整され、判断精度が向上します。',
      },
      {
        category: 'AIが画像を認識する仕組み',
        explanation: 'AIが画像を認識する際、最初のステップとして画像を画素（ピクセル）に分解し、色情報（RGB）などを数値データとして抽出します。画像はピクセルの集合として数値化され、色や形の情報が入力されます。初期の層では線や色などの単純な特徴を捉え、深い層では物体や概念といった複雑な特徴を捉えます。これは人間が色・形・模様を統合して物体を認識する過程とよく似ています。',
      },
      {
        category: '学習と重みの最適化',
        explanation: 'モデルは最初ランダムな重みを持ちます。予測結果と正解との差（誤差）を計算し、この誤差を最小化するように重みを調整し続けることで性能が向上します。この繰り返しによってモデルは最適化されていきます。',
      },
    ],
    quizQuestions: [
      {
        question: 'ニューラルネットワークにおいて、人間の脳の「シナプスの結合強度」に相当し、情報の伝達効率を調整するパラメータを何と呼ぶか。',
        options: [
          'ニューロン',
          'バイアス',
          '重み（ウェイト）',
          '層（レイヤー）',
        ],
        correctAnswer: '重み（ウェイト）',
        explanation: '正解は「重み（ウェイト）」です。AIの学習とは、入力と出力の誤差が小さくなるように、この「重み」を最適な値に調整し続けるプロセスを指します。選択肢1の「ニューロン」は神経細胞、選択肢2の「バイアス」は別のパラメータ、選択肢4の「層（レイヤー）」はネットワークの構造を表します。',
      },
      {
        question: 'ディープラーニング（深層学習）の定義として最も適切なものはどれか。',
        options: [
          'ニューラルネットワークの「隠れ層（中間層）」を多層化したモデル。',
          '1層のみの単純なニューラルネットワーク。',
          '人間が手動でルールを記述するプログラム。',
          'データベースから検索を行うだけのシステム。',
        ],
        correctAnswer: 'ニューラルネットワークの「隠れ層（中間層）」を多層化したモデル。',
        explanation: '正解は「ニューラルネットワークの「隠れ層（中間層）」を多層化したモデル。」です。隠れ層を何層にも深く（ディープに）重ねることで、複雑な特徴量を自動抽出できるようにしたものがディープラーニングです。選択肢2、3、4はいずれも誤りです。',
      },
      {
        question: 'AIが画像を認識する際、最初のステップとして行われる処理はどれか。',
        options: [
          '画像全体を「美しい」か「汚い」かで判断する。',
          '画像を画素（ピクセル）に分解し、色情報（RGB）などを数値データとして抽出する。',
          '画像に描かれている物体の名前を辞書で引く。',
          '画像を白黒に変換して保存する。',
        ],
        correctAnswer: '画像を画素（ピクセル）に分解し、色情報（RGB）などを数値データとして抽出する。',
        explanation: '正解は「画像を画素（ピクセル）に分解し、色情報（RGB）などを数値データとして抽出する。」です。AIは画像を数値データとして認識します。まず画像を画素に分解し、それぞれのRGB数値（例：R24, G41, B37）を抽出することから始まります。選択肢1、3、4はいずれも誤りです。',
      },
    ],
    textContent: `ニューラルネットワークは、人間の脳の仕組みを真似た技術です。脳の神経細胞（ニューロン）を模した人工ニューロン（ノード）を層に並べて情報を処理します。ニューロン同士をつなぐ「重み」というパラメータで、情報の伝わりやすさを調整します。ニューラルネットワークには、入力層、隠れ層（中間層）、出力層があります。

ディープラーニングは、隠れ層を何層も重ねる技術です。2006年に深層ネットワークが提唱され、これ以降ディープラーニングが大きく発展しました。多層の構造により、データから段階的に複雑な特徴を自動的に見つけられます。

学習とは、「重み」を調整することです。モデルの出力と正解の差（誤差）を小さくするように、重みの値を変えていきます。この学習により、AIは画像認識や音声認識、自然言語処理などで高い性能を発揮できるようになります。`,
  },
  {
    id: 'unit04-overfitting-bias',
    title: '学習の精度と課題（過学習とバイアス）',
    unitPoint: 'AIの学習精度を高めるうえで必ず直面する「過学習」と、その対策手法、さらに学習データの偏りが引き起こす「バイアス」の問題について理解し、AIを安全かつ適切に活用するための基礎知識を身につけます。',
    learningTips: `「理想的な学習状態＝汎化」「学習しすぎ＝過学習」という対比で整理すると理解しやすくなります

対策手法はそれぞれの目的と効果をイメージで結びつけて覚えると混乱しません`,
    cardDisplay: {
      slideImage: '/images/ch1_unit04_overfitting_bias.png',
      keyPoints: [
        '過学習：訓練データに適合しすぎて未知データに対応できない',
        '対策：ドロップアウト、正則化、アーリーストッピング',
        '転移学習：ある領域で学習したモデルを別の領域に再利用',
        'バイアス：学習データの偏りが差別や偏見を生む',
      ],
      versionInfo: {
        version: '4.0',
        lastUpdated: '2024-12',
      },
    },
    importantExplanations: [
      {
        category: '過学習とは何か',
        explanation: '過学習とは、訓練データに過剰に適合してしまい、新しい未知データに対して正しく予測できなくなる現象です。学習が不足している状態と、適切に一般化できている状態（汎化）との中間に、理想的な学習状態がありますが、学習を続けすぎると個々のデータの細部やノイズまで覚えてしまい、本質的な規則性を見失います。',
      },
      {
        category: '過学習が起こる原因',
        explanation: '訓練データのノイズや偶然の特徴まで学習してしまうことが主な原因です。その結果、訓練データでは高精度でも、未知のデータでは性能が大きく低下します。',
      },
      {
        category: '過学習を防ぐ主要な対策手法',
        explanation: 'アーリーストッピングは、検証データの性能が最良のタイミングで学習を停止する方法です。正則化は、モデルの複雑さを制限し、不要に大きなパラメータにならないよう制御します。ドロップアウトは、学習中にランダムで一部のニューロンを無効化し、モデルの依存関係の偏りを防ぎ、汎化性能を高めます。',
      },
      {
        category: '転移学習の役割',
        explanation: '転移学習は、あるタスクで学習したモデルの知識を別のタスクに再利用する手法です。少ないデータでも高精度なモデル構築が可能になり、学習時間も大幅に短縮されます。',
      },
      {
        category: 'バイアスの問題',
        explanation: 'バイアスとは、学習データの偏りがAIの判断結果にそのまま反映されてしまう問題です。データの選び方や収集方法によって差別的な判断や不公平な結果が生じるため、AI活用において必ず考慮すべき重要課題です。',
      },
    ],
    quizQuestions: [
      {
        question: '機械学習において、AIモデルが訓練データに過度に適応しすぎてしまい、未知のデータに対する予測精度が下がってしまう現象を何と呼ぶか。',
        options: [
          '汎化（Generalization）',
          '過学習（Overfitting）',
          '転移学習（Transfer Learning）',
          'シンギュラリティ（Singularity）',
        ],
        correctAnswer: '過学習（Overfitting）',
        explanation: '正解は「過学習（Overfitting）」です。訓練データのノイズや細かい癖まで暗記してしまい、新しいデータに対応できなくなる状態です。オーバーフィッティングとも呼ばれます。選択肢1の「汎化」は過学習とは逆の理想的な状態、選択肢3の「転移学習」は別のタスクへの知識の再利用、選択肢4の「シンギュラリティ」はAIが人間を超える時点を指します。',
      },
      {
        question: '「過学習」を防ぐための代表的な手法の組み合わせとして、正しいものはどれか。',
        options: [
          'データの削除・学習の長時間化・ルールの固定',
          'ドロップアウト・正則化・アーリーストッピング',
          'パラメータの増加・画像の高画質化・転移学習',
          '教師なし学習への切り替え・バイアスの増加',
        ],
        correctAnswer: 'ドロップアウト・正則化・アーリーストッピング',
        explanation: '正解は「ドロップアウト・正則化・アーリーストッピング」です。過学習の対策としては、ニューロンをランダムに無効化する「ドロップアウト」、モデルを単純化する「正則化」、適切な時点で学習を止める「アーリーストッピング」があります。選択肢1、3、4はいずれも過学習の対策ではありません。',
      },
      {
        question: 'ある領域で学習済みのモデル（例：猫の認識）の知識を、別の領域（例：レントゲン画像の診断）に応用して、学習効率を高める手法を何と呼ぶか。',
        options: [
          '転移学習',
          '強化学習',
          'アンサンブル学習',
          '敵対的学習',
        ],
        correctAnswer: '転移学習',
        explanation: '正解は「転移学習」です。ゼロから学習するのではなく、既存の学習済みモデル（重みなど）を流用・微調整することで、少ないデータと時間で効率的にモデルを構築する手法です。選択肢2の「強化学習」は報酬に基づく学習、選択肢3の「アンサンブル学習」は複数のモデルを組み合わせる手法、選択肢4の「敵対的学習」はGANなどの手法です。',
      },
      {
        question: '「AI効果」と呼ばれる心理現象の説明として正しいものはどれか。',
        options: [
          'AIを使うと人間の知能が低下する現象。',
          'AIの原理が分かってしまうと、「それは単なるプログラムに過ぎない」と考え、知能とは認めなくなる（失望する）現象。',
          'AIが人間を超えて自己進化を始める現象。',
          'AIによって経済効果が生まれる現象。',
        ],
        correctAnswer: 'AIの原理が分かってしまうと、「それは単なるプログラムに過ぎない」と考え、知能とは認めなくなる（失望する）現象。',
        explanation: '正解は「AIの原理が分かってしまうと、「それは単なるプログラムに過ぎない」と考え、知能とは認めなくなる（失望する）現象。」です。AI技術への期待が高すぎるあまり、実際に仕組みが分かったり普及したりすると「たいしたことない」と失望し、知能として認めなくなる心理現象を指します。選択肢1、3、4はいずれも誤りです。',
      },
    ],
    textContent: `過学習（Overfitting）は、機械学習の重要な課題です。訓練データに合わせすぎて、新しいデータでは性能が落ちてしまう現象です。訓練データでは高い精度が出ても、実際のデータではうまくいかない状態です。

過学習を防ぐ方法として、ドロップアウト、正則化、アーリーストッピングがあります。ドロップアウトは、学習中にニューロンをランダムに無効化して、特定のニューロンに頼りすぎないようにします。正則化は、モデルを複雑にしすぎないように制限を加えます。アーリーストッピングは、検証データの性能が上がらなくなったら学習を止めます。

転移学習は、ある分野で学んだモデルを別の分野でも使う方法です。少ないデータでも効率的に学習でき、時間やコストを節約できます。例えば、画像認識で学んだモデルを医療画像の分析に使うことができます。

AIのバイアスは、学習データに含まれる人間の偏見が反映される問題です。データの偏りによって、AIの判断に差別や偏見が生まれる可能性があります。この問題を解決するには、多様なデータを集める、バイアスを見つけて修正する、公平性を考慮した設計などが大切です。`,
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

export default function Chapter1Page() {
  const course = courses.find(c => c.id === courseId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // 全ユニットの問題を集約してランダムにシャッフル
  const getAllUnitQuestions = () => {
    const allQuestions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }> = [];
    newChapter1Sections.forEach((section) => {
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
    const section = newChapter1Sections.find(s => s.id === sectionId);
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
            {newChapter1Sections.map((section) => (
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