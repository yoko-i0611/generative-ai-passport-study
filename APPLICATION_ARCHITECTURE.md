# アプリケーション構造・仕様書

## 最終更新日
2026年1月

## 目次
1. [アプリケーション概要](#アプリケーション概要)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [Stripe決済システム](#stripe決済システム)
4. [購入状態管理](#購入状態管理)
5. [アクセス制御](#アクセス制御)
6. [環境変数](#環境変数)
7. [重要なファイル一覧](#重要なファイル一覧)
8. [改修時の注意点](#改修時の注意点)

---

## アプリケーション概要

### プロジェクト名
生成AIパスポート試験対策プラットフォーム

### 技術スタック
- **フレームワーク**: Next.js 14.2.30 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **決済システム**: Stripe Checkout
- **ホスティング**: Vercel
- **データ保存**: 
  - 購入状態: Vercel KV (Upstash for Redis)
  - 学習履歴: ブラウザのlocalStorage（クライアントサイド）
- **メール送信**: SendGrid (SMTP)

### 主要機能
- 学習コンテンツ（5章構成、第1章は無料）
- 問題演習（300問）
- 学習分析・進捗管理
- Stripe決済（500円・買い切り）
- 購入状態に基づくコンテンツアクセス制御
- メールアドレスによる購入確認機能
- 購入完了メール送信

### サービス利用期間
- **統一期限**: 2026年12月31日まで
- 購入時期に関わらず、すべてのユーザーが同じ日に期限となります
- 試験制度の改定に対応するため、統一期限を設定しています

---

## ディレクトリ構造

```
application/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── checkout/
│   │   │   └── route.ts          # Stripe Checkoutセッション作成
│   │   ├── webhook/
│   │   │   └── stripe/
│   │   │       └── route.ts      # Stripe Webhook（購入完了処理）
│   │   ├── verify-email/
│   │   │   └── route.ts          # メールアドレスで購入状態を確認
│   │   └── restore-purchase/
│   │       └── route.ts          # メールアドレスで購入状態を復元
│   ├── components/               # 共通コンポーネント
│   │   ├── PurchaseGuard.tsx     # 購入ガードコンポーネント
│   │   └── UnitQuizModal.tsx     # ユニット確認テストモーダル
│   ├── courses/                  # 学習コースページ
│   │   ├── chapter1/             # 第1章（無料）
│   │   ├── chapter2/             # 第2章（有料）
│   │   ├── chapter3/             # 第3章（有料）
│   │   ├── chapter4/             # 第4章（有料）
│   │   ├── chapter5/             # 第5章（有料）
│   │   ├── prompt/               # プロンプトページ
│   │   ├── literacy/             # リテラシーページ
│   │   ├── trends/               # トレンドページ
│   │   ├── generative-ai/        # 生成AIページ
│   │   ├── ai/                   # AIページ
│   │   └── [id]/                 # 動的ルート
│   ├── lib/                      # ライブラリ・ユーティリティ
│   │   ├── kv-storage.ts         # Vercel KVラッパー
│   │   └── unitQuizzes.ts        # ユニットクイズデータ
│   ├── purchase/                 # 販売・決済関連
│   │   ├── page.tsx              # 販売ランディングページ
│   │   ├── success/
│   │   │   └── page.tsx          # 決済完了ページ
│   │   └── restore/
│   │       └── page.tsx          # 購入状態復元ページ
│   ├── quiz/                     # 問題演習ページ（有料）
│   ├── analytics/                # 学習分析ページ（有料）
│   ├── chat/                     # チャットページ（有料・オプション）
│   ├── commerce/                 # 特定商取引法に基づく表記
│   ├── privacy/                  # プライバシーポリシー
│   ├── terms/                    # 利用規約
│   ├── utils/
│   │   └── purchase.ts           # 購入状態管理ユーティリティ
│   ├── page.tsx                  # ホームページ
│   └── layout.tsx                # ルートレイアウト
├── data/                         # データファイル
│   ├── courses.ts                # コースデータ
│   └── reference-content.ts      # 参照コンテンツデータ
├── public/                       # 静的ファイル
├── middleware.ts                 # ミドルウェア（API保護など）
└── package.json                  # 依存関係
```

---

## Stripe決済システム

### 実装概要
- **決済方式**: Stripe Checkout（ホスト型決済ページ）
- **決済タイプ**: 買い切り（`mode: 'payment'`）
- **金額**: 500円（税込）
- **通貨**: JPY（日本円）

### 決済フロー

```
1. ユーザーが「今すぐ購入する」ボタンをクリック
   ↓
2. /api/checkout にPOSTリクエスト
   ↓
3. Stripe Checkoutセッションを作成
   ↓
4. ユーザーをStripe Checkoutページにリダイレクト
   ↓
5. ユーザーがカード情報を入力して決済
   ↓
6. 決済完了後、/purchase/success?session_id=xxx にリダイレクト
   ↓
7. 購入状態をlocalStorageに保存（クライアント側）
   ↓
8. Stripe Webhookで購入完了イベントを受信
   ↓
9. メールアドレスと購入状態をVercel KVに保存（サーバー側）
   ↓
10. 購入完了メールを送信（SendGrid経由）
```

### 主要ファイル

#### `app/api/checkout/route.ts`
Stripe Checkoutセッションを作成するAPIエンドポイント。

**重要な設定**:
- `mode: 'payment'` - 買い切り決済
- `currency: 'jpy'` - 日本円
- `unit_amount: 500` - 500円
- `success_url` - 決済完了後のリダイレクト先
- `cancel_url` - キャンセル時のリダイレクト先

**環境変数**:
- `STRIPE_SECRET_KEY` - Stripeシークレットキー（`sk_live_...` または `sk_test_...`）
- `NEXT_PUBLIC_APP_URL` - アプリケーションのベースURL

#### `app/api/webhook/stripe/route.ts`
Stripe Webhookエンドポイント。購入完了イベント（`checkout.session.completed`）を受信して処理。

**処理内容**:
1. Webhook署名の検証
2. メールアドレスと購入状態をVercel KVに保存
3. 購入完了メールを送信（SendGrid経由）

**環境変数**:
- `STRIPE_WEBHOOK_SECRET` - Webhook署名シークレット（`whsec_...`）
- `KV_REST_API_URL` - Vercel KV REST API URL
- `KV_REST_API_TOKEN` - Vercel KV REST API Token
- `SENDGRID_API_KEY` - SendGrid APIキー
- `SENDGRID_FROM_EMAIL` - 送信元メールアドレス
- `EMAIL_FROM_NAME` - 送信者名

#### `app/purchase/page.tsx`
販売ランディングページ。購入ボタンから決済フローを開始。

#### `app/purchase/success/page.tsx`
決済完了ページ。購入状態をlocalStorageに保存。

#### `app/purchase/restore/page.tsx`
購入状態復元ページ。メールアドレスを入力して購入状態を復元。

---

## 購入状態管理

### 実装方法
**ハイブリッド方式**を採用：

1. **クライアント側（localStorage）**
   - 購入状態をブラウザのlocalStorageに保存
   - アクセス制御のパフォーマンスを向上
   - ブラウザを変更すると失われる

2. **サーバー側（Vercel KV）**
   - メールアドレスと購入状態をVercel KV（Upstash for Redis）に保存
   - メールアドレスで購入確認が可能
   - 別の端末や別のブラウザでも復元可能

### 管理ファイル
- `app/utils/purchase.ts` - クライアント側の購入状態管理
- `app/lib/kv-storage.ts` - Vercel KVラッパー
- `app/api/verify-email/route.ts` - メールアドレスで購入状態を確認
- `app/api/restore-purchase/route.ts` - メールアドレスで購入状態を復元

### 主要関数

#### クライアント側（`app/utils/purchase.ts`）

##### `isPurchased(): boolean`
購入状態をチェック。localStorageに`platform_purchase_status`が存在するか確認。

##### `setPurchaseStatus(sessionId?: string): void`
購入状態を保存。`platform_purchase_status`をlocalStorageに保存。

##### `getPurchaseStatus(): PurchaseStatus`
購入状態の詳細情報を取得。

##### `restorePurchaseByEmail(email: string): Promise<{success: boolean, message?: string}>`
メールアドレスで購入状態を復元。サーバー側で確認して、クライアント側に保存。

##### `verifyPurchaseByEmail(email: string): Promise<{purchased: boolean, purchasedAt?: number, sessionId?: string}>`
メールアドレスで購入状態を確認。サーバー側で確認のみ。

#### サーバー側（`app/lib/kv-storage.ts`）

##### `set(key: string, value: any, options?: { ex?: number }): Promise<void>`
キーと値をVercel KVに保存。TTL（有効期限）を設定可能。

##### `get<T>(key: string): Promise<T | null>`
キーから値を取得。

##### `del(key: string): Promise<void>`
キーと値を削除。

##### `expire(key: string, seconds: number): Promise<void>`
キーの有効期限を設定。

### データ構造

#### クライアント側（localStorage）
```typescript
interface PurchaseStatus {
  purchased: boolean;
  purchasedAt?: number;
  sessionId?: string;
}
```

#### サーバー側（Vercel KV）
```typescript
interface ServerPurchaseStatus {
  purchased: boolean;
  purchasedAt: number;
  sessionId: string;
  expiresAt: number; // 有効期限（Unixタイムスタンプ）
}
```

**キー形式**: `purchase:{email}`

### 有効期限管理
- **統一期限**: 2026年12月31日 23:59:59 JST
- 環境変数`PURCHASE_EXPIRATION_DATE`で設定可能（デフォルト: `2026-12-31T23:59:59+09:00`）
- 購入時期に関わらず、すべてのユーザーが同じ日に期限となります
- 期限を過ぎると、Vercel KVのデータは自動的に削除されます（TTL設定）

### 購入確認機能
別の端末や別のブラウザで利用する場合：
1. `/purchase/restore`ページにアクセス
2. 購入時に登録したメールアドレスを入力
3. サーバー側で購入状態を確認
4. 購入済みの場合、クライアント側（localStorage）に購入状態を保存
5. 有料コンテンツにアクセス可能

### 注意事項
- **購入した端末・ブラウザ**: localStorageに保存されているため、自動的に購入済みと認識されます
- **別の端末・ブラウザ**: メールアドレスでの購入確認が必要です
- **有効期限**: 2026年12月31日を過ぎると、サーバー側のデータは削除され、メールアドレスでの購入確認ができなくなります
- **学習履歴**: 端末ごとに独立して保存されます（サーバー側には保存されません）

---

## アクセス制御

### PurchaseGuardコンポーネント
`app/components/PurchaseGuard.tsx`

有料コンテンツへのアクセスを制御するコンポーネント。

### 使用方法

```typescript
import PurchaseGuard from '../../components/PurchaseGuard';

export default function Chapter2Page() {
  return (
    <PurchaseGuard>
      {/* 有料コンテンツ */}
    </PurchaseGuard>
  );
}
```

### 動作
1. コンポーネントマウント時に購入状態をチェック（localStorage）
2. 未購入の場合、`/purchase`ページにリダイレクト
3. 購入済みの場合、子コンポーネントを表示

### 保護されているページ
- `/courses/chapter2` - 第2章
- `/courses/chapter3` - 第3章
- `/courses/chapter4` - 第4章
- `/courses/chapter5` - 第5章
- `/quiz` - 問題演習
- `/analytics` - 学習分析
- `/chat` - チャット（`NEXT_PUBLIC_ENABLE_CHAT=true`の場合）

### 無料でアクセス可能なページ
- `/` - ホームページ
- `/courses/chapter1` - 第1章
- `/purchase` - 販売ページ
- `/purchase/restore` - 購入状態復元ページ
- `/commerce` - 特定商取引法に基づく表記
- `/privacy` - プライバシーポリシー
- `/terms` - 利用規約

---

## 環境変数

### 必須環境変数

#### 本番環境
```env
# Stripe決済
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://generative-ai-passport-study.vercel.app

# Vercel KV（購入状態管理）
KV_REST_API_URL=https://xxxxx.upstash.io
KV_REST_API_TOKEN=AR_xxxxxxxxxxxxxxxxxxxxxxxx

# SendGrid（購入完了メール送信）
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=info@tayoima.com
EMAIL_FROM_NAME=tayoima 問い合わせ窓口

# 購入データの有効期限（オプション）
PURCHASE_EXPIRATION_DATE=2026-12-31T23:59:59+09:00
```

#### テスト環境
```env
# Stripe決済
STRIPE_SECRET_KEY=YOUR_STRIPE_TEST_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel KV（ローカル開発環境ではオプション）
KV_REST_API_URL=https://xxxxx.upstash.io
KV_REST_API_TOKEN=AR_xxxxxxxxxxxxxxxxxxxxxxxx

# SendGrid（ローカル開発環境ではオプション）
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=info@tayoima.com
EMAIL_FROM_NAME=tayoima 問い合わせ窓口
```

### その他の環境変数
```env
OPENAI_API_KEY=sk-...                    # OpenAI API（チャット機能用）
NEXT_PUBLIC_ENABLE_CHAT=true            # チャット機能の有効/無効
NODE_ENV=production                     # 実行環境
ALLOW_TEST_EMAIL=false                  # テストメール送信の許可（本番環境ではfalse推奨）
```

### 環境変数の設定場所
- **Vercel**: ダッシュボード → プロジェクト → Settings → Environment Variables
- **ローカル開発**: `.env.local`ファイル（Gitにコミットしない）

### 環境変数の説明

| 環境変数名 | 説明 | 必須 | 環境 |
|---------|------|------|------|
| `STRIPE_SECRET_KEY` | Stripe秘密キー | ✅ | Production, Preview |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe公開キー | ✅ | Production, Preview |
| `STRIPE_WEBHOOK_SECRET` | Webhook署名シークレット | ✅ | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | アプリケーションURL | ✅ | All |
| `KV_REST_API_URL` | Vercel KV REST API URL | ✅ | Production, Preview |
| `KV_REST_API_TOKEN` | Vercel KV REST API Token | ✅ | Production, Preview |
| `SENDGRID_API_KEY` | SendGrid APIキー | ✅ | Production, Preview |
| `SENDGRID_FROM_EMAIL` | 送信元メールアドレス | ✅ | Production, Preview |
| `EMAIL_FROM_NAME` | 送信者名 | ✅ | Production, Preview |
| `PURCHASE_EXPIRATION_DATE` | 購入データの有効期限 | ⚠️ | All（デフォルト: 2026-12-31T23:59:59+09:00） |
| `OPENAI_API_KEY` | OpenAI APIキー | ⚠️ | All（チャット機能使用時） |
| `NEXT_PUBLIC_ENABLE_CHAT` | チャット機能の有効/無効 | ⚠️ | All（デフォルト: false） |
| `NODE_ENV` | 実行環境 | ⚠️ | All |

**注意**: Sensitive環境変数（`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`SENDGRID_API_KEY`、`KV_REST_API_TOKEN`）は、Vercel DashboardではDevelopment環境に設定できません。

---

## 重要なファイル一覧

### 決済関連
| ファイル | 説明 |
|---------|------|
| `app/api/checkout/route.ts` | Stripe Checkoutセッション作成API |
| `app/api/webhook/stripe/route.ts` | Stripe Webhook（購入完了処理・メール送信） |
| `app/purchase/page.tsx` | 販売ランディングページ |
| `app/purchase/success/page.tsx` | 決済完了ページ |
| `app/purchase/restore/page.tsx` | 購入状態復元ページ |

### 購入状態管理
| ファイル | 説明 |
|---------|------|
| `app/utils/purchase.ts` | 購入状態管理ユーティリティ（クライアント側） |
| `app/lib/kv-storage.ts` | Vercel KVラッパー（サーバー側） |
| `app/api/verify-email/route.ts` | メールアドレスで購入状態を確認するAPI |
| `app/api/restore-purchase/route.ts` | メールアドレスで購入状態を復元するAPI |
| `app/components/PurchaseGuard.tsx` | アクセス制御コンポーネント |

### コンテンツ関連
| ファイル | 説明 |
|---------|------|
| `app/page.tsx` | ホームページ |
| `app/courses/chapter*/page.tsx` | 各章の学習ページ |
| `app/quiz/page.tsx` | 問題演習ページ |
| `app/analytics/page.tsx` | 学習分析ページ |
| `app/chat/page.tsx` | チャットページ |
| `data/courses.ts` | コースデータ |
| `data/reference-content.ts` | 参照コンテンツデータ |

### 法的文書
| ファイル | 説明 |
|---------|------|
| `app/commerce/page.tsx` | 特定商取引法に基づく表記 |
| `app/privacy/page.tsx` | プライバシーポリシー |
| `app/terms/page.tsx` | 利用規約 |

### 設定ファイル
| ファイル | 説明 |
|---------|------|
| `package.json` | 依存関係 |
| `env.example` | 環境変数のサンプル |
| `middleware.ts` | ミドルウェア（API保護など） |

---

## 改修時の注意点

### 1. 購入状態管理の変更

#### 現在の実装（ハイブリッド方式）
- **クライアント側**: localStorage（パフォーマンス向上）
- **サーバー側**: Vercel KV（メールアドレスでの購入確認）

#### 将来的な改善案
- ユーザー認証システムの導入
- 学習履歴のサーバー同期（ユーザー要望があれば）

**変更時の影響範囲**:
- `app/utils/purchase.ts` - 購入状態管理ロジック
- `app/lib/kv-storage.ts` - Vercel KVラッパー
- `app/components/PurchaseGuard.tsx` - アクセス制御
- `app/purchase/success/page.tsx` - 購入状態保存処理
- `app/api/webhook/stripe/route.ts` - Webhook処理

### 2. Stripe決済設定の変更

#### 価格変更
`app/api/checkout/route.ts`の`unit_amount`を変更：
```typescript
unit_amount: price || 500, // 金額（円）
```

#### 決済タイプの変更
買い切りからサブスクリプションに変更する場合：
- `mode: 'payment'` → `mode: 'subscription'`
- 価格設定の変更（`price_data` → `price`）
- Webhookイベントの変更（`checkout.session.completed` → 追加のイベントが必要）

**変更時の影響範囲**:
- `app/api/checkout/route.ts` - 決済セッション作成
- `app/purchase/page.tsx` - 販売ページの表示
- `app/api/webhook/stripe/route.ts` - Webhook処理
- `app/commerce/page.tsx` - 特定商取引法に基づく表記

### 3. アクセス制御の変更

#### 新しいページを追加する場合
1. `PurchaseGuard`コンポーネントでラップ
2. `app/page.tsx`のフッター・ヘッダーリンクを条件分岐
3. 購入状態に応じたリダイレクト処理を追加

#### 無料コンテンツを変更する場合
- `PurchaseGuard`を削除または条件分岐を追加

**変更時の影響範囲**:
- 対象ページの`page.tsx`
- `app/page.tsx` - ナビゲーションリンク
- `app/components/PurchaseGuard.tsx` - アクセス制御ロジック

### 4. 環境変数の変更

#### 本番キーとテストキーの切り替え
Vercelダッシュボードで環境変数を変更後、**必ず再デプロイ**が必要。

#### 新しい環境変数を追加する場合
1. Vercelダッシュボードで環境変数を追加
2. `env.example`にサンプルを追加
3. コードで環境変数を使用
4. 再デプロイ

### 5. ページ追加時の注意

#### 有料ページを追加する場合
```typescript
import PurchaseGuard from '../../components/PurchaseGuard';

export default function NewPage() {
  return (
    <PurchaseGuard>
      {/* ページコンテンツ */}
    </PurchaseGuard>
  );
}
```

#### ナビゲーションリンクの追加
`app/page.tsx`や`app/purchase/page.tsx`のフッター・ヘッダーで、購入状態に応じた条件分岐を追加：

```typescript
{purchased ? (
  <Link href="/new-page">新しいページ</Link>
) : (
  <Link href="/purchase">新しいページ</Link>
)}
```

### 6. 有効期限の変更

#### 購入データの有効期限を変更する場合
環境変数`PURCHASE_EXPIRATION_DATE`を変更：

```env
PURCHASE_EXPIRATION_DATE=2027-12-31T23:59:59+09:00
```

**変更時の影響範囲**:
- `app/api/webhook/stripe/route.ts` - Webhook処理（TTL計算）
- `app/commerce/page.tsx` - 特定商取引法に基づく表記
- `app/terms/page.tsx` - 利用規約
- `app/privacy/page.tsx` - プライバシーポリシー

**注意**: 既存の購入データには影響しません。新規購入から新しい期限が適用されます。

### 7. デプロイ時の注意

#### Vercelデプロイ
1. 環境変数が正しく設定されているか確認
2. ビルドエラーがないか確認
3. デプロイ後に動作確認

#### 環境変数の変更後
- **必ず再デプロイが必要**
- 環境変数の変更だけでは反映されない

#### Stripe Webhookの設定
本番環境でWebhookエンドポイントを設定：
1. Stripeダッシュボード → Developers → Webhooks
2. **Add endpoint**をクリック
3. **Endpoint URL**に以下を入力：
   ```
   https://generative-ai-passport-study.vercel.app/api/webhook/stripe
   ```
4. **Events to listen to**で`checkout.session.completed`を選択
5. **Add endpoint**をクリック
6. **Signing secret**をコピーして、Vercel Dashboardの環境変数`STRIPE_WEBHOOK_SECRET`に設定

---

## トラブルシューティング

### 決済が失敗する
1. Stripeダッシュボードでエラーログを確認
2. 環境変数が正しく設定されているか確認
3. APIキーが本番キー（`sk_live_...`）かテストキー（`sk_test_...`）か確認

### 購入状態が保存されない（localStorage）
1. ブラウザのlocalStorageが有効か確認
2. プライベートモード/シークレットモードでないか確認
3. ブラウザの開発者ツールでlocalStorageを確認

### 購入状態が保存されない（Vercel KV）
1. 環境変数`KV_REST_API_URL`と`KV_REST_API_TOKEN`が正しく設定されているか確認
2. Stripe Webhookが正常に動作しているか確認（Stripeダッシュボードで確認）
3. Vercel DashboardのLogsでエラーを確認

### メールアドレスでの購入確認ができない
1. メールアドレスが正しいか確認（購入時にStripeに登録したメールアドレス）
2. 購入データがVercel KVに保存されているか確認
3. 有効期限（2026年12月31日）を過ぎていないか確認

### 購入完了メールが届かない
1. SendGridの環境変数が正しく設定されているか確認
2. SendGridダッシュボードのActivityでメール送信履歴を確認
3. 送信元メールアドレス（`SENDGRID_FROM_EMAIL`）が認証されているか確認
4. スパムフォルダを確認

### 有料コンテンツにアクセスできない
1. 購入状態が正しく保存されているか確認（localStorage）
2. `PurchaseGuard`コンポーネントが正しく実装されているか確認
3. ブラウザのコンソールでエラーを確認
4. メールアドレスでの購入確認を試す

---

## 参考リンク

- [Stripe Checkout ドキュメント](https://docs.stripe.com/payments/checkout)
- [Stripe Webhooks ドキュメント](https://docs.stripe.com/webhooks)
- [Vercel KV ドキュメント](https://vercel.com/docs/storage/vercel-kv)
- [SendGrid ドキュメント](https://docs.sendgrid.com/)
- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Vercel 環境変数設定](https://vercel.com/docs/environment-variables)

---

## 変更履歴

- 2026年1月: 初版作成
- 2026年1月: Vercel KVによる購入状態管理、メールアドレスでの購入確認機能、購入完了メール送信機能を追加
