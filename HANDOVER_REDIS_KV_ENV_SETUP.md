# Redis KV環境変数設定の引き継ぎ書

## 📋 現在の状況

### ✅ 完了している作業

1. **Redisデータベースの作成**
   - データベース名: `generative-ai-passport-purchase`
   - リージョン: Tokyo, Japan (Northeast)
   - プラン: Redis/30 MB（無料プラン）
   - 作成日: 2026年1月10日

2. **コード実装完了**
   - `@vercel/kv` パッケージを `package.json` に追加済み（バージョン: ^0.2.1）
   - すべての実装ファイルが完了（詳細は後述の「関連ファイル・ドキュメント」を参照）

### ⚠️ 現在の状況（確認済み）

**設定されている環境変数**:
- `REDIS_URL` - **All Environments** - Added 3h ago
  - 値: `redis://default:kREdc6eVYJS5Sj8QL37rWQeqEcpCKjDR@redis-10252.c290.ap-northeast-1-2.ec2.cloud.redislabs.com:10252`
  - ❌ **`redis://` で始まる直接接続用URLで、`@vercel/kv`では使用できません**

**問題点**:
1. `REDIS_URL` は直接接続用（`redis://` プロトコル）で、`@vercel/kv` では使用できません
2. `@vercel/kv` は REST API を使用するため、`https://` で始まるURLとTokenが必要です
3. 現在、`KV_REST_API_URL` と `KV_REST_API_TOKEN` は設定されていません
4. このデータベースは Redis Labs（`redis-10252.c290.ap-northeast-1-2.ec2.cloud.redislabs.com`）を使用しているようです

**必要な対応**:
- REST API用の環境変数 `KV_REST_API_URL` と `KV_REST_API_TOKEN` を取得して設定する必要があります

**必要な対応**:
- `REDIS_URL` の内容を確認
- もし `redis://` で始まる場合は、REST API用の `KV_REST_API_URL` と `KV_REST_API_TOKEN` を追加で設定する必要があります

**対応済み事項**:
- コードを修正し、以下の環境変数名の両方に対応しました：
  - `KV_REST_API_URL` / `KV_REST_API_TOKEN` (標準的なプレフィックス)
  - `STORAGE_REST_API_URL` / `STORAGE_REST_API_TOKEN` (カスタムプレフィックス)
  - `STORAGE_URL` / `STORAGE_REST_API_TOKEN` (Vercel自動生成形式)

---

## 🔍 必要な環境変数と現在の状況

### 現在設定されている環境変数

- ✅ `REDIS_URL` - All Environments（3時間前に追加）
  - ⚠️ **内容を確認する必要があります**

### 必要な環境変数（`@vercel/kv` を使用する場合）

コードは以下の環境変数名のいずれかに対応しています（優先順位順）：

### 対応している環境変数名（優先順位順）

1. **標準的なプレフィックス（推奨）**
   - `KV_REST_API_URL` - REST API URL
   - `KV_REST_API_TOKEN` - REST API Token

2. **カスタムプレフィックス（STORAGE）**
   - `STORAGE_REST_API_URL` - REST API URL
   - `STORAGE_REST_API_TOKEN` - REST API Token

3. **Vercel自動生成形式（STORAGE）**
   - `STORAGE_URL` - REST API URL
   - `STORAGE_REST_API_TOKEN` - REST API Token

### `REDIS_URL` 環境変数の確認が必要

**⚠️ 重要な確認事項**: 

現在設定されている `REDIS_URL` 環境変数の**値（内容）**を確認してください：

1. **`REDIS_URL` が `redis://` で始まる場合**:
   - ❌ **直接接続用URLで、`@vercel/kv`では使用できません**
   - REST API用の `KV_REST_API_URL` と `KV_REST_API_TOKEN` を追加で設定する必要があります

2. **`REDIS_URL` が `https://` で始まる場合**:
   - ✅ REST API URLとして使用できる可能性があります
   - しかし、`@vercel/kv` は通常 `KV_REST_API_URL` と `KV_REST_API_TOKEN` を期待します
   - コードを修正するか、環境変数名を変更する必要があるかもしれません

**確認済み**: `REDIS_URL` は `redis://` で始まる直接接続用URLです。

**必要な対応**:
- REST API用の `KV_REST_API_URL` と `KV_REST_API_TOKEN` を取得して設定する必要があります
- 以下の方法を試してください

---

## 🔍 REST API情報の取得方法

### ステップ1: 既存の環境変数を確認（まずこれを確認）

1. **Vercel Dashboard** → プロジェクト → **Settings** → **Environment Variables**
2. 以下の環境変数が既に設定されているか確認：
   - `STORAGE_REST_API_URL` または `STORAGE_URL`
   - `STORAGE_REST_API_TOKEN`

**もし既に設定されている場合** → **追加の設定は不要です！** コードは自動的に検出します。

### ステップ2: 環境変数が設定されていない場合

#### 方法1: Vercel StorageのQuickstartタブから取得（推奨）

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Quickstart** タブ
2. 環境変数の値が表示されているので、コピー
3. プロジェクトの **Settings** → **Environment Variables** に手動で追加

#### 方法2: Vercel StorageのConnect設定から確認

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings**
2. **「Manage Secrets in Redis」ボタン**をクリックしてUpstash管理画面へ移動
3. Upstash管理画面で **REST API** セクションを確認
4. REST API URLとTokenを取得

#### 補足: Redis Labsについて

**重要**: Vercel Storageで作成したKVデータベースは、通常**Upstash**が提供しています。Redis Labsの管理画面にログインする必要は**ありません**。

現在設定されている `redis://default:...@redis-10252...` という接続情報は、直接接続用URLです。これは参考情報として残しておいても構いませんが、REST API情報は上記の方法1または方法2で取得してください。

### 注意点

- **`redis://`のURLは使用しない** - これは直接接続用で、`@vercel/kv`では使用しません
- `@vercel/kv`は **REST API** を使用するため、`https://` で始まるURLが必要です
- 環境変数が設定されない場合、ローカル開発環境ではメモリ内ストレージで動作します（アプリ再起動でデータは消えます）
- **コードは `STORAGE_*` プレフィックスにも対応しているため、既存の接続を削除する必要はありません**

---

## 📝 次のステップ

### ステップ1: プロジェクトに接続して環境変数を自動設定（最も簡単・推奨）

**重要**: 新しいデータベースを作成した場合、Upstashが自動的に使用され、REST API情報が確実に取得できます。

**接続前の確認事項**:

1. **Custom Prefix** の設定を確認：
   - **`KV`** を選択（推奨）→ 環境変数名: `KV_REST_API_URL`、`KV_REST_API_TOKEN`
   - または **`STORAGE`** を選択 → 環境変数名: `STORAGE_REST_API_URL`、`STORAGE_REST_API_TOKEN`
   - または **空白のまま** → デフォルトの環境変数名が使用されます

2. **Environment** の設定を確認：
   - **Production** にチェック
   - **Preview** にチェック
   - **Development** にチェック
   - （すべてにチェックすることを推奨）

3. **「Select your client」画面について**:
   - この画面は、使用するクライアントライブラリを選択するものです
   - **`@vercel/kv` を使用する場合、この選択は必須ではありません**
   - 任意で「Node.js」を選択するか、そのまま次へ進むことができます
   - この選択は環境変数の設定には影響しません

4. 接続設定の続きで、以下を確認：
   - **Custom Prefix**: `KV` を選択（推奨）または `STORAGE` または空白のまま
   - **Environment**: Production, Preview, Development（すべてにチェック）

5. **「Connect」** ボタンをクリック

6. **接続完了後、環境変数が自動設定されているか確認**:
   - **Vercel Dashboard** → プロジェクト（`generative-ai-passport-purchase`）を選択
   - **Settings** → **Environment Variables** を開く
   - 以下の環境変数が自動追加されているか確認：
     - `KV_REST_API_URL` と `KV_REST_API_TOKEN`（Custom Prefix が `KV` の場合）
     - または `STORAGE_REST_API_URL` と `STORAGE_REST_API_TOKEN`（Custom Prefix が `STORAGE` の場合）

**新しいデータベースを作成した場合、この方法で環境変数が自動設定されます！**

### 注意: Quickstartセクションに表示されるコード例について

接続後、Quickstartセクションに `node-redis` の直接接続用コード例が表示される場合があります：

```javascript
import { createClient } from 'redis';
// ... 直接接続用のコード
```

**重要**: 
- ❌ このコードは直接接続用（`node-redis`）で、`@vercel/kv` では使用できません
- ✅ `@vercel/kv` を使用する場合は、環境変数 `KV_REST_API_URL` と `KV_REST_API_TOKEN` が設定されていれば、既に実装済みのコード（`app/lib/kv-storage.ts`）が自動的に使用されます

**確認事項**:
- 環境変数（`KV_REST_API_URL` と `KV_REST_API_TOKEN`）が設定されているか確認
- Quickstartセクションの他のタブ（Next.js App Router、TypeScriptなど）にREST API用の情報が表示されているか確認

### ステップ2: プロジェクト接続後も環境変数が設定されない場合の対応

**注意**: このデータベースは Redis Labs を使用しているようです（`redis-10252.c290.ap-northeast-1-2.ec2.cloud.redislabs.com`）。Vercel Storageは通常Upstashを提供しますが、この場合は異なる可能性があります。

**確認事項**:
1. プロジェクト接続後も環境変数が自動設定されない場合
2. Quickstartセクションに REST API情報が表示されない場合
3. 「Connect Project」ボタンが表示されない場合

**対処方法**:

#### 方法1: Quickstartセクションの「Next.js App Router」または「TypeScript」タブから取得（推奨）

**重要**: Quickstartセクションの `.env.local` タブには `REDIS_URL` が表示されますが、これは直接接続用です。`@vercel/kv` を使用する場合は、別のタブを確認してください。

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. **Quickstart** セクションを確認（ページ上部に表示されています）
3. **タブを切り替えて確認**:
   - **「Next.js App Router」タブ** をクリック
   - または **「TypeScript」タブ** をクリック
4. 表示されるコード例に以下の環境変数が含まれているか確認：
   - `KV_REST_API_URL` または `STORAGE_REST_API_URL`
   - `KV_REST_API_TOKEN` または `STORAGE_REST_API_TOKEN`
5. もし表示されていない場合:
   - 「Show secret」ボタンをクリックして値を表示
   - 「Copy Snippet」ボタンでコードをコピー
6. REST API情報が見つかったら、以下をコピー：
   - REST API URL（`https://` で始まるURL）
   - REST API Token（英数字の文字列）

**注意**: `.env.local` タブの `REDIS_URL` は直接接続用（`redis://` で始まる）なので、`@vercel/kv` では使用できません。必ず「Next.js App Router」または「TypeScript」タブを確認してください。

#### 方法2: Vercel Dashboardの「Connect」設定から確認

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. 以下のセクションを探してください：
   - **「Connection Details」**
   - **「REST API」**
   - **「Connect to Project」**
   - **「Environment Variables」**
3. REST API情報が表示されている場合は、そこからコピー

または：

1. **Vercel Dashboard** → プロジェクト → **Settings** → **Environment Variables**
2. 既に `KV_REST_API_URL` や `STORAGE_REST_API_URL` などの環境変数が設定されているか確認
3. もし設定されていない場合は、次で手動設定が必要です

#### 方法3: Vercel DashboardのStorage設定から直接確認（推奨）

Upstash管理画面にログインできない場合は、Vercel Dashboard内で直接情報を確認できます。

1. **Vercel Dashboard** → プロジェクト（`generative-ai-passport-purchase`）を選択
2. **Settings** → **Environment Variables** を開く
3. 既に環境変数が設定されているか確認（自動設定されている可能性が高い）

もし環境変数が表示されていない場合：

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. 以下のセクションを確認：
   - **「Connection Details」**
   - **「Environment Variables」**
   - **「Quickstart」**（表示される場合）
3. REST API情報が表示されている場合は、そこからコピー

#### 方法4: 「Redisでシークレットを管理する」ボタンから取得（Upstashアカウントが必要）

**注意**: この方法はUpstashアカウントの作成・ログインが必要な場合があります。

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. **「秘密をローテーションする」**（Rotate Secrets）ページを開く
3. 画面下部の赤いボタン **「Redisでシークレットを管理する」**（Manage Secrets in Redis）をクリック
4. サインインを求められた場合：
   - **新規登録またはログインが必要**な場合があります
   - または、**方法3**でVercel Dashboard内から直接情報を取得してください（推奨）

**注意**: 
- Redis Labsの管理画面へのログインは不要です
- Vercel StorageはUpstashを使用しているため、Vercel Dashboardから直接情報を取得できます
- 「AIゲートウェイ」は不要です。これはKVとは別の機能です

### ステップ2: REST API情報の取得方法（環境変数が自動設定されていない場合）

**現状確認**: 
- Vercel DashboardのEnvironment VariablesにKV関連の環境変数は設定されていません
- `redis://` URLのみが設定されていますが、これは直接接続用で使用できません
- REST API情報を手動で取得して設定する必要があります

#### 方法A: Vercel StorageのSettingsタブで確認（推奨）

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. 以下のセクションを確認：
   - **「Connection Details」** - 接続情報が表示される場合があります
   - **「REST API」** セクション - REST API情報が表示される場合があります
   - **「Endpoints」** セクション - エンドポイント情報が表示される場合があります
3. `https://` で始まるREST API URLとTokenを探してください

#### 方法B: Vercel StorageのOverviewタブで確認

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Overview** タブ
2. データベースの概要情報を確認
3. REST API情報が表示される場合があります

#### 方法C: 「Connect Project」ボタンから確認（最も簡単・推奨）

**重要**: Vercel Storageの設定画面から直接プロジェクトに接続する際、環境変数が自動設定される可能性があります。

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. ページ上部の **「Connect Project」** ボタンをクリック
3. プロジェクト選択画面が開きます
4. `generative-ai-passport-purchase` プロジェクトを選択
5. **接続設定画面で以下を確認**:
   - **Custom Prefix** を `KV` または `STORAGE` に設定（または空白のまま）
   - **Environment** で Production, Preview, Development すべてにチェック
   - **「Connect」** ボタンをクリック
6. 接続が完了すると、自動的に環境変数が追加される可能性があります
7. プロジェクトの **Settings** → **Environment Variables** を確認して、`KV_REST_API_URL` や `STORAGE_REST_API_URL` が追加されているか確認

**この方法が最も確実です！** プロジェクトに接続することで、環境変数が自動設定される場合があります。

#### 方法D: Vercel CLIを使用して確認（オプション）

**注意**: npmにパーミッションの問題がある場合は、この方法は使用できません。

1. ターミナルで以下を実行（Vercel CLIがインストールされている場合）：
```bash
cd /Users/imamurayoko/Developer/Cursor/application
vercel env pull .env.local
```
2. `.env.local` ファイルが作成され、環境変数が表示されます
3. KV関連の環境変数が含まれているか確認

**Vercel CLIがインストールされていない場合**: 上記の方法C（Connect Project）を使用してください。

#### 方法E: Redis Labsの管理画面について（通常は不要）

**重要**: Vercel Storageで作成したKVデータベースは、通常**Upstash**が提供しています。Redis Labsの管理画面に直接アクセスする必要は**ありません**。

**`REDIS_URL` にRedis Labsのホスト名が含まれている理由**:
- Vercel Storageは内部的にUpstashを使用していますが、接続情報としてRedis Labsのホスト名が表示される場合があります
- これは内部的な実装の詳細であり、直接Redis Labsの管理画面にアクセスする必要はありません

**Redis Labsの管理画面にログインできない場合**:
- ✅ **新規登録は不要です**
- ✅ **ログインする必要もありません**
- ✅ Vercel Dashboardから直接管理できます

**正しい方法**: 上記の方法C（Connect Project）または方法F（新しいKVデータベースを作成）を使用してください。

#### 方法F: 新しいVercel Storage KVデータベースを作成（推奨・最後の手段）

もしRedis LabsでREST API情報を取得できない場合、Vercel Storageとして新しいKVデータベースを作成することを検討してください。

1. **Vercel Dashboard** → **Storage** → **Create Database**
2. **KV** を選択
3. データベース名: `generative-ai-passport-purchase`（任意）
4. リージョン: Tokyo, Japan (Northeast)
5. **Create** をクリック
6. 作成後、プロジェクトに接続すると、自動的にREST API環境変数が設定されます

**この方法で、Upstashが自動的に提供され、REST API情報が自動設定されます。**

### ステップ3: 環境変数が自動設定されない場合の手動設定手順

**注意**: 無料プランでも通常は環境変数が自動設定されますが、設定されない場合があります。その場合は、以下の手順で手動設定してください。

**前提条件**: QuickstartセクションからREST API情報を取得する必要があります。

#### ステップ3-1: QuickstartセクションからREST API情報を取得

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. **Quickstart** セクションを確認
3. **タブを切り替えて確認**:
   - **「Next.js App Router」タブ** をクリック
   - **「TypeScript」タブ** をクリック
   - **「Python」タブ** をクリック
4. これらのタブに `@vercel/kv` を使用するコード例が表示されているか確認
5. コード例に以下の環境変数が含まれているか確認：
   - `KV_REST_API_URL` または `STORAGE_REST_API_URL`
   - `KV_REST_API_TOKEN` または `STORAGE_REST_API_TOKEN`
6. **「Show secret」ボタン**をクリックして値を表示
7. REST API URLとTokenをコピー

**注意**: もしこれらのタブにも `node-redis` の直接接続用コードしか表示されない場合、このデータベースがREST APIをサポートしていない可能性があります。その場合は、Vercelサポートに問い合わせるか、別の方法を検討する必要があります。

#### ステップ3-2: 環境変数の手動追加手順

REST API情報を取得したら、以下の手順で環境変数を手動設定してください：

1. **Vercel Dashboard** → プロジェクト（`generative-ai-passport-purchase`）を選択
2. **Settings** → **Environment Variables** を開く
3. **Add New** または **Add Environment Variable** をクリック

4. **環境変数1を追加（REST API URL）:**
   - **Key**: `KV_REST_API_URL`（推奨）または `STORAGE_REST_API_URL`
   - **Value**: REST API URL（`https://` で始まるURL。例: `https://xxx.upstash.io` または `https://xxx.kv.vercel-storage.com`）
   - **Environment**: Production, Preview, Development（すべてにチェック）
   - **Save** をクリック

5. **環境変数2を追加（REST API Token）:**
   - **Key**: `KV_REST_API_TOKEN`（推奨）または `STORAGE_REST_API_TOKEN`
   - **Value**: REST API Token（英数字の文字列。通常 `A` で始まる長い文字列）
   - **Environment**: Production, Preview, Development（すべてにチェック）
   - **Save** をクリック

6. **既存の環境変数について**:
   - 現在設定されている `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`、`STRIPE_SECRET_KEY` などはそのまま残してください
   - `REDIS_URL` はそのまま残しておいても問題ありません（コードは使用しません）

7. 環境変数が正しく設定されていることを確認：
   ```
   KV_REST_API_URL        ✅ 設定済み（または STORAGE_REST_API_URL）
   KV_REST_API_TOKEN      ✅ 設定済み（または STORAGE_REST_API_TOKEN）
   ```

### ステップ3: 動作確認方法

#### ローカル開発環境での確認

1. **開発サーバーの再起動**（必須）
   ```bash
   # 現在実行中の開発サーバーを停止（Ctrl+C）
   # キャッシュをクリア（既に実行済み: rm -rf .next）
   npm run dev
   ```
   
2. **ページにアクセスして確認**:
   - `http://localhost:3000/purchase/restore` にアクセス
   - ページが正しく表示されることを確認
   - メールアドレス入力フォームが表示されることを確認

3. **APIエンドポイントの確認**:
   - ブラウザの開発者ツール（F12）→ Network タブを開く
   - メールアドレスを入力して「購入状態を復元」をクリック
   - `/api/restore-purchase` へのリクエストが送信されることを確認

#### 本番環境での確認

1. **環境変数設定後のデプロイ**
   - 環境変数を追加した後、必要に応じて再デプロイを実行
   - Vercel Dashboard → Deployments で最新のデプロイが成功していることを確認

2. **購入フローのテスト**
   - テスト環境または本番環境でStripe Checkoutを実行
   - 購入完了後、Webhookが正常に動作することを確認（Vercel Dashboard → Functions → Logsで確認）

3. **購入状態の復元テスト**
   - `/purchase/restore` ページにアクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が正しく復元されることを確認
   - 有料コンテンツにアクセスできることを確認

---

## 📚 関連ファイル・ドキュメント

### 実装ファイル一覧

#### コア実装ファイル

1. **`app/lib/kv-storage.ts`** - KVストレージのラッパー関数
   - `set()` - キー・値の保存（TTL対応）
   - `get()` - キーから値を取得
   - `del()` - キーの削除
   - `expire()` - TTLの設定
   - ローカル開発環境ではメモリ内ストレージにフォールバック
   - **`KV_*` と `STORAGE_*` の両方のプレフィックスに対応**
   - `@vercel/kv` の `createClient` を使用して環境変数を明示的に指定

2. **`app/api/webhook/stripe/route.ts`** - Stripe Webhookエンドポイント
   - 購入完了時にメールアドレスと購入状態をVercel KVに保存
   - `checkout.session.completed` イベントを処理

3. **`app/api/verify-email/route.ts`** - メールアドレス確認API
   - メールアドレスで購入状態を確認
   - 購入済みかどうかを返す

4. **`app/api/restore-purchase/route.ts`** - 購入状態復元API
   - メールアドレスで購入状態を復元
   - クライアント側に購入状態を設定するための情報を返す

#### フロントエンド実装ファイル

5. **`app/purchase/restore/page.tsx`** - 購入状態復元ページ（UI）
   - メールアドレス入力フォーム
   - 購入状態の復元処理
   - 成功/エラーメッセージの表示

6. **`app/utils/purchase.ts`** - 購入状態管理ユーティリティ
   - `restorePurchaseByEmail()` - メールアドレスによる購入状態復元機能

#### パッケージ設定

7. **`package.json`** - 依存関係
   - `@vercel/kv: ^0.2.1` - Vercel KVパッケージ

### 関連ドキュメント一覧

1. **`VERCEL_KV_ENV_SETUP.md`** - Vercel KV環境変数の設定手順（詳細版）
   - 環境変数の自動設定確認方法
   - 手動設定の詳細手順
   - トラブルシューティング

2. **`EMAIL_PURCHASE_RESTORE_SETUP.md`** - メールアドレスによる購入状態復元のセットアップガイド
   - Vercel KVのセットアップ手順
   - Stripe Webhookのセットアップ手順

3. **`EMAIL_BASED_PURCHASE_RESTORE_IMPLEMENTATION.md`** - 実装の詳細
   - 実装内容の詳細説明
   - 技術的な詳細

4. **`NEXT_STEPS.md`** - 次のステップ全体のガイド
   - プロジェクト全体の進行状況
   - 次のタスク一覧

---

## 🔍 トラブルシューティング

### REST API情報が見つからない場合

**現状（確認済み）**: 
- Environment VariablesにKV関連の環境変数（`KV_REST_API_URL`、`KV_REST_API_TOKEN`）が設定されていません
- `REDIS_URL` のみが設定されており、これは直接接続用（`redis://` で始まる）です
- データベースは Redis Labs（`redis-10252.c290.ap-northeast-1-2.ec2.cloud.redislabs.com`）を使用しています
- Quickstartセクションには `node-redis` の直接接続例しか表示されていません

**推奨される対処方法（優先順）**:

1. **「Connect Project」ボタンから接続**（最も簡単・推奨）
   - Vercel Dashboard → Storage → `generative-ai-passport-purchase` → Settings タブ
   - ページ上部の「Connect Project」ボタンをクリック
   - プロジェクトに接続すると、環境変数が自動設定される可能性があります

2. **Vercel Dashboardから直接確認**（Redis Labsの管理画面へのアクセスは不要）
   - Vercel Dashboard → Storage → `generative-ai-passport-purchase` → Settings タブ
   - 「Connect Project」ボタンからプロジェクトに接続
   - または、Storage設定の他のセクションを確認
   - **注意**: Redis Labsの管理画面にログインする必要はありません

3. **新しいVercel Storage KVデータベースを作成**（最後の手段・推奨）
   - 現在のデータベースがRedis Labsを使用しているため、REST APIが有効になっていない可能性があります
   - Vercel Storageとして新しいKVデータベースを作成すると、Upstashが自動的に提供され、REST API情報が自動設定されます
   - Vercel Dashboard → Storage → Create Database → KV を選択

**注意**: Redis Labsでは、REST API機能がプランや設定によって有効になっていない場合があります。その場合は、方法3（新しいKVデータベースを作成）を強く推奨します。

### 環境変数が正しく動作しない場合

1. 環境変数の値が正しいか確認（空欄でないか）
2. 環境変数がProduction, Preview, Developmentすべてに適用されているか確認
3. 環境変数を設定した後、再デプロイが必要な場合がある

---

## 📌 重要な注意事項

### `@vercel/kv` の動作

- `@vercel/kv` は REST API を使用（直接Redis接続ではない）
- 環境変数 `KV_REST_API_URL` と `KV_REST_API_TOKEN` が必要
- 環境変数が設定されない場合、ローカル開発環境ではメモリ内ストレージで動作（アプリ再起動でデータは消える）

### 直接接続用の情報は使用しない

- `redis://default:...@redis-10252...` - 直接接続用（使用しない）
- `redis-cli` の接続情報 - 直接接続用（使用しない）
- Redis Clientの接続コード - 直接接続用（使用しない）

---

## ✅ 完了後の動作

環境変数を設定すると、以下のように動作します：

1. **購入時**:
   - Stripe Checkoutで決済完了
   - Webhookが発火してメールアドレスと購入状態をVercel KVに保存
   - クライアント側のlocalStorageに購入状態を保存

2. **別の端末で利用時**:
   - `/purchase` ページの「購入済みの方はこちら」リンクをクリック
   - または `/purchase/restore` に直接アクセス
   - 購入時に使用したメールアドレスを入力
   - 購入状態が復元され、有料コンテンツにアクセス可能

---

## 📞 参考リンク

- [Vercel Storage Documentation](https://vercel.com/docs/storage)
- [Redis Cloud Documentation](https://redis.io/docs/latest/operate/rc/)
- [Redis Cloud REST API](https://redis.io/docs/latest/operate/rc/api/)

---

## ✅ 確認チェックリスト

環境変数の設定が完了したら、以下を確認してください：

- [ ] Vercel Dashboard → Settings → Environment Variables で環境変数を確認
- [ ] `STORAGE_REST_API_URL`（または `STORAGE_URL`）と `STORAGE_REST_API_TOKEN` が設定されている
- [ ] または `KV_REST_API_URL` と `KV_REST_API_TOKEN` が設定されている
- [ ] 環境変数がProduction, Preview, Developmentすべてに適用されている
- [ ] 環境変数の値が正しい（空欄でない、`https://`で始まるURLである）
- [ ] ローカル開発環境に `.env.local` ファイルを作成（必要に応じて）
- [ ] 環境変数設定後に再デプロイが完了している
- [ ] テスト購入が正常に動作することを確認
- [ ] `/purchase/restore` で購入状態が復元できることを確認

---

## 📌 重要な注意事項

### `@vercel/kv` の動作

- `@vercel/kv` は **REST API** を使用します（直接Redis接続ではありません）
- コードは以下の環境変数名のいずれかに対応しています：
  - `KV_REST_API_URL` / `KV_REST_API_TOKEN` (標準的なプレフィックス)
  - `STORAGE_REST_API_URL` / `STORAGE_REST_API_TOKEN` (カスタムプレフィックス)
  - `STORAGE_URL` / `STORAGE_REST_API_TOKEN` (Vercel自動生成形式)
- 環境変数が設定されない場合、ローカル開発環境ではメモリ内ストレージで動作します（アプリ再起動でデータは消えます）

### 既存の接続を維持できる

- **既存の `STORAGE` プレフィックスでの接続を削除する必要はありません**
- コードは `STORAGE_*` プレフィックスにも自動的に対応します
- 環境変数のプレフィックスを変更する必要はありません

### 直接接続用の情報は使用しない

- `redis://default:...@redis-10252...` - 直接接続用（**使用しない**）
- `redis-cli` の接続情報 - 直接接続用（**使用しない**）
- Redis Clientの接続コード - 直接接続用（**使用しない**）

**必ず REST API 用の `https://` で始まるURLとTokenを使用してください。**

---

---

## 💡 よくある質問（FAQ）

### Q: `STORAGE` プレフィックスで接続されていますが、`KV` に変更すべきですか？

**A: 変更する必要はありません。** コードは `STORAGE_*` プレフィックスにも対応しているため、既存の接続をそのまま使用できます。

### Q: エラー「This project is already connected to the target store」が出ます

**A: これは既存の接続があることを示しています。** コードは `STORAGE_*` プレフィックスにも対応しているため、既存の接続をそのまま使用できます。追加の接続設定は不要です。

### Q: 現在設定されている `redis://` URLは使えますか？

**A: 使いません。** `redis://` で始まるURLは直接接続用で、`@vercel/kv` では使用できません。REST API用の `https://` で始まるURLとTokenを取得して設定してください。

### Q: Redis Labsの管理画面にログインできません

**A: ログインする必要はありません！** Vercel Storageで作成したKVデータベースは、通常**Upstash**が提供しています。Redis Labsの管理画面にアクセスする必要はありません。

**正しい方法**:
1. Vercel Dashboard → Storage → `generative-ai-passport-purchase` → **Quickstart** タブ
2. 環境変数が表示されているので、そこからコピー
3. これが最も簡単で確実な方法です

### Q: 新しいデータベースを作成した後、Quickstartセクションに `node-redis` の直接接続用コード例が表示されます

**A: これは直接接続用の例です。** `@vercel/kv` を使用する場合は、このコードは使用しません。

**確認すべきこと**:
1. **環境変数が自動設定されているか確認**:
   - Vercel Dashboard → プロジェクト → Settings → Environment Variables
   - `KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動追加されているか確認
   - または `STORAGE_REST_API_URL` と `STORAGE_REST_API_TOKEN` が自動追加されているか確認

2. **環境変数が設定されている場合**:
   - ✅ 追加の設定は不要です！
   - ✅ 既に実装済みのコード（`app/lib/kv-storage.ts`）が自動的に使用されます
   - ❌ Quickstartセクションの `node-redis` コード例は無視してください

3. **環境変数が設定されていない場合**:
   - Quickstartセクションの他のタブ（Next.js App Router、TypeScriptなど）にREST API用の情報が表示されているか確認
   - または、接続設定画面で Custom Prefix と Environment を正しく設定したか確認

**現状**:
- Quickstartセクションには `node-redis`（`import { createClient } from "redis"`）のコード例が表示されている
- これは直接接続用で、`REDIS_URL`（`redis://` で始まる）を使用する
- しかし、`@vercel/kv` を使用するには、REST API用の `KV_REST_API_URL` と `KV_REST_API_TOKEN` が必要

**解決策**:

#### 方法1: Vercel CLIを使用して環境変数を取得（推奨）

1. ターミナルで以下を実行：
```bash
cd /Users/imamurayoko/Developer/Cursor/application
vercel env pull .env.local
```

2. `.env.local` ファイルが作成され、すべての環境変数が表示されます
3. `KV_REST_API_URL` や `KV_REST_API_TOKEN` が含まれているか確認

#### 方法2: Storage設定の「Connect」ボタンから確認

1. **Vercel Dashboard** → **Storage** → `generative-ai-passport-purchase` → **Settings** タブ
2. ページ上部の **「Connect Project」** ボタンをクリック
3. プロジェクトへの接続設定で、REST API情報が表示される場合があります

#### 方法3: `REDIS_URL` の値を確認（一時的な解決策）

もし `REDIS_URL` が `https://` で始まる場合（稀なケース）、コードを修正して対応できる可能性がありますが、通常は `redis://` で始まる直接接続用URLです。

**重要な確認**:
- `REDIS_URL` の値（「Show secret」ボタンで表示）が `redis://` で始まるか `https://` で始まるか確認してください
- もし `redis://` で始まる場合、REST API情報を別途取得する必要があります

**推奨**: まずは方法1（Vercel CLI）を試してください。これが最も確実です。

### Q: AIゲートウェイでAPI キーを作成する必要がありますか？

**A: いいえ、不要です。** 「AIゲートウェイ」はKVとは別の機能です。KVのREST API情報だけで十分です。

**必要な情報**:
- ✅ REST API URL（`https://` で始まるURL）
- ✅ REST API Token（英数字の文字列）

**不要なもの**:
- ❌ AIゲートウェイのAPIキー
- ❌ AI SDKの設定

### Q: REST API 情報が見つかりません

**A: 「Redisでシークレットを管理する」ボタンを使用してください。** 最も確実な方法です：
1. Vercel Dashboard → Storage → データベース名をクリック → **Settings** タブ
2. **「秘密をローテーションする」**（Rotate Secrets）ページを開く
3. 画面下部の赤いボタン **「Redisでシークレットを管理する」**（Manage Secrets in Redis）をクリック
4. Upstash管理画面が開くので、**「REST API」** または **「API Keys」** セクションを確認
5. REST API URL と Token をコピー

**この方法で確実に情報を取得できます！**

### Q: `node-redis` を使用する方法を見つけましたが、これを使用すべきですか？

**A: いいえ、使用しません。** `node-redis` は直接接続用（`redis://` URLを使用）で、今回の実装とは異なります。

**正しい方法（既に実装済み）**:
- ✅ `@vercel/kv` パッケージを使用（既にインストール済み）
- ✅ REST API（`https://` URL + Token）を使用
- ✅ `app/lib/kv-storage.ts` を使用（既に実装済み）

**誤った方法（使用しない）**:
- ❌ `node-redis` パッケージを使用
- ❌ `redis://` URLを使用（直接接続）
- ❌ `createClient().connect()` で接続

**必要な作業**: 環境変数を設定するだけです。コードの追加・変更は不要です。

### Q: ローカル開発環境での環境変数の設定方法は？

**A: `.env.local` ファイルを作成してください。** 以下の形式で環境変数を設定します：

```env
# Vercel KV (STORAGEプレフィックス)
STORAGE_REST_API_URL="https://xxxxx.kv.vercel-storage.com"
STORAGE_REST_API_TOKEN="Axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Vercel Dashboard → Storage → Quickstart タブから環境変数をコピーできます。

---

---

## 💡 Redis以外の選択肢について

### Q: Redis以外でも購入状態の保存はできますか？

**A: はい、可能です。** Redis以外の方法も選択できます。

### 選択肢1: Vercel Storage（推奨）

#### Upstash（Redis）- 最も簡単・推奨

**特徴**:
- Serverless DB (Redis, Vector, Queue, Search)
- Redisと同じ機能
- **現在の実装（`@vercel/kv`）をほぼそのまま使用可能**
- REST APIが自動提供される
- 環境変数が自動設定される

**メリット**:
- ✅ **現在のコードをそのまま使用できる可能性が高い**
- ✅ Vercelと統合されている
- ✅ 自動スケーリング
- ✅ 環境変数が自動設定される
- ✅ 無料プランあり

**推奨度**: ⭐⭐⭐⭐⭐（最も簡単）

#### Neon（PostgreSQL）

**特徴**:
- Serverless Postgres
- リレーショナルデータベース
- REST APIが自動提供される可能性あり
- 環境変数が自動設定される

**メリット**:
- Vercelと統合されている
- 自動スケーリング
- リレーショナルデータベースの機能を利用可能
- 無料プランあり

**注意**: 実装を変更する必要があります（`@vercel/kv` ではなく、PostgreSQL用のクライアントを使用）

#### Supabase（PostgreSQL）

**特徴**:
- Postgres backend
- リレーショナルデータベース
- 認証機能も提供
- REST APIが自動生成される

**メリット**:
- 機能が豊富（認証、ストレージなど）
- コミュニティが大きい
- 無料プランあり

**注意**: 実装を変更する必要があります

#### Redis（Serverless Redis）

**特徴**:
- Serverless Redis
- Redisと同じ機能
- **現在の実装（`@vercel/kv`）を使用可能**

**注意**: 現在使用しているデータベースと同じタイプです。新しく作成する場合は、**Upstash** を選択する方が推奨されます（Vercelとの統合が良好）。

#### Convex

**特徴**:
- フルスタックバックエンド
- リアルタイム同期機能
- 自動スケーリング

**注意**: 実装を大幅に変更する必要があります。現在の実装とは大きく異なるアプローチが必要です。

#### その他の選択肢

- **AWS** - Serverless, reliable, secure PostgreSQL and NoSQL databases
- **Nile** - Postgres re-engineered for B2B
- **MotherDuck** - Analytics Database

**メリット**:
- Vercelと統合されている（一部）
- 自動スケーリング
- 環境変数が自動設定される可能性あり
- 無料プランあり（一部）

### 選択肢2: 外部データベースサービス

#### Supabase
- PostgreSQLベースのBaaS（Backend as a Service）
- 無料プランあり
- REST APIが自動生成される
- 認証機能も提供

#### Firebase Firestore
- GoogleのNoSQLデータベース
- 無料プランあり
- リアルタイム同期機能あり
- 認証機能も提供

#### PlanetScale
- MySQL互換のサーバーレスデータベース
- 無料プランあり
- 自動スケーリング

**メリット**:
- 機能が豊富
- ドキュメントが充実
- コミュニティが大きい

### 選択肢3: Stripe APIのみを使用（データベース不要）

現在の実装を変更して、データベースを使わずにStripe APIで購入状態を確認する方法：

**実装方法**:
1. メールアドレスでStripe APIから購入履歴を検索
2. 購入履歴が見つかれば、購入状態を復元
3. クライアント側のlocalStorageに保存

**メリット**:
- データベース不要（コスト削減）
- Stripeが信頼できる唯一の情報源
- 実装がシンプル

**デメリット**:
- Stripe APIのレート制限に依存
- Stripe API呼び出しが増える（コスト増加の可能性）
- レスポンス時間がやや長くなる可能性

### 選択肢4: localStorageのみ（現在の実装の一部）

現在、クライアント側では既に`localStorage`を使用しています。

**現状**:
- 購入完了後、クライアント側のlocalStorageに購入状態を保存
- 別の端末では復元できない

**制限事項**:
- 端末間でデータを共有できない
- ブラウザのデータを削除すると失われる
- サーバー側での検証ができない

### 推奨される選択肢（Vercel Storageから選択する場合）

**現時点での推奨（優先順）**:

1. **Upstash（Redis）** - ⭐⭐⭐⭐⭐ 最も推奨
   - **理由**: 現在の実装（`@vercel/kv`）をそのまま使用可能
   - **メリット**: コード変更が最小限、環境変数が自動設定される
   - **手順**: Vercel Dashboard → Storage → Create Database → **Upstash** を選択

2. **Neon（PostgreSQL）** - ⭐⭐⭐⭐
   - **理由**: Vercelと統合、自動スケーリング、無料プランあり
   - **注意**: 実装を変更する必要がある（PostgreSQL用のクライアントを使用）

3. **Supabase（PostgreSQL）** - ⭐⭐⭐⭐
   - **理由**: 機能が豊富、コミュニティが大きい
   - **注意**: 実装を変更する必要がある

4. **Redis（Serverless Redis）** - ⭐⭐⭐
   - **理由**: Redisと同じ機能
   - **注意**: Upstash の方が推奨（Vercelとの統合が良好）

**データベースを使いたくない場合**:
- **Stripe APIのみ** - データベース不要、実装がシンプル

### 最も簡単な方法：Upstash for Redis を選択

**重要**: Upstashには複数のサービスがあります。購入状態の保存には **Upstash for Redis** を選択してください。

**Upstashサービスの選択肢**:

1. **Upstash for Redis** - ✅ **これが正しい選択肢**
   - Key-Valueストレージ（購入状態の保存に最適）
   - `@vercel/kv` と互換性あり
   - 現在のコードをそのまま使用可能

2. **Upstash Vector** - ❌ 使用しない
   - ベクター検索用（AI/機械学習用の埋め込みベクトル検索）
   - 購入状態の保存には不適切

3. **Upstash QStash/Workflow** - ❌ 使用しない
   - キューやワークフロー用（非同期処理用）
   - 購入状態の保存には不適切

4. **Upstash Search** - ❌ 使用しない
   - 全文検索用
   - 購入状態の保存には不適切

**理由**:
- ✅ 現在のコード（`@vercel/kv`）をそのまま使用可能
- ✅ 環境変数が自動設定される
- ✅ REST API情報が確実に取得できる
- ✅ コード変更が不要（または最小限）

**手順**:
1. Vercel Dashboard → Storage → Create Database
2. **Upstash** を選択
3. **Upstash for Redis** を選択（重要！）
4. 設定画面で以下を確認：
   - **Primary Region**: `Tokyo, Japan (Northeast)` ✅ 既に選択済み（適切）
   - **Read Regions**: オプションなので、そのままでも問題なし
   - **Eviction**: オフのままでも問題なし（購入状態の保存には影響なし）
   - **Plans**: **Free** プランを選択 ✅ これが必須（Continueボタンを有効化するため）
5. **Continue** ボタンをクリック
6. プロジェクトに接続
7. 環境変数が自動設定される

**設定の推奨事項**:
- **Primary Region**: `Tokyo, Japan (Northeast)` - 既に選択済みで問題なし ✅
- **Read Regions**: オプションなので、削除してもそのままでもOK
- **Eviction**: オフのまま - 購入状態の保存には影響なし
- **Plans**: **Free** プランを選択 - 試用期間や小規模な使用には十分

**Freeプランの制限について**:

**制限事項**:
1. **アカウントごとに1つのデータベースのみ** - 「Limited to 1 database per account」
   - ✅ **問題ありません** - 購入状態の保存には1つのデータベースで十分です
   - 既に他のデータベースを作成している場合、削除する必要があるかもしれません

2. **月間50万コマンド（500,000 commands/month）** - 無料枠
   - ✅ **購入状態の保存には十分です**
   - コマンド数とは、Redisへの操作（`set`、`get`、`del`など）の回数です
   - 購入状態の保存・取得は：
     - 購入完了時：1回の `set`（1コマンド）
     - 購入状態の確認：1回の `get`（1コマンド）
     - 購入状態の復元：1回の `get`（1コマンド）
   - **月間50万コマンドは、相当な数のユーザーをサポートできます**

**使用例**:
- 購入完了: 1コマンド（`set`）
- ページアクセス時の購入状態チェック: 1コマンド（`get`）
- 購入状態復元: 1コマンド（`get`）

**計算例**:
- 月間50万コマンド ÷ 3コマンド（購入完了 + 2回のチェック） = 約16万回の購入完了
- 実際には、購入状態の確認はキャッシュされるため、コマンド数はさらに少なくなります

**結論**: Freeプランで十分です。購入状態の保存用途では制限に達する可能性は低いです。

**これが最も確実で簡単な方法です！**

### 実装の変更が必要な場合

Redis以外の方法を選択する場合、以下のファイルを修正する必要があります：

1. **`app/lib/kv-storage.ts`** - ストレージ実装を変更
2. **`app/api/webhook/stripe/route.ts`** - Webhookでデータベースに保存する部分を変更
3. **`app/api/verify-email/route.ts`** - メールアドレスで購入状態を確認する部分を変更
4. **`app/api/restore-purchase/route.ts`** - 購入状態を復元する部分を変更

**注意**: 現在の実装は`@vercel/kv`を使用していますが、他の方法に変更する場合は、これらのファイルを修正する必要があります。

---

---

## ✅ 環境変数の設定完了！

### 設定された環境変数（確認済み）

Upstash for Redisを作成し、プロジェクトに接続した結果、以下の環境変数が自動設定されました：

```
KV_REST_API_URL="https://regular-donkey-8131.upstash.io" ✅
KV_REST_API_TOKEN="AR_DAAImcDEzNmJmYzVlNTQ4NGU0MTg1YjZhOGNjYWVmN2MwNDRlNHAxODEzMQ" ✅
KV_REST_API_READ_ONLY_TOKEN="Ah_DAAIgcDGcBUTkKen22AzIXTAeFfDRyawAsA9FroZ4_ZEv-a5qJg" ✅
```

**重要な環境変数**:
- ✅ `KV_REST_API_URL` - REST API URL（`https://` で始まる）✅ 設定済み
- ✅ `KV_REST_API_TOKEN` - REST API Token ✅ 設定済み
- ✅ `KV_REST_API_READ_ONLY_TOKEN` - 読み取り専用トークン（オプション）✅ 設定済み

**その他の環境変数（コードでは使用しません）**:
- `KV_URL` - 直接接続用URL（`rediss://` で始まる）- コードは使用しない
- `REDIS_URL` - 直接接続用URL（`rediss://` で始まる）- コードは使用しない

**注意**: `KV_URL` と `REDIS_URL` は直接接続用なので、現在のコード（`@vercel/kv`）では使用しません。残しておいても問題ありません。

### コードとの互換性確認

現在のコード（`app/lib/kv-storage.ts`）は以下の環境変数を確認しています：

```typescript
const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL || process.env.STORAGE_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;
```

✅ **`KV_REST_API_URL` と `KV_REST_API_TOKEN` が設定されているため、コードは正常に動作します！**

### 次のステップ：動作確認

環境変数が設定されたので、以下の手順で動作確認してください：

1. **ローカル開発環境での確認（オプション）**:
   - `.env.local` ファイルを作成
   - 環境変数をコピーして設定（Vercel Dashboard → Settings → Environment Variables から取得可能）

2. **デプロイして確認**:
   - 変更をコミット・プッシュ
   - Vercelで自動デプロイされることを確認

3. **購入フローのテスト**:
   - テスト購入を実行
   - Stripe Webhookが正常に動作することを確認（Vercel Dashboard → Functions → Logsで確認）
   - `/purchase/restore` で購入状態が復元されることを確認

### 完了チェックリスト

- [x] Upstash for Redis データベースを作成
- [x] プロジェクトに接続
- [x] 環境変数が自動設定された（`KV_REST_API_URL`、`KV_REST_API_TOKEN`）
- [ ] ローカル開発環境に `.env.local` を作成（オプション）
- [ ] デプロイして動作確認
- [ ] テスト購入を実行して動作確認
- [ ] `/purchase/restore` で購入状態が復元されることを確認

---

---

## 🔧 トラブルシューティング：404エラー

### 問題: `/purchase/restore` ページが404エラーになる

**症状**:
- `http://localhost:3000/purchase/restore` にアクセスすると404エラー
- ブラウザのコンソールに `GET http://localhost:3000/purchase 404 (Not Found)` が表示される

**原因**:
- ポート3000が既存のプロセスで使用されている
- Next.jsのビルドキャッシュが古い
- 開発サーバーが正常に起動していない

**解決方法**:

1. **ポート3000を使用しているプロセスを確認**:
   ```bash
   lsof -ti:3000
   ```

2. **Next.jsのプロセスを終了**:
   ```bash
   kill -9 $(lsof -ti:3000 | grep -v "Cursor\|Chrome")
   ```
   または、特定のPIDを指定：
   ```bash
   kill -9 <PID>
   ```

3. **キャッシュをクリアして再起動**:
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **ブラウザのキャッシュをクリア**:
   - `Cmd+Shift+R`（Mac）または `Ctrl+Shift+R`（Windows）でハードリロード
   - または、ブラウザの開発者ツール（F12）→ Network タブ → 「Disable cache」にチェック

**確認方法**:
- `http://localhost:3000/purchase/restore` にアクセスして、HTTP 200が返ることを確認

---

**作成日**: 2026年1月10日  
**最終更新日**: 2026年1月10日  
**状況**: ✅ 環境変数の設定完了！`KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動設定されました。✅ `/purchase/restore` ページが正常に動作しています（HTTP 200）。

