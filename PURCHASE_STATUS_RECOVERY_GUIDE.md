# 購入状態の回復方法ガイド

## 質問1: メールアドレスで識別させる方法に必要な対応

### 実装が必要な項目

#### 1. Stripe Checkoutセッションからメールアドレスを取得

現在、Stripe Checkoutでは自動的にメールアドレスが収集されますが、サーバーサイドで保存していません。

**必要な対応**:
- セッションIDからStripe APIでメールアドレスを取得
- メールアドレスと購入状態をサーバーサイドで保存（ファイルまたはデータベース）

#### 2. サーバーサイドでの購入状態保存

**簡易的な方法（ファイルベース）**:
- JSONファイルにメールアドレスと購入状態を保存
- Vercelの環境変数や外部ストレージを使用

**本格的な方法（データベース）**:
- データベース（Vercel Postgres、Supabase等）に購入履歴を保存
- メールアドレスとセッションIDを関連付けて保存

#### 3. メールアドレスで購入状態を確認するAPI

**必要なAPIエンドポイント**:
- `POST /api/verify-purchase` - メールアドレスで購入状態を確認
- `POST /api/restore-purchase` - メールアドレスで購入状態を復元

#### 4. 購入状態復元ページ

**必要なページ**:
- `/purchase/restore` - セッションIDまたはメールアドレスで購入状態を復元

---

## 質問2: 現状のまま販売する場合の対応方法

### 問題点

ユーザーが誤ってlocalStorageを削除してしまった場合：
- 購入状態が失われる
- 有料コンテンツにアクセスできなくなる
- ユーザーが困る

### セッションIDによる復元の動作

#### ✅ セッションIDを一度入力すれば、そのブラウザ/端末では以後利用可能

**動作フロー**:
1. ユーザーが別のブラウザ/端末でセッションIDを入力
2. Stripe APIで購入状態を確認
3. **そのブラウザ/端末のlocalStorageに購入状態を保存**
4. 以後、そのブラウザ/端末ではセッションIDを入力しなくても利用可能

**注意点**:
- **各ブラウザ/端末で1回ずつセッションIDを入力する必要がある**
- Chromeで入力 → Chromeでは以後利用可能
- Firefoxで入力 → Firefoxでは以後利用可能
- スマホで入力 → スマホでは以後利用可能

#### ⚠️ 学習履歴は端末を跨げない（正しい理解）

**現在の実装**:
- 学習履歴は`localStorage`に保存（`comprehensiveLearningHistory`）
- 問題演習履歴も`localStorage`に保存（`quizHistory`）
- **ブラウザ/端末ごとに独立して保存される**

**つまり**:
- PCで学習 → PCのlocalStorageに保存
- スマホで学習 → スマホのlocalStorageに保存
- **PCとスマホの学習履歴は共有されない**

**購入状態と学習履歴の違い**:
- **購入状態**: セッションIDで復元可能（Stripe APIで確認）
- **学習履歴**: セッションIDでは復元不可（localStorageにのみ保存）

### 実装可能な対応方法

#### 方法1: セッションIDによる購入状態の復元（推奨・実装可能）

現在、決済完了ページでセッションIDが表示されているので、これを利用します。

**実装内容**:
1. **セッションIDで購入状態を確認するAPI**を作成
   - `POST /api/verify-session` - セッションIDからStripe APIで購入状態を確認
2. **購入状態復元ページ**を作成
   - `/purchase/restore` - セッションIDを入力して購入状態を復元

**メリット**:
- 実装が簡単（データベース不要）
- 既にセッションIDが表示されている
- Stripe APIで購入履歴を確認できる

**ユーザーへの案内**:
- 決済完了ページに「セッションIDをメモしておいてください」と表示
- 購入状態が失われた場合、セッションIDで復元できることを案内

#### 方法2: メールアドレスによる購入状態の復元（将来的な改善）

メールアドレスで購入状態を確認する方法です。

**実装内容**:
1. Stripe Webhookで購入履歴を保存（メールアドレスとセッションIDを関連付け）
2. メールアドレスで購入状態を確認するAPI
3. 購入状態復元ページ（メールアドレス入力）

**メリット**:
- より堅牢な実装
- メールアドレスで簡単に復元可能

**デメリット**:
- 実装コストが高い
- データベースまたはストレージが必要

#### 方法3: 手動サポート（現状維持）

現在の実装を維持し、手動で対応する方法です。

**対応フロー**:
1. ユーザーがお問い合わせフォームから連絡
2. セッションIDまたはメールアドレスを確認
3. Stripeダッシュボードで購入履歴を確認
4. 購入が確認できたら、手動でlocalStorageを設定する方法を案内
   - または、管理者が一時的にアクセスできるようにする

**メリット**:
- 実装が不要
- すぐに対応可能

**デメリット**:
- 手動作業が必要
- ユーザー体験が低下する

---

## 推奨される実装（方法1: セッションIDによる復元）

### 実装手順

#### ステップ1: セッションIDで購入状態を確認するAPI

`app/api/verify-session/route.ts`を作成：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    // Stripe APIでセッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 決済が成功しているか確認
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        valid: true,
        email: session.customer_email || session.customer_details?.email,
        amount: session.amount_total,
        created: session.created,
      });
    }

    return NextResponse.json(
      { error: '有効な購入履歴が見つかりませんでした' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: error.message || 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
```

#### ステップ2: 購入状態復元ページ

`app/purchase/restore/page.tsx`を作成：

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { setPurchaseStatus } from '../../utils/purchase';

export default function RestorePurchasePage() {
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      if (data.valid) {
        // 購入状態を復元
        setPurchaseStatus(sessionId);
        setSuccess(true);
        
        // 3秒後にホームにリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        throw new Error('有効な購入履歴が見つかりませんでした');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gradient">生成AIパスポート試験対策</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/purchase" 
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          購入ページに戻る
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            購入状態の復元
          </h1>
          <p className="text-gray-600 mb-8">
            購入時に表示されたセッションIDを入力してください。
            セッションIDは、決済完了ページに表示されていました。
          </p>

          {success ? (
            <div className="bg-success-50 border-2 border-success-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                <h2 className="text-xl font-bold text-success-900">
                  購入状態を復元しました
                </h2>
              </div>
              <p className="text-success-700 mb-4">
                これで、すべての機能をご利用いただけます。
              </p>
              <p className="text-success-600 text-sm">
                3秒後にホームページにリダイレクトします...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRestore} className="space-y-6">
              <div>
                <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
                  セッションID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-gray-500 text-sm mt-2">
                  セッションIDは「cs_」で始まる文字列です。
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '確認中...' : '購入状態を復元'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              セッションIDが分からない場合
            </h3>
            <p className="text-gray-600 mb-4">
              セッションIDが分からない場合は、以下の方法でお問い合わせください：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
              <li>購入時のメールアドレス</li>
              <li>購入日時</li>
              <li>決済金額（500円）</li>
            </ul>
            <p className="text-gray-700">
              メールアドレス: <a href="mailto:info@tayoima.com" className="text-primary-600 hover:text-primary-700 underline">info@tayoima.com</a>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              ※ 返信までに3営業日程度かかる場合があります
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### ステップ3: 決済完了ページに復元方法を案内

`app/purchase/success/page.tsx`を更新して、セッションIDの重要性を案内：

```typescript
// セッションID表示部分を以下のように更新
{sessionId && (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
    <h3 className="font-semibold text-blue-900 mb-2">
      ⚠️ 重要: セッションIDを保存してください
    </h3>
    <p className="text-blue-700 text-sm mb-3">
      別のブラウザやデバイスで利用する場合、または購入状態が失われた場合に必要です。
    </p>
    <div className="bg-white rounded p-3 mb-3">
      <p className="text-xs text-gray-600 mb-1">セッションID:</p>
      <p className="font-mono text-gray-900 break-all">{sessionId}</p>
    </div>
    <Link 
      href="/purchase/restore" 
      className="text-blue-600 hover:text-blue-700 underline text-sm"
    >
      購入状態を復元する方法はこちら
    </Link>
  </div>
)}
```

#### ステップ4: ナビゲーションに復元ページへのリンクを追加

`app/page.tsx`や`app/purchase/page.tsx`のフッターに復元ページへのリンクを追加：

```typescript
<li>
  <Link href="/purchase/restore" className="text-gray-300 hover:text-white transition-colors text-sm">
    購入状態の復元
  </Link>
</li>
```

---

## 実装の優先順位

### 現状維持の場合（すぐに実装できる）

1. ✅ **セッションIDによる復元機能**（方法1）
   - 実装が簡単
   - データベース不要
   - すぐに実装可能

2. ✅ **決済完了ページでの案内**
   - セッションIDの重要性を案内
   - 復元方法へのリンクを追加

3. ✅ **お問い合わせフォームの活用**
   - セッションIDが分からない場合の手動サポート
   - 既に実装済み

### 将来的な改善（方法2: メールアドレスによる復元）

1. Stripe Webhookの実装
2. データベースへの購入履歴保存
3. メールアドレスでの復元機能

---

## ユーザーへの案内方法

### 決済完了ページでの案内

以下のような案内を表示：

```
⚠️ 重要: セッションIDを保存してください

別のブラウザやデバイスで利用する場合、または購入状態が失われた場合に必要です。
購入状態が失われた場合は、以下のページでセッションIDを入力して復元できます：

[購入状態を復元する]
```

### お問い合わせページでの案内

購入状態が失われた場合の対応方法を案内：

```
購入状態が失われた場合

1. セッションIDがある場合: [購入状態を復元する]ページで復元
2. セッションIDがない場合: お問い合わせフォームから連絡
   - 購入時のメールアドレス
   - 購入日時
   - 決済金額（500円）
```

---

## まとめ

### 現状維持の場合の推奨対応

1. **セッションIDによる復元機能を実装**（方法1）
   - 実装が簡単で効果的
   - データベース不要
   - ユーザー体験が向上

2. **決済完了ページで案内**
   - セッションIDの重要性を説明
   - 復元方法へのリンクを追加

3. **お問い合わせフォームで手動サポート**
   - セッションIDが分からない場合の対応

### 実装の可否

- ✅ **方法1（セッションIDによる復元）**: すぐに実装可能
- ⚠️ **方法2（メールアドレスによる復元）**: データベースが必要（将来的な改善）

現状維持の場合は、**方法1を実装することを強く推奨**します。

