# メールアドレスによる購入状態復元のセットアップガイド

## 実装内容

購入状態をメールアドレスで復元できる機能を実装しました。

### 実装したファイル

1. **`app/api/webhook/stripe/route.ts`** - Stripe Webhook（購入完了時にメールアドレスを保存）
2. **`app/api/verify-email/route.ts`** - メールアドレスで購入状態を確認するAPI
3. **`app/api/restore-purchase/route.ts`** - メールアドレスで購入状態を復元するAPI
4. **`app/purchase/restore/page.tsx`** - 購入状態復元ページ
5. **`app/utils/purchase.ts`** - 購入状態管理ユーティリティ（メールアドレス復元機能を追加）

---

## セットアップ手順

### ステップ1: Vercel KVのセットアップ

#### 1.1 VercelダッシュボードでKVストレージを作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクトを選択
3. **Storage** タブを開く
4. **Create Database** をクリック
5. **KV** を選択して作成

#### 1.2 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

- `KV_REST_API_URL` - KV REST API URL（自動生成）
- `KV_REST_API_TOKEN` - KV REST API Token（自動生成）

**ローカル開発環境の場合**:
`.env.local` ファイルに以下を追加：

```env
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

---

### ステップ2: Stripe Webhookのセットアップ

#### 2.1 Stripe CLIを使用してWebhookをローカルでテスト（開発環境）

```bash
# Stripe CLIをインストール（未インストールの場合）
# macOS: brew install stripe/stripe-cli/stripe
# その他: https://stripe.com/docs/stripe-cli

# Webhookをローカルでフォワーディング
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

このコマンドを実行すると、`STRIPE_WEBHOOK_SECRET` が表示されます。
`.env.local` に追加してください：

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 2.2 本番環境でのWebhook設定

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) にログイン
2. **Add endpoint** をクリック
3. **Endpoint URL** に以下を入力：
   ```
   https://your-domain.com/api/webhook/stripe
   ```
4. **Events to listen to** で以下を選択：
   - `checkout.session.completed`
5. **Add endpoint** をクリック
6. **Signing secret** をコピーして、Vercelの環境変数に `STRIPE_WEBHOOK_SECRET` として設定

---

### ステップ3: パッケージのインストール

```bash
npm install
```

`@vercel/kv` パッケージがインストールされます。

---

### ステップ4: 動作確認

#### 4.1 ローカル環境でテスト

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. Stripe CLIでWebhookをフォワーディング（別ターミナル）：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. テスト購入を実行：
   - テストカードで購入
   - Webhookが正常に動作することを確認

4. 購入状態復元ページでテスト：
   - `http://localhost:3000/purchase/restore` にアクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が復元されることを確認

#### 4.2 本番環境でテスト

1. Vercelにデプロイ
2. 本番環境でテスト購入を実行
3. 購入状態復元ページでテスト

---

## 使い方

### ユーザー向け

1. **購入時**: 通常通りStripe Checkoutで決済完了
2. **別の端末で利用する場合**:
   - `/purchase/restore` にアクセス
   - 購入時に使用したメールアドレスを入力
   - 「購入状態を復元」ボタンをクリック
   - 購入状態が復元され、有料コンテンツにアクセス可能

### 開発者向け

#### 購入状態の確認

```typescript
import { verifyPurchaseByEmail } from '@/utils/purchase';

const result = await verifyPurchaseByEmail('user@example.com');
if (result.purchased) {
  console.log('購入済み:', result);
}
```

#### 購入状態の復元

```typescript
import { restorePurchaseByEmail } from '@/utils/purchase';

const result = await restorePurchaseByEmail('user@example.com');
if (result.success) {
  console.log('復元成功');
}
```

---

## データ構造

### Vercel KVに保存されるデータ

**キー**: `purchase:{email}`

**値**:
```json
{
  "purchased": true,
  "purchasedAt": 1704067200000,
  "sessionId": "cs_test_..."
}
```

**TTL**: 1年間（365日）

---

## トラブルシューティング

### Webhookが動作しない

1. **Webhookシークレットが正しいか確認**
   - `.env.local` と Vercelの環境変数を確認
   - Stripe DashboardのWebhookシークレットと一致しているか確認

2. **Webhookのログを確認**
   - Stripe Dashboard → Webhooks → エンドポイント → ログ
   - エラーメッセージを確認

3. **ローカル開発環境の場合**
   - Stripe CLIでWebhookをフォワーディングしているか確認
   - `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### 購入状態が復元されない

1. **メールアドレスが正しいか確認**
   - Stripe Checkoutで入力したメールアドレスと一致しているか
   - 大文字小文字は区別されませんが、スペースや特殊文字に注意

2. **Vercel KVの接続を確認**
   - 環境変数が正しく設定されているか
   - Vercel DashboardでKVストレージが作成されているか

3. **購入履歴を確認**
   - Stripe Dashboardで購入が完了しているか確認
   - Webhookが正常に動作しているか確認

### Vercel KVへのアクセスエラー

1. **環境変数の確認**
   - `KV_REST_API_URL` と `KV_REST_API_TOKEN` が設定されているか
   - Vercel Dashboardの環境変数と一致しているか

2. **KVストレージの作成確認**
   - Vercel Dashboard → Storage でKVストレージが作成されているか確認

3. **パッケージのインストール確認**
   - `npm install` で `@vercel/kv` がインストールされているか確認

---

## セキュリティに関する注意事項

1. **Webhookシークレットの保護**
   - Webhookシークレットは機密情報です
   - `.env.local` をGitにコミットしないでください
   - `.gitignore` に `.env.local` が含まれているか確認

2. **メールアドレスの検証**
   - メールアドレスの形式を検証していますが、追加の検証が必要な場合は実装してください

3. **レート制限**
   - 本番環境では、APIエンドポイントにレート制限を追加することを推奨します
   - VercelのFunction Execution Timeoutに注意（無料枠は10秒）

---

## コスト

### Vercel KV

- **無料枠**: 1日あたり100,000リクエスト
- **有料プラン**: $5/月から（1日あたり1,000,000リクエスト）

小規模なアプリであれば、無料枠で十分です。

---

## 次のステップ

1. **エラーハンドリングの強化**
   - より詳細なエラーメッセージ
   - ログの改善

2. **レート制限の追加**
   - APIエンドポイントにレート制限を追加

3. **メール通知の追加**（オプション）
   - 購入完了時にメールを送信
   - 購入状態復元時にメールを送信

4. **学習履歴の同期**（将来の機能）
   - 学習履歴もサーバーサイドで保存
   - 端末を変えても学習履歴が続く

---

## 関連ドキュメント

- [EMAIL_BASED_PURCHASE_RESTORE_IMPLEMENTATION.md](./EMAIL_BASED_PURCHASE_RESTORE_IMPLEMENTATION.md) - 実装の詳細
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

