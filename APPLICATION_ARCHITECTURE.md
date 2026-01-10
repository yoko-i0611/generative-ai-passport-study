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
- **データ保存**: ブラウザのlocalStorage（クライアントサイド）

### 主要機能
- 学習コンテンツ（5章構成、第1章は無料）
- 問題演習（300問）
- 学習分析・進捗管理
- Stripe決済（500円・買い切り）
- 購入状態に基づくコンテンツアクセス制御

---

## ディレクトリ構造

```
application/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── checkout/
│   │       └── route.ts          # Stripe Checkoutセッション作成
│   ├── components/               # 共通コンポーネント
│   │   └── PurchaseGuard.tsx     # 購入ガードコンポーネント
│   ├── courses/                  # 学習コースページ
│   │   ├── chapter1/             # 第1章（無料）
│   │   ├── chapter2/             # 第2章（有料）
│   │   ├── chapter3/             # 第3章（有料）
│   │   ├── chapter4/             # 第4章（有料）
│   │   └── chapter5/             # 第5章（有料）
│   ├── purchase/                 # 販売・決済関連
│   │   ├── page.tsx              # 販売ランディングページ
│   │   └── success/
│   │       └── page.tsx          # 決済完了ページ
│   ├── quiz/                     # 問題演習ページ（有料）
│   ├── analytics/                # 学習分析ページ（有料）
│   ├── commerce/                 # 特定商取引法に基づく表記
│   ├── privacy/                  # プライバシーポリシー
│   ├── terms/                    # 利用規約
│   ├── utils/
│   │   └── purchase.ts           # 購入状態管理ユーティリティ
│   ├── page.tsx                  # ホームページ
│   └── layout.tsx                # ルートレイアウト
├── data/                         # データファイル
│   └── courses.ts                # コースデータ
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
7. 購入状態をlocalStorageに保存
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

#### `app/purchase/page.tsx`
販売ランディングページ。購入ボタンから決済フローを開始。

#### `app/purchase/success/page.tsx`
決済完了ページ。購入状態をlocalStorageに保存。

---

## 購入状態管理

### 実装方法
ブラウザの**localStorage**を使用してクライアントサイドで購入状態を管理。

### 管理ファイル
`app/utils/purchase.ts`

### 主要関数

#### `isPurchased(): boolean`
購入状態をチェック。localStorageに`purchase_status: 'purchased'`が存在するか確認。

#### `setPurchaseStatus(sessionId?: string): void`
購入状態を保存。`purchase_status: 'purchased'`をlocalStorageに保存。

#### `getPurchaseStatus(): PurchaseStatus`
購入状態の詳細情報を取得。

### データ構造

```typescript
interface PurchaseStatus {
  isPurchased: boolean;
  sessionId?: string;
  purchasedAt?: string;
}
```

### 注意事項
- **ブラウザを変更すると購入状態が失われる**
- **localStorageを削除すると購入状態が失われる**
- **サーバーサイドでは購入状態を確認できない**（クライアントサイドのみ）

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
1. コンポーネントマウント時に購入状態をチェック
2. 未購入の場合、`/purchase`ページにリダイレクト
3. 購入済みの場合、子コンポーネントを表示

### 保護されているページ
- `/courses/chapter2` - 第2章
- `/courses/chapter3` - 第3章
- `/courses/chapter4` - 第4章
- `/courses/chapter5` - 第5章
- `/quiz` - 問題演習
- `/analytics` - 学習分析

### 無料でアクセス可能なページ
- `/` - ホームページ
- `/courses/chapter1` - 第1章
- `/purchase` - 販売ページ
- `/commerce` - 特定商取引法に基づく表記
- `/privacy` - プライバシーポリシー
- `/terms` - 利用規約

---

## 環境変数

### 必須環境変数

#### 本番環境
```env
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
NEXT_PUBLIC_APP_URL=https://generative-ai-passport-study.vercel.app
```

#### テスト環境
```env
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### その他の環境変数
```env
OPENAI_API_KEY=sk-...                    # OpenAI API（チャット機能用）
NEXT_PUBLIC_ENABLE_CHAT=true            # チャット機能の有効/無効
NODE_ENV=production                     # 実行環境
```

### 環境変数の設定場所
- **Vercel**: ダッシュボード → プロジェクト → Settings → Environment Variables
- **ローカル開発**: `.env.local`ファイル（Gitにコミットしない）

---

## 重要なファイル一覧

### 決済関連
| ファイル | 説明 |
|---------|------|
| `app/api/checkout/route.ts` | Stripe Checkoutセッション作成API |
| `app/purchase/page.tsx` | 販売ランディングページ |
| `app/purchase/success/page.tsx` | 決済完了ページ |
| `app/utils/purchase.ts` | 購入状態管理ユーティリティ |
| `app/components/PurchaseGuard.tsx` | アクセス制御コンポーネント |

### コンテンツ関連
| ファイル | 説明 |
|---------|------|
| `app/page.tsx` | ホームページ |
| `app/courses/chapter*/page.tsx` | 各章の学習ページ |
| `app/quiz/page.tsx` | 問題演習ページ |
| `app/analytics/page.tsx` | 学習分析ページ |
| `data/courses.ts` | コースデータ |

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

#### 現在の実装（localStorage）
- クライアントサイドのみで管理
- ブラウザ変更で失われる
- サーバーサイドで確認できない

#### 将来的な改善案
- サーバーサイドのデータベースに購入履歴を保存
- Stripe Webhookで決済完了をサーバー側で処理
- ユーザー認証システムの導入

**変更時の影響範囲**:
- `app/utils/purchase.ts` - 購入状態管理ロジック
- `app/components/PurchaseGuard.tsx` - アクセス制御
- `app/purchase/success/page.tsx` - 購入状態保存処理

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
- Webhookの実装が必要

**変更時の影響範囲**:
- `app/api/checkout/route.ts` - 決済セッション作成
- `app/purchase/page.tsx` - 販売ページの表示

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

### 6. Stripe Webhookの実装（将来的な改善）

現在は実装されていませんが、サーバーサイドで購入状態を管理する場合は必要です。

**実装が必要な場合**:
1. `app/api/webhooks/stripe/route.ts`を作成
2. StripeダッシュボードでWebhookエンドポイントを登録
3. 決済完了イベント（`checkout.session.completed`）を処理
4. データベースに購入履歴を保存

### 7. デプロイ時の注意

#### Vercelデプロイ
1. 環境変数が正しく設定されているか確認
2. ビルドエラーがないか確認
3. デプロイ後に動作確認

#### 環境変数の変更後
- **必ず再デプロイが必要**
- 環境変数の変更だけでは反映されない

---

## トラブルシューティング

### 決済が失敗する
1. Stripeダッシュボードでエラーログを確認
2. 環境変数が正しく設定されているか確認
3. APIキーが本番キー（`sk_live_...`）かテストキー（`sk_test_...`）か確認

### 購入状態が保存されない
1. ブラウザのlocalStorageが有効か確認
2. プライベートモード/シークレットモードでないか確認
3. ブラウザの開発者ツールでlocalStorageを確認

### 有料コンテンツにアクセスできない
1. 購入状態が正しく保存されているか確認
2. `PurchaseGuard`コンポーネントが正しく実装されているか確認
3. ブラウザのコンソールでエラーを確認

---

## 参考リンク

- [Stripe Checkout ドキュメント](https://docs.stripe.com/payments/checkout)
- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Vercel 環境変数設定](https://vercel.com/docs/environment-variables)

---

## 変更履歴

- 2026年1月: 初版作成（Stripe決済実装完了後）

