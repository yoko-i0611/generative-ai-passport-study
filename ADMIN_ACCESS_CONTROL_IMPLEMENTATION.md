# 管理者画面アクセス制限の実装方法

## 実装可能な方法

Next.js + Vercel環境で、以下の2つの方法で管理者画面のアクセス制限を実装できます：

### 方法1: IPアドレス制限（推奨）

特定のIPアドレスからのみアクセスを許可する方法です。

### 方法2: ベーシック認証

ユーザー名とパスワードによる認証でアクセスを制限する方法です。

### 方法3: IPアドレス制限 + ベーシック認証（最強）

両方を組み合わせることで、より高いセキュリティを実現できます。

---

## 実装例

### 実装方法1: IPアドレス制限のみ

`middleware.ts`に以下のコードを追加します：

```typescript
import { NextRequest, NextResponse } from 'next/server';

// 許可するIPアドレスのリスト（環境変数から取得）
const ALLOWED_IPS = (process.env.ALLOWED_ADMIN_IPS || '').split(',').filter(Boolean);

export function middleware(request: NextRequest) {
  // 管理者画面へのアクセスのみをチェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     request.ip ||
                     'unknown';

    // IPアドレスが許可リストに含まれているか確認
    if (!ALLOWED_IPS.includes(clientIp)) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  // 既存のミドルウェア処理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://ai-learning-platform.vercel.app',
        process.env.NEXT_PUBLIC_APP_URL
      ].filter(Boolean);
      
      if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/(.*)',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**環境変数の設定（`.env.local`またはVercelの環境変数）**:
```
ALLOWED_ADMIN_IPS=123.456.789.0,98.76.54.32
```

**注意点**:
- Vercelでは、`x-forwarded-for`ヘッダーから実際のクライアントIPを取得できます
- 複数のIPアドレスを許可する場合は、カンマ区切りで指定します
- 動的IPアドレスの場合は、ベーシック認証と組み合わせることを推奨します

---

### 実装方法2: ベーシック認証のみ

`middleware.ts`に以下のコードを追加します：

```typescript
import { NextRequest, NextResponse } from 'next/server';

// ベーシック認証の認証情報（環境変数から取得）
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authHeader.substring(6), 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function middleware(request: NextRequest) {
  // 管理者画面へのアクセスのみをチェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticated(request)) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
    });
  }
}

  // 既存のミドルウェア処理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://ai-learning-platform.vercel.app',
        process.env.NEXT_PUBLIC_APP_URL
      ].filter(Boolean);
      
      if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/(.*)',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**環境変数の設定（`.env.local`またはVercelの環境変数）**:
```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

**注意点**:
- パスワードは強力なものを使用してください（大文字・小文字・数字・記号を含む12文字以上推奨）
- 環境変数はVercelのダッシュボードで設定してください（`.env.local`は本番環境では使用されません）
- ブラウザが認証情報をキャッシュするため、パスワード変更後はブラウザのキャッシュをクリアする必要があります

---

### 実装方法3: IPアドレス制限 + ベーシック認証（推奨）

最も安全な方法です。`middleware.ts`に以下のコードを追加します：

```typescript
import { NextRequest, NextResponse } from 'next/server';

// 許可するIPアドレスのリスト（環境変数から取得）
const ALLOWED_IPS = (process.env.ALLOWED_ADMIN_IPS || '').split(',').filter(Boolean);

// ベーシック認証の認証情報（環境変数から取得）
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authHeader.substring(6), 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function isAllowedIP(request: NextRequest): boolean {
  // IPアドレス制限が設定されていない場合は、すべてのIPを許可
  if (ALLOWED_IPS.length === 0) {
    return true;
  }

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   request.ip ||
                   'unknown';

  return ALLOWED_IPS.includes(clientIp);
}

export function middleware(request: NextRequest) {
  // 管理者画面へのアクセスのみをチェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // まずIPアドレスをチェック
    if (!isAllowedIP(request)) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    // IPアドレスが許可されている場合、ベーシック認証をチェック
    if (!isAuthenticated(request)) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  // 既存のミドルウェア処理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://ai-learning-platform.vercel.app',
        process.env.NEXT_PUBLIC_APP_URL
      ].filter(Boolean);
      
      if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/(.*)',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**環境変数の設定（`.env.local`またはVercelの環境変数）**:
```
ALLOWED_ADMIN_IPS=123.456.789.0,98.76.54.32
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

---

## 推奨設定

### Stripe申請用の回答

Stripeのセキュリティチェックリストに回答する場合、以下のように回答できます：

**質問**: 管理者のアクセス可能な IP アドレスを制限する。IP アドレスを制限できない場合は管理画面にベーシック認証等のアクセス制限を設ける。

**回答**: **はい**

管理者画面（`/admin`）へのアクセスは、以下の2つの方法で制限しています：
1. **IPアドレス制限**: 許可されたIPアドレスからのアクセスのみを許可
2. **ベーシック認証**: ユーザー名とパスワードによる認証を実装

これにより、二重のセキュリティ層を設けて、不正アクセスを防止しています。

---

## 実装手順

1. **現在のIPアドレスの確認**
   - 自分のIPアドレスを確認: https://www.whatismyip.com/
   - 許可するIPアドレスをリストアップ

2. **環境変数の設定**
   - Vercelダッシュボード → プロジェクト設定 → Environment Variables
   - `ALLOWED_ADMIN_IPS`: 許可するIPアドレス（カンマ区切り）
   - `ADMIN_USERNAME`: 管理者ユーザー名
   - `ADMIN_PASSWORD`: 管理者パスワード（強力なパスワードを推奨）

3. **middleware.tsの更新**
   - 上記の実装方法3（IP制限 + ベーシック認証）を推奨
   - 既存のミドルウェアコードに追加

4. **テスト**
   - 開発環境で動作確認
   - 許可されていないIPからアクセスした場合の動作確認
   - ベーシック認証の動作確認

5. **デプロイ**
   - Vercelにデプロイ
   - 本番環境での動作確認

---

## 注意事項

1. **IPアドレスの変更**
   - 動的IPアドレスの場合、IPアドレスが変更されるたびに環境変数を更新する必要があります
   - この場合は、ベーシック認証のみを使用するか、VPN経由で固定IPアドレスを使用することを検討してください

2. **パスワードの管理**
   - パスワードは環境変数で管理し、コードに直接記載しないでください
   - 定期的にパスワードを変更することを推奨します
   - 強力なパスワードを使用してください（12文字以上、大文字・小文字・数字・記号を含む）

3. **Vercelの制限**
   - Vercelの無料プランでも実装可能です
   - Enterpriseプランでは、追加のアクセス制限機能が利用可能です

4. **開発環境**
   - 開発環境（`localhost`）では、IP制限を緩和するか、開発用の設定を追加することを検討してください

---

## まとめ

- **実装は可能**: Next.jsのMiddlewareを使用して実装できます
- **推奨方法**: IPアドレス制限 + ベーシック認証の組み合わせ
- **設定場所**: `middleware.ts`と環境変数（Vercelダッシュボード）
- **Stripe申請**: 「はい」と回答できます（実装後に）

