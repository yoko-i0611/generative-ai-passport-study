# SendGrid セットアップガイド

購入完了メール送信機能でSendGridを使用する場合のセットアップ手順です。

## 📋 前提条件

- SendGridアカウントの作成（完了）
- メール認証（進行中）
- DNS設定（反映待ち）

## 🔧 環境変数の設定

### Vercel Dashboardでの設定

1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下の環境変数を追加：

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=生成AIパスポート試験対策
```

### ローカル環境（.env.local）での設定

```env
# SendGrid設定（推奨）
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=生成AIパスポート試験対策

# または、Gmail設定（後方互換性のため）
# GMAIL_USER=your-email@gmail.com
# GMAIL_APP_PASSWORD=your-16-digit-app-password
```

## 🔑 SendGrid APIキーの取得方法

1. SendGrid Dashboardにログイン
2. Settings → API Keys に移動
3. 「Create API Key」をクリック
4. API Key名を入力（例: "購入完了メール送信"）
5. 権限を設定：
   - **Full Access**（推奨）または
   - **Restricted Access** → Mail Send → Full Access
6. 「Create & View」をクリック
7. 表示されたAPIキーをコピー（**一度しか表示されないため、必ず保存**）

## 📧 送信元メールアドレスの設定

### オプション1: SendGridの「Sender Authentication」を使用（推奨）

1. SendGrid Dashboard → Settings → Sender Authentication
2. 「Verify a Single Sender」をクリック
3. 送信元メールアドレスを入力（例: `noreply@your-domain.com`）
4. メール認証を完了
5. DNS設定（SPF、DKIM）を完了（反映に時間がかかります）

### オプション2: ドメイン認証を使用（より信頼性が高い）

1. SendGrid Dashboard → Settings → Sender Authentication
2. 「Authenticate Your Domain」をクリック
3. ドメイン名を入力
4. DNS設定（CNAME、TXTレコード）を追加
5. DNS設定の反映を待つ（数時間〜最大48時間）

## 🔍 設定の確認

### メール送信設定の確認

```bash
# ローカル環境でテスト
npm run dev

# ブラウザの開発者ツールのコンソールで
fetch('/api/test-purchase-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@example.com' })
})
.then(res => res.json())
.then(data => console.log(data));
```

### SendGrid Dashboardでの確認

1. SendGrid Dashboard → Activity
2. メール送信の履歴を確認
3. エラーがないか確認

## 🚀 本番環境での動作確認

1. Vercel Dashboardで環境変数を設定
2. デプロイを実行
3. テスト購入を実行
4. メールが届くことを確認
5. SendGrid Dashboardで送信ログを確認

## ⚠️ 注意事項

### 送信制限

- **無料プラン**: 1日100通まで
- 制限を超えると、メール送信が失敗します
- 送信状況はSendGrid Dashboardで確認できます

### セキュリティ

- APIキーは絶対に公開しないでください
- `.env.local`は`.gitignore`に含まれていることを確認
- Vercel Dashboardでは「Sensitive」にチェックを入れる

### DNS設定の反映時間

- 通常: 数時間
- 最大: 48時間
- DNS設定が反映されるまで、メール送信は可能ですが、SPF/DKIM認証は完了していません

## 🔄 GmailからSendGridへの移行

### 現在の設定（Gmail）

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
```

### 新しい設定（SendGrid）

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@your-domain.com
EMAIL_FROM_NAME=生成AIパスポート試験対策
```

### 移行手順

1. SendGrid APIキーを取得
2. 環境変数を設定（SendGridを優先）
3. Gmailの環境変数は残しておいても問題ありません（後方互換性のため）
4. テスト送信で動作確認
5. 問題がなければ、Gmailの環境変数を削除しても構いません

## 📚 参考リンク

- [SendGrid公式ドキュメント](https://docs.sendgrid.com/)
- [SendGrid API Keys](https://docs.sendgrid.com/ui/account-and-settings/api-keys)
- [Sender Authentication](https://docs.sendgrid.com/ui/sending-email/sender-verification)

---

**作成日**: 2026年1月10日  
**状況**: SendGridセットアップ進行中（DNS設定反映待ち）

