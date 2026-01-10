# 次のステップ：メールアドレスによる購入状態復元のセットアップ

## ✅ 実装完了した内容

1. ✅ Stripe Webhook（購入完了時にメールアドレスを保存）
2. ✅ メールアドレス確認API
3. ✅ 購入状態復元API
4. ✅ 購入状態復元ページ（`/purchase/restore`）
5. ✅ 購入状態管理ユーティリティの更新
6. ✅ 購入ページに「購入済みの方はこちら」リンクを追加
7. ✅ ローカル開発環境用のフォールバック実装

---

## 📋 本番環境デプロイ前に必要な対応

### ステップ1: パッケージのインストール

ターミナルで以下を実行：

```bash
npm install
```

`@vercel/kv` パッケージがインストールされます。

---

### ステップ2: Vercel KVのセットアップ（本番環境）

#### 2.1 VercelダッシュボードでKVストレージを作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクトを選択
3. **Storage** タブを開く
4. **Create Database** をクリック
5. **KV** を選択して作成

#### 2.2 環境変数を設定

Vercelダッシュボードの **Settings** → **Environment Variables** で以下を追加：

- `KV_REST_API_URL` - KV REST API URL（KV作成時に自動生成）
- `KV_REST_API_TOKEN` - KV REST API Token（KV作成時に自動生成）

**既存の環境変数**も確認：
- `STRIPE_SECRET_KEY` - Stripe秘密鍵（本番環境用）
- `STRIPE_WEBHOOK_SECRET` - Webhookシークレット（次のステップで設定）
- `NEXT_PUBLIC_APP_URL` - アプリのURL（例: `https://your-domain.com`）

---

### ステップ3: Stripe Webhookのセットアップ（本番環境）

#### 3.1 Webhookエンドポイントの作成

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) にログイン
2. **Add endpoint** をクリック
3. **Endpoint URL** に以下を入力：
   ```
   https://your-domain.com/api/webhook/stripe
   ```
   （`your-domain.com` は実際のドメインに置き換え）

4. **Events to listen to** で以下を選択：
   - `checkout.session.completed`

5. **Add endpoint** をクリック

#### 3.2 Webhookシークレットの設定

1. 作成したWebhookエンドポイントをクリック
2. **Signing secret** をコピー
3. Vercelダッシュボードの **Settings** → **Environment Variables** で以下を追加：
   - `STRIPE_WEBHOOK_SECRET` - コピーしたSigning secretを貼り付け

---

### ステップ4: ローカル開発環境の設定（オプション）

ローカルでテストする場合は、`.env.local` ファイルに以下を追加：

```env
# Stripe（開発環境用）
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel KV（本番環境でのみ必要、ローカルではフォールバック動作）
# KV_REST_API_URL=...
# KV_REST_API_TOKEN=...

# アプリのURL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**注意**: ローカル環境では、Vercel KVがなくてもメモリ内ストレージで動作します（アプリを再起動するとデータは消えます）。

---

## 🧪 テスト手順

### ローカル環境でのテスト

1. **開発サーバーを起動**：
   ```bash
   npm run dev
   ```

2. **Stripe CLIでWebhookをフォワーディング**（別ターミナル）：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
   このコマンドを実行すると、`STRIPE_WEBHOOK_SECRET` が表示されます。
   `.env.local` に追加してください。

3. **テスト購入を実行**：
   - テストカード（`4242 4242 4242 4242`）で購入
   - Webhookが正常に動作することを確認

4. **購入状態復元ページでテスト**：
   - `http://localhost:3000/purchase/restore` にアクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が復元されることを確認

### 本番環境でのテスト

1. **Vercelにデプロイ**：
   ```bash
   git add .
   git commit -m "Add email-based purchase restore feature"
   git push
   ```

2. **本番環境でテスト購入を実行**：
   - 実際のカードで購入（またはテストモードで）
   - Webhookが正常に動作することを確認

3. **購入状態復元ページでテスト**：
   - `https://your-domain.com/purchase/restore` にアクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が復元されることを確認

---

## 🔍 トラブルシューティング

### Webhookが動作しない場合

1. **Webhookシークレットを確認**
   - Stripe DashboardのWebhookエンドポイントで「Signing secret」を確認
   - Vercelの環境変数と一致しているか確認

2. **Webhookのログを確認**
   - Stripe Dashboard → Webhooks → エンドポイント → ログ
   - エラーメッセージを確認

3. **エンドポイントURLを確認**
   - `https://your-domain.com/api/webhook/stripe` が正しいか確認
   - デプロイが完了しているか確認

### 購入状態が復元されない場合

1. **メールアドレスを確認**
   - Stripe Checkoutで入力したメールアドレスと一致しているか
   - 大文字小文字は区別されませんが、スペースや特殊文字に注意

2. **Vercel KVの接続を確認**
   - Vercel DashboardでKVストレージが作成されているか
   - 環境変数が正しく設定されているか

3. **購入履歴を確認**
   - Stripe Dashboardで購入が完了しているか
   - Webhookが正常に動作しているか

### Vercel KVへのアクセスエラー

1. **環境変数の確認**
   - `KV_REST_API_URL` と `KV_REST_API_TOKEN` が設定されているか
   - Vercel Dashboardの環境変数と一致しているか

2. **KVストレージの作成確認**
   - Vercel Dashboard → Storage でKVストレージが作成されているか確認

---

## 📚 関連ドキュメント

- `EMAIL_PURCHASE_RESTORE_SETUP.md` - 詳細なセットアップガイド
- `EMAIL_BASED_PURCHASE_RESTORE_IMPLEMENTATION.md` - 実装の詳細
- `LOCAL_STORAGE_DATA_MANAGEMENT.md` - ローカルストレージの管理について

---

## ✅ チェックリスト

デプロイ前に以下を確認：

- [ ] `npm install` を実行してパッケージをインストール
- [ ] Vercel KVストレージを作成
- [ ] Vercelの環境変数に `KV_REST_API_URL` を設定
- [ ] Vercelの環境変数に `KV_REST_API_TOKEN` を設定
- [ ] Stripe Webhookエンドポイントを作成
- [ ] Vercelの環境変数に `STRIPE_WEBHOOK_SECRET` を設定
- [ ] 本番環境でテスト購入を実行
- [ ] 購入状態復元ページで動作確認

---

## 🎉 完了後の動作

実装完了後、以下のように動作します：

1. **購入時**：
   - Stripe Checkoutで決済完了
   - Webhookが発火してメールアドレスと購入状態をVercel KVに保存
   - クライアント側のlocalStorageに購入状態を保存

2. **別の端末で利用時**：
   - `/purchase` ページの「購入済みの方はこちら」リンクをクリック
   - または `/purchase/restore` に直接アクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が復元され、有料コンテンツにアクセス可能

---

実装は完了しています。上記のセットアップを行えば、すぐに利用できます！

