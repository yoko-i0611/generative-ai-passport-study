# メールアドレスによる購入状態復元の実装案

## 実装パターンの比較

### パターン1: 購入状態のみサーバーサイドで保存（推奨）

**概要**: 購入状態のみをメールアドレスで復元可能にする。学習履歴は現状通りlocalStorageに保存。

#### 実装内容

##### 1. データ保存方法
- **簡易版（推奨）**: Vercel KV（Key-Valueストレージ）を使用
  - メールアドレスをキーとして購入状態を保存
  - 無料枠あり（1日あたり100,000リクエスト）
  - 実装が簡単

- **本格版**: Vercel Postgres または Supabase
  - 購入履歴をテーブルで管理
  - より堅牢だが初期設定が必要

##### 2. 必要な実装

**ファイル一覧**:
```
app/api/webhook/stripe/route.ts          # Stripe Webhook（購入完了時にメールアドレスと購入状態を保存）
app/api/verify-email/route.ts            # メールアドレスで購入状態を確認するAPI
app/api/restore-purchase/route.ts        # メールアドレスで購入状態を復元するAPI
app/purchase/restore/page.tsx            # 購入状態復元ページ（メールアドレス入力）
app/utils/purchase.ts                    # 購入状態管理ユーティリティ（サーバーサイド確認を追加）
app/components/PurchaseGuard.tsx         # 購入ガード（サーバーサイド確認を追加）
```

**実装ステップ**:

1. **Stripe Webhookの実装** (1-2日)
   - `checkout.session.completed`イベントを受信
   - セッションIDからメールアドレスを取得
   - メールアドレスと購入状態を保存

2. **メールアドレス確認API** (0.5日)
   - メールアドレスで購入状態を確認
   - 購入済みかどうかを返す

3. **購入状態復元API** (0.5日)
   - メールアドレスで購入状態を確認
   - 購入済みの場合、クライアント側に購入状態を設定

4. **購入状態復元ページ** (1日)
   - メールアドレス入力フォーム
   - 復元ボタン
   - エラーハンドリング

5. **購入状態管理ユーティリティの更新** (0.5日)
   - クライアント側のlocalStorage確認に加えて、サーバーサイド確認を追加
   - メールアドレスで復元する機能を追加

6. **PurchaseGuardの更新** (0.5日)
   - サーバーサイド確認を追加（必要に応じて）

7. **テスト・デバッグ** (1日)

**合計実装日数**: 約5-6日

**技術スタック**:
- Vercel KV（推奨）または Vercel Postgres / Supabase
- Stripe Webhook
- Next.js API Routes

**メリット**:
- ✅ 実装が比較的簡単
- ✅ 購入状態はどの端末でも復元可能
- ✅ 学習履歴は現状通り（ローカルに保存）
- ✅ サーバーコストが低い（Vercel KVの無料枠で十分）

**デメリット**:
- ⚠️ 学習履歴は端末ごとに独立（ユーザーが期待する可能性がある）
- ⚠️ 購入状態の復元にメールアドレス入力が必要

---

### パターン2: 購入状態 + 学習履歴もサーバーサイドで保存

**概要**: 購入状態と学習履歴の両方をメールアドレスで復元可能にする。

#### 実装内容

##### 1. データ保存方法
- **必須**: データベース（Vercel Postgres または Supabase）
  - 購入履歴テーブル
  - 学習履歴テーブル
  - メールアドレスをキーとして関連付け

##### 2. 必要な実装

**ファイル一覧**:
```
app/api/webhook/stripe/route.ts          # Stripe Webhook（購入完了時にメールアドレスと購入状態を保存）
app/api/verify-email/route.ts            # メールアドレスで購入状態を確認するAPI
app/api/restore-purchase/route.ts        # メールアドレスで購入状態を復元するAPI
app/api/sync-history/route.ts            # 学習履歴をサーバーに同期するAPI
app/api/get-history/route.ts             # 学習履歴を取得するAPI
app/purchase/restore/page.tsx            # 購入状態復元ページ（メールアドレス入力）
app/utils/purchase.ts                    # 購入状態管理ユーティリティ（サーバーサイド確認を追加）
app/utils/learningHistory.ts             # 学習履歴管理（サーバー同期機能を追加）
app/components/PurchaseGuard.tsx         # 購入ガード（サーバーサイド確認を追加）
```

**データベーススキーマ**:
```sql
-- 購入履歴テーブル
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) NOT NULL,
  purchased_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 学習履歴テーブル
CREATE TABLE learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  session_data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (email) REFERENCES purchases(email)
);

CREATE INDEX idx_learning_history_email ON learning_history(email);
```

**実装ステップ**:

1. **データベースのセットアップ** (1日)
   - Vercel Postgres または Supabase のセットアップ
   - テーブルの作成
   - マイグレーションスクリプト

2. **Stripe Webhookの実装** (1-2日)
   - `checkout.session.completed`イベントを受信
   - セッションIDからメールアドレスを取得
   - 購入履歴をデータベースに保存

3. **購入状態確認・復元API** (1日)
   - メールアドレスで購入状態を確認
   - 購入状態を復元

4. **学習履歴同期API** (2-3日)
   - クライアント側の学習履歴をサーバーに送信
   - サーバー側の学習履歴をクライアントに取得
   - マージロジック（最新の履歴を優先）

5. **学習履歴管理の更新** (2-3日)
   - `LearningHistoryManager`にサーバー同期機能を追加
   - localStorageに加えてサーバーにも保存
   - 起動時にサーバーから履歴を取得してマージ

6. **購入状態復元ページ** (1日)
   - メールアドレス入力フォーム
   - 復元ボタン
   - エラーハンドリング

7. **ユーザー認証フロー** (1-2日)
   - メールアドレス入力後の確認
   - セッション管理（クライアント側にメールアドレスを保存）

8. **テスト・デバッグ** (2-3日)
   - 同期ロジックのテスト
   - マージロジックのテスト
   - エッジケースのテスト

**合計実装日数**: 約12-16日

**技術スタック**:
- Vercel Postgres または Supabase（必須）
- Stripe Webhook
- Next.js API Routes
- データベースクライアント（@vercel/postgres または Supabase Client）

**メリット**:
- ✅ 購入状態と学習履歴の両方がどの端末でも復元可能
- ✅ ユーザー体験が向上（端末を変えても履歴が続く）
- ✅ データのバックアップができる

**デメリット**:
- ⚠️ 実装が複雑（工数が約2-3倍）
- ⚠️ データベースのコストがかかる（Vercel Postgresは有料）
- ⚠️ 同期ロジックの実装が必要（コンフリクト処理など）
- ⚠️ プライバシーポリシーの更新が必要（サーバーに学習履歴を保存）

---

## 推奨パターン

### ✅ **パターン1: 購入状態のみサーバーサイドで保存（推奨）**

**理由**:
1. **実装が簡単**: 約5-6日で完了可能
2. **コストが低い**: Vercel KVの無料枠で十分（または小規模なデータベース）
3. **ユーザーの主な要望を満たす**: 「どの端末でも購入した内容を利用したい」という要望に対応
4. **学習履歴は現状維持**: 規約に記載済み（端末を跨げない）ため、ユーザーも理解している可能性が高い

**実装の優先順位**:
1. **最優先**: 購入状態のメールアドレス復元
   - ユーザーの主な要望
   - 実装が簡単
   - コストが低い

2. **将来検討**: 学習履歴のサーバー同期
   - ユーザーからの要望があれば検討
   - 実装が複雑なので、まずは購入状態の復元を優先

---

## パターン1の詳細実装手順

### ステップ1: Vercel KVのセットアップ（推奨）またはデータベースのセットアップ

#### Vercel KVの場合（推奨）

1. VercelダッシュボードでKVストレージを作成
2. 環境変数に`KV_REST_API_URL`と`KV_REST_API_TOKEN`を追加

#### データベースの場合

1. Vercel Postgres または Supabase のセットアップ
2. テーブルの作成

### ステップ2: Stripe Webhookの実装

`app/api/webhook/stripe/route.ts`を作成：
- `checkout.session.completed`イベントを受信
- セッションIDからメールアドレスを取得（`session.customer_details.email`）
- メールアドレスと購入状態を保存

### ステップ3: メールアドレス確認API

`app/api/verify-email/route.ts`を作成：
- メールアドレスで購入状態を確認
- 購入済みかどうかを返す

### ステップ4: 購入状態復元API

`app/api/restore-purchase/route.ts`を作成：
- メールアドレスで購入状態を確認
- 購入済みの場合、クライアント側に購入状態を設定するための認証トークンを返す

### ステップ5: 購入状態復元ページ

`app/purchase/restore/page.tsx`を作成：
- メールアドレス入力フォーム
- 復元ボタン
- エラーハンドリング

### ステップ6: 購入状態管理ユーティリティの更新

`app/utils/purchase.ts`を更新：
- メールアドレスで復元する機能を追加
- サーバーサイド確認を追加（必要に応じて）

---

## 実装後の動作

### 購入時
1. Stripe Checkoutで決済完了
2. Webhookが発火してメールアドレスと購入状態をサーバーに保存
3. クライアント側のlocalStorageに購入状態を保存

### 別の端末で利用時
1. ユーザーがメールアドレスを入力
2. サーバーで購入状態を確認
3. 購入済みの場合、クライアント側のlocalStorageに購入状態を設定
4. 以後、その端末では購入状態が有効

### 学習履歴
- 現状通り、各端末のlocalStorageに保存
- 端末を変えても学習履歴は共有されない（規約に記載済み）

---

## コスト試算

### パターン1（購入状態のみ）

**Vercel KVの場合**:
- 無料枠: 1日あたり100,000リクエスト
- 小規模なアプリであれば無料枠で十分

**データベースの場合**:
- Vercel Postgres: $20/月（最小プラン）
- Supabase: 無料枠あり（500MB）

### パターン2（購入状態 + 学習履歴）

**データベース必須**:
- Vercel Postgres: $20/月（最小プラン）
- Supabase: 無料枠あり（500MB）→ 学習履歴が増えると有料プランが必要な可能性

---

## まとめ

| 項目 | パターン1（購入状態のみ） | パターン2（購入状態+学習履歴） |
|------|------------------------|---------------------------|
| **実装日数** | 約5-6日 | 約12-16日 |
| **実装難易度** | 中 | 高 |
| **コスト** | 無料〜低 | 中〜高 |
| **ユーザー体験** | 購入状態の復元が可能 | 購入状態と学習履歴の復元が可能 |
| **推奨度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**結論**: パターン1（購入状態のみサーバーサイドで保存）を推奨します。

