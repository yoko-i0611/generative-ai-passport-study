# 引き継ぎ書 - 問題演習（300問）と分析機能の追加

**作成日**: 2025-01-03  
**目的**: 問題演習（300問）の追加と分析機能の追加に関する引き継ぎ書  
**優先度**: 高（チャット機能の変更前に実装）

---

## 📋 現在の状態

### ✅ 実装済み機能

#### 1. 問題演習機能（部分実装）

**現在の実装:**
- **ファイル**: `app/quiz/page.tsx`
- **API**: `app/api/quiz-questions/route.ts`
- **データソース**: `data/courses.ts`から問題を取得
- **機能**: 
  - 問題数選択（10問、20問、30問、50問、100問）
  - 学習履歴の保存・復元
  - 復習モード
  - 問題のシャッフル

**問題点:**
- `public/app_questions_300.json`（300問のデータ）が存在するが、現在は使用されていない
- APIは`data/courses.ts`から問題を取得しているため、300問すべてが利用可能ではない可能性がある

#### 2. 分析機能（実装済み）

**実装済みコンポーネント:**
- `app/components/LearningProgress.tsx` - 学習進捗の表示
- `app/components/ComprehensiveProgress.tsx` - 総合学習進捗の表示

**実装済みユーティリティ:**
- `app/utils/learningHistory.ts` - 学習履歴の管理クラス
- `app/utils/skillAnalysis.ts` - スキル分析機能

**機能:**
- 章別の正答率計算
- 弱点分野の特定
- 推奨学習トピックの提案
- 学習傾向の分析
- 適応的問題生成（`app/api/adaptive-quiz/route.ts`）

---

## 🎯 追加が必要な作業

### 1. 問題演習（300問）の完全実装

#### 現状の問題
- `public/app_questions_300.json`に300問のデータが存在するが、APIで使用されていない
- 現在のAPI（`app/api/quiz-questions/route.ts`）は`data/courses.ts`から問題を取得

#### 実装手順

**ステップ1: APIの修正**

`app/api/quiz-questions/route.ts`を修正して、`public/app_questions_300.json`から問題を読み込むようにする：

```typescript
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Question } from '@/types';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countParam = searchParams.get('count');
  
  const count = countParam ? parseInt(countParam, 10) : 10;

  if (count <= 0) {
    return NextResponse.json({ error: 'Count must be a positive integer' }, { status: 400 });
  }

  try {
    // public/app_questions_300.jsonから問題を読み込む
    const filePath = join(process.cwd(), 'public', 'app_questions_300.json');
    const fileContents = await readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const allQuestions: Question[] = data.questions || [];
    const totalQuestions = allQuestions.length;
    
    if (totalQuestions === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 500 });
    }

    // 問題をシャッフルして指定数だけ取得
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(count, totalQuestions));

    return NextResponse.json({
      questions: selectedQuestions,
      totalQuestions: totalQuestions,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}
```

**ステップ2: 型定義の確認**

`types/question.ts`で`Question`型が`app_questions_300.json`の構造と一致しているか確認：

```typescript
export interface Question {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  metadata?: {
    chapter?: number;
    category?: string;
    source?: string;
    tags?: string[];
    difficulty?: string;
    unitId?: string;
  };
}
```

**ステップ3: 問題数のオプション追加**

`app/quiz/page.tsx`の`questionCountOptions`に300問のオプションを追加：

```typescript
const questionCountOptions = [
  { count: 10, label: '10問', time: '約5分', description: '短時間でサクッと復習' },
  { count: 20, label: '20問', time: '約10分', description: '標準的な演習時間' },
  { count: 30, label: '30問', time: '約15分', description: 'じっくりと学習' },
  { count: 50, label: '50問', time: '約25分', description: '模擬試験レベル' },
  { count: 100, label: '100問', time: '約50分', description: '全問題制覇・完全マスター' },
  { count: 300, label: '300問', time: '約150分', description: '全問題制覇・完全マスター' }, // 追加
];
```

---

### 2. 分析機能の強化

#### 現状の実装

**学習履歴管理:**
- `app/utils/learningHistory.ts` - `LearningHistoryManager`クラス
- ローカルストレージに保存（`comprehensiveLearningHistory`キー）
- 章別進捗、スキル別進捗、弱点分野、推奨学習領域を管理

**スキル分析:**
- `app/utils/skillAnalysis.ts` - `calculateSkillLevel`, `generateAdaptiveQuestions`関数
- 章別の習得レベル計算
- 弱点分野の特定（70%未満）
- 適応的問題生成

**表示コンポーネント:**
- `app/components/LearningProgress.tsx` - 学習進捗の表示
- `app/components/ComprehensiveProgress.tsx` - 総合学習進捗の表示

#### 追加が必要な機能

**1. 詳細分析ページの追加**

`app/analytics/page.tsx`が存在するが、完全に実装されているか確認が必要：

```typescript
// 実装すべき機能
- 章別の詳細な分析
- 問題タイプ別の正答率
- 学習時間の分析
- 弱点分野の詳細
- 学習パスの推奨
```

**2. 分析データの可視化強化**

- グラフ・チャートの追加
- 時系列での学習進捗の表示
- 章別の比較表示

**3. エクスポート機能**

- 学習履歴のCSVエクスポート
- 分析結果のPDFエクスポート（オプション）

---

## 📂 ファイル構造

```
/Users/imamurayoko/Developer/Cursor/application/
├── app/
│   ├── quiz/
│   │   └── page.tsx                    # 問題演習ページ（修正必要）
│   ├── analytics/
│   │   └── page.tsx                    # 分析ページ（確認・強化必要）
│   ├── api/
│   │   ├── quiz-questions/
│   │   │   └── route.ts                # 問題取得API（修正必要：300問対応）
│   │   └── adaptive-quiz/
│   │       └── route.ts                # 適応的問題生成API（既存）
│   ├── components/
│   │   ├── LearningProgress.tsx        # ✅ 学習進捗表示（既存）
│   │   └── ComprehensiveProgress.tsx   # ✅ 総合学習進捗表示（既存）
│   └── utils/
│       ├── learningHistory.ts          # ✅ 学習履歴管理（既存）
│       └── skillAnalysis.ts            # ✅ スキル分析（既存）
├── public/
│   └── app_questions_300.json          # ✅ 300問の問題データ（既存、未使用）
└── types/
    ├── question.ts                     # ✅ 問題の型定義（確認必要）
    └── answer.ts                       # ✅ 回答の型定義（確認必要）
```

---

## 🔧 実装の優先順位

### 優先度1: 問題演習（300問）の完全実装

1. **APIの修正**（`app/api/quiz-questions/route.ts`）
   - `public/app_questions_300.json`から問題を読み込むように変更
   - 300問すべてが利用可能になることを確認

2. **問題数オプションの追加**（`app/quiz/page.tsx`）
   - 300問のオプションを追加
   - UIの調整（必要に応じて）

3. **動作確認**
   - 300問すべてが正しく読み込まれるか
   - 問題のシャッフルが正しく動作するか
   - 学習履歴が正しく保存されるか

### 優先度2: 分析機能の強化

1. **分析ページの確認・強化**（`app/analytics/page.tsx`）
   - 現在の実装を確認
   - 不足している機能を追加

2. **可視化の強化**
   - グラフ・チャートの追加
   - より詳細な分析結果の表示

3. **エクスポート機能の追加**（オプション）
   - CSVエクスポート
   - PDFエクスポート（オプション）

---

## ⚠️ 注意事項

### 1. データの整合性

- `public/app_questions_300.json`のデータ構造が`types/question.ts`の型定義と一致しているか確認
- 章別の問題数が正しく設定されているか確認

### 2. パフォーマンス

- 300問すべてを一度に読み込む場合のパフォーマンスを確認
- 必要に応じてページネーションや遅延読み込みを実装

### 3. 学習履歴の互換性

- 既存の学習履歴との互換性を確認
- データ移行が必要な場合は移行スクリプトを作成

---

## 📝 チャット機能の変更について

**現在の実装:**
- `app/api/chat/route.ts` - チャットAPI（OpenAI GPT-3.5-turbo使用）
- `app/components/ContextAwareChat.tsx` - コンテキスト対応チャット
- `app/components/ChatButton.tsx` - チャットボタン

**変更予定:**
- チャット機能は後で変更するため、現時点では問題演習と分析機能を優先

**注意:**
- チャット機能を変更する際は、既存の実装を確認してから変更すること
- ユニット別チャット機能（`ContextAwareChat`）の動作を確認すること

---

## 🚀 次のステップ

1. **問題演習（300問）の実装**
   - `app/api/quiz-questions/route.ts`を修正
   - `app/quiz/page.tsx`に300問オプションを追加
   - 動作確認

2. **分析機能の確認・強化**
   - `app/analytics/page.tsx`の実装を確認
   - 不足している機能を追加
   - 可視化の強化

3. **チャット機能の変更**（後回し）
   - 問題演習と分析機能の実装完了後に対応

---

**最終更新**: 2025-01-03  
**状態**: 問題演習（300問）と分析機能の追加準備完了、実装待ち


