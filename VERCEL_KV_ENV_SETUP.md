# Vercel KV環境変数の設定手順

## ✅ Redisデータベース作成完了

データベース名: `generative-ai-passport-purchase`  
リージョン: Tokyo, Japan (Northeast)  
プラン: Redis/30 MB（無料プラン）

---

## 📋 環境変数の確認・設定手順

### ステップ1: 環境変数の自動設定を確認

Vercel KV（Redis）を作成すると、**通常は自動的に環境変数が設定されます**。

1. **Vercel Dashboard** にアクセス
2. プロジェクトを選択
3. **Settings** タブをクリック
4. **Environment Variables** をクリック

以下の環境変数が自動的に追加されているか確認してください：

- ✅ `KV_REST_API_URL` - Redis REST API URL
- ✅ `KV_REST_API_TOKEN` - Redis REST API Token

### ステップ2: 環境変数が見つからない場合

もし自動設定されていない場合は、以下の手順で手動設定します：

#### 2.1 Redisデータベースの接続情報を取得

1. **Vercel Dashboard** → **Storage** タブ
2. 作成したRedisデータベース（`generative-ai-passport-purchase`）をクリック
3. **Settings** または **Connect** タブを確認
4. 以下の情報を確認：
   - **REST API URL** または **Endpoint URL**
   - **REST API Token** または **Password/Token**

#### 2.2 環境変数を手動で追加

1. **Vercel Dashboard** → プロジェクト → **Settings** → **Environment Variables**
2. **Add New** または **Add Environment Variable** をクリック
3. 以下の環境変数を追加：

**環境変数1:**
- **Key**: `KV_REST_API_URL`
- **Value**: Redis REST API URL（例: `https://xxx.upstash.io`）
- **Environment**: Production, Preview, Development（すべてにチェック）

**環境変数2:**
- **Key**: `KV_REST_API_TOKEN`
- **Value**: Redis REST API Token（例: `AXxxxxxx`）
- **Environment**: Production, Preview, Development（すべてにチェック）

4. **Save** をクリック

### ステップ3: 環境変数の確認方法

#### 3.1 Vercel Dashboardで確認

1. **Settings** → **Environment Variables**
2. 以下の環境変数が存在することを確認：
   ```
   KV_REST_API_URL        ✅ 設定済み
   KV_REST_API_TOKEN      ✅ 設定済み
   ```

#### 3.2 ローカル環境での確認（オプション）

ローカル開発環境でも使用する場合は、`.env.local` ファイルに以下を追加：

```env
KV_REST_API_URL=your_redis_rest_api_url
KV_REST_API_TOKEN=your_redis_rest_api_token
```

**注意**: ローカル環境では、環境変数がなくてもメモリ内ストレージで動作します（アプリ再起動でデータは消えます）。

---

## 🔍 環境変数の取得方法（詳細）

### 方法1: Storageタブから確認

1. **Vercel Dashboard** → **Storage** タブ
2. `generative-ai-passport-purchase` をクリック
3. **Settings** または **Details** タブを確認
4. 接続情報が表示されている場合、そこからコピー

### 方法2: Redisデータベースのページから確認

1. Redisデータベースのページを開く
2. **Connect** または **Connection** セクションを探す
3. **REST API** セクションから：
   - **Endpoint URL** → `KV_REST_API_URL` の値
   - **Token** → `KV_REST_API_TOKEN` の値

### 方法3: 自動設定の確認

多くの場合、Vercel KVを作成すると、**自動的にプロジェクトにリンクされ、環境変数も自動設定されます**。

1. **Settings** → **Environment Variables** で確認
2. 自動設定されていない場合のみ、上記の方法で手動設定

---

## ✅ 確認チェックリスト

環境変数の設定が完了したら、以下を確認：

- [ ] `KV_REST_API_URL` が設定されている
- [ ] `KV_REST_API_TOKEN` が設定されている
- [ ] 環境変数がProduction, Preview, Developmentすべてに適用されている
- [ ] 環境変数の値が正しい（空欄でない）

---

## 🧪 動作確認

### ステップ1: デプロイ

環境変数を設定した後、デプロイが必要な場合があります：

```bash
git add .
git commit -m "Add KV environment variables"
git push
```

### ステップ2: テスト購入を実行

1. 本番環境でテスト購入を実行
2. Stripe Webhookが正常に動作することを確認
3. `/purchase/restore` で購入状態が復元されることを確認

---

## 🔧 トラブルシューティング

### 環境変数が見つからない場合

1. **Redisデータベースがプロジェクトにリンクされているか確認**
   - Storageタブで、データベースがプロジェクトにリンクされているか確認
   - リンクされていない場合は、プロジェクトにリンクする必要があります

2. **手動で環境変数を追加**
   - 上記の「ステップ2」を参照

### 環境変数が正しく動作しない場合

1. **値が正しいか確認**
   - URLとTokenが正しくコピーされているか
   - スペースや改行が入っていないか

2. **デプロイ後に確認**
   - 環境変数を追加した後、再デプロイが必要な場合があります

---

## 📚 関連ドキュメント

- [Vercel Storage Documentation](https://vercel.com/docs/storage)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- `NEXT_STEPS.md` - 次のステップ全体のガイド

---

環境変数の設定が完了したら、次はStripe Webhookのセットアップに進みましょう！

