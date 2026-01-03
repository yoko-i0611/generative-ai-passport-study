# TOP問題演習更新とユニット教材改訂の進捗

**作成日**: 2025-01-03  
**目的**: TOPの問題演習を更新し、ユニットの教材改訂と確認テストの統合を完了

---

## ✅ 完了した作業

### 1. TOPページの完全な復元
- ✅ `app.backup_before_git_restore/page.tsx`から復元（458行、21KB）
- ✅ ファイルサイズを確認済み

### 2. TOPの問題演習の更新
- ✅ 問題演習API（`app/api/quiz-questions/route.ts`）を更新
  - `public/app_questions_300.json`から問題を読み込むように変更
  - 300問の問題データを正しく取得できるように修正
- ✅ `unit_quizzes_all.json`を`public/`にコピー済み
- ✅ ユニットごとの確認テストを読み込むユーティリティ（`app/lib/unitQuizzes.ts`）を作成

---

## 📋 現在の状況

### 問題データの確認結果

#### 1. 全300問の問題演習データ
- **ファイル**: `public/app_questions_300.json`（342KB）
- **用途**: TOPページの「問題演習に挑戦」ボタンからアクセス
- **内容**: 300問（第1章75問、第2章53問、第3章49問、第4章61問、第5章60問）
- **第4版シラバスの追加項目**: 大部分が含まれている

#### 2. ユニットごとの確認テストデータ
- **ファイル**: `public/unit_quizzes_all.json`（127KB）
- **用途**: 各章の学習ページで、ユニットごとに確認テストを行う
- **内容**: 22ユニット、117問
  - 第1章: 4ユニット、15問
  - 第2章: 6ユニット、23問
  - 第3章: 4ユニット、39問
  - 第4章: 4ユニット、20問
  - 第5章: 4ユニット、20問

---

## 🔄 次の作業：ユニットの教材改訂と確認テストの統合

### 現在の各章のページの構造

各章のページ（`app/courses/chapter*/page.tsx`）は現在、古い構造になっています：
- `courses`から問題を取得
- シンプルなタブ切り替え（学習内容/問題演習）

### 必要な作業

#### 1. ユニットの教材改訂（第4版シラバス準拠）

各章のページを更新して、以下の構造にする必要があります：

```typescript
// 新しい構造の例（chapter1/page.tsx）
const newChapter1Sections = [
  {
    id: 'unit01-ai-definition-history',
    title: 'AIの定義と歴史',
    unitPoint: '...',
    learningTips: '...',
    cardDisplay: {
      slideImage: '/images/ch1_unit01_ai_history.png',
      keyPoints: [...],
      versionInfo: { version: '4.0', lastUpdated: '2024-12' }
    },
    importantExplanations: [...],
    textContent: '...',
    quizQuestions: [...] // ← unit_quizzes_all.jsonから読み込む
  },
  // ... 他のユニット
];
```

#### 2. 確認テストの統合

`unit_quizzes_all.json`から確認テストを読み込んで、各ユニットに統合：

```typescript
// unit_quizzes_all.jsonから確認テストを読み込む
const [unitQuizzes, setUnitQuizzes] = useState<UnitQuizSection[]>([]);

useEffect(() => {
  loadUnitQuizzes().then(data => {
    const chapterQuizzes = getUnitQuizzesByChapter(1, data);
    // 各セクションに確認テストを統合
    newChapter1Sections.forEach(section => {
      const quiz = getUnitQuizBySectionId(section.id, chapterQuizzes);
      if (quiz) {
        section.quizQuestions = quiz.questions;
      }
    });
    setUnitQuizzes(chapterQuizzes);
  });
}, []);
```

#### 3. HybridContentCardコンポーネントの使用

各ユニットを`HybridContentCard`コンポーネントで表示し、確認テストボタンを統合：

```typescript
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
    quizQuestions={section.quizQuestions} // ← unit_quizzes_all.jsonから読み込んだ確認テスト
    sectionId={section.id}
    onOpenQuiz={handleOpenUnitQuiz}
  />
))}
```

---

## 📝 作業の優先順位

### 最優先
1. ✅ **TOPページの完全な復元** - 完了
2. ✅ **TOPの問題演習の更新** - 完了
3. **ユニットの教材改訂（第4版シラバス準拠）**
   - 各章のページを新しい構造に更新
   - 第4版シラバスの追加項目を含む教材に更新

### 高優先度
4. **ユニットの教材に確認テストを統合**
   - `unit_quizzes_all.json`から確認テストを読み込む
   - 各ユニットに確認テストボタンを追加
   - `UnitQuizModal`で確認テストを表示

---

## 🔍 確認が必要な項目

### 1. 各章のページの現在の構造
- [ ] `app/courses/chapter1/page.tsx`の構造を確認
- [ ] `app/courses/chapter2/page.tsx`の構造を確認
- [ ] `app/courses/chapter3/page.tsx`の構造を確認
- [ ] `app/courses/chapter4/page.tsx`の構造を確認
- [ ] `app/courses/chapter5/page.tsx`の構造を確認

### 2. HybridContentCardコンポーネントの存在確認
- [ ] `app/components/HybridContentCard.tsx`が存在するか確認
- [ ] `app/components/UnitQuizModal.tsx`が存在するか確認

### 3. 教材データの確認
- [ ] 第4版シラバス準拠の教材データが存在するか確認
- [ ] `learning-content.yaml`などの教材データファイルの確認

---

## 🚀 次のステップ

### ステップ1: 各章のページの構造確認
各章のページがどのような構造になっているか確認し、新しい構造（`newChapter1Sections`など）を使っているか確認

### ステップ2: 教材データの確認
第4版シラバス準拠の教材データがどこに存在するか確認

### ステップ3: ユニットの教材改訂
各章のページを新しい構造に更新し、第4版シラバス準拠の教材に更新

### ステップ4: 確認テストの統合
`unit_quizzes_all.json`から確認テストを読み込んで、各ユニットに統合

---

**最終更新**: 2025-01-03  
**次の作業**: 各章のページの構造確認と教材データの確認


