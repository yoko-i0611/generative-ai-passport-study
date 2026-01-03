# 構造変更チェックリスト

**使用目的**: 新しい構造への移行時に、エラーを防ぐためのチェックリスト

---

## 📋 変更前の確認

変更を始める前に、以下を確認してください：

```bash
# 1. 状態確認スクリプトを実行
npm run check:before-change

# または手動で確認
git status
npm run build
npm run lint
```

- [ ] Gitの状態がクリーン（未コミットの変更がない）
- [ ] ビルドが成功する
- [ ] リンターエラーがない
- [ ] ブラウザで正常に表示される

---

## 🔄 Phase 1: インポートの追加

### 変更内容
```typescript
import HybridContentCard from '../../components/HybridContentCard';
import UnitQuizModal from '../../components/UnitQuizModal';
import { loadUnitQuizzes, getUnitQuizzesByChapter, getUnitQuizBySectionId } from '../../lib/unitQuizzes';
```

### 確認事項
- [ ] インポート文を追加
- [ ] **Phaseチェックを実行**: `npm run phase-check 1`
- [ ] ビルドエラーがない
- [ ] リンターエラーがない
- [ ] ブラウザでエラーが出ない（F12でコンソール確認）
- [ ] **コミット**: `git commit -m "Phase 1: インポート追加"`

---

## 📊 Phase 2: データ構造の準備

### 変更内容
```typescript
const newChapter1Sections = [
  // データ構造を定義
];
```

### 確認事項
- [ ] データ構造を定義
- [ ] **Phaseチェックを実行**: `npm run phase-check 2`
- [ ] ビルドエラーがない
- [ ] リンターエラーがない
- [ ] ブラウザでエラーが出ない
- [ ] **コミット**: `git commit -m "Phase 2: データ構造準備"`

---

## ⚙️ Phase 3: ロジックの追加

### 変更内容
```typescript
useEffect(() => {
  const loadQuizzes = async () => {
    // ロジックを追加
  };
  loadQuizzes();
}, []);
```

### 確認事項
- [ ] useEffectやロジックを追加
- [ ] **Phaseチェックを実行**: `npm run phase-check 3`
- [ ] ビルドエラーがない
- [ ] リンターエラーがない
- [ ] ブラウザでエラーが出ない
- [ ] コンソールにエラーが出ない
- [ ] **コミット**: `git commit -m "Phase 3: ロジック追加"`

---

## 🎨 Phase 4: レンダリングの更新

### 変更内容
```typescript
{newChapter1Sections.map((section) => (
  <HybridContentCard
    // プロップスを設定
  />
))}
```

### 確認事項
- [ ] レンダリングロジックを更新
- [ ] **Phaseチェックを実行**: `npm run phase-check 4`
- [ ] ビルドエラーがない
- [ ] リンターエラーがない
- [ ] ブラウザで正常に表示される
- [ ] デザインが正しく表示される
- [ ] **コミット**: `git commit -m "Phase 4: レンダリング更新"`

---

## 🚨 エラーが発生した場合

### 即座に実行

```bash
# 1. 変更を元に戻す
git checkout -- app/courses/chapter1/page.tsx

# 2. ビルドキャッシュをクリア
rm -rf .next

# 3. 開発サーバーを再起動
npm run dev
```

### エラーの記録

- [ ] どのPhaseで発生したか記録
- [ ] エラーメッセージを記録
- [ ] 変更内容を記録
- [ ] 原因を特定
- [ ] 解決方法を検討

---

## ✅ 完了後の確認

すべてのPhaseが完了したら：

- [ ] すべてのPhaseでビルドが成功する
- [ ] すべてのPhaseでリンターエラーがない
- [ ] ブラウザで正常に表示される
- [ ] デザインが正しく表示される
- [ ] 機能が正常に動作する
- [ ] 最終コミット: `git commit -m "構造変更完了: chapter1"`

---

## 📝 使用例

```bash
# 1. 変更前の確認
npm run check:before-change

# 2. Phase 1の変更
# （インポートを追加）

# 3. Phase 1の確認
npm run phase-check 1

# 4. コミット
git add app/courses/chapter1/page.tsx
git commit -m "Phase 1: インポート追加"

# 5. Phase 2以降も同様に繰り返す
```

---

**最終更新**: 2025-01-03  
**状態**: チェックリスト作成完了

