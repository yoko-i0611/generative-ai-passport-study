# Stripe承認後の本番環境設定ガイド

## 必要な対応（必須項目）

### 1. Stripeダッシュボードで本番APIキーを取得

1. **Stripeダッシュボードにログイン**
   - https://dashboard.stripe.com/ にアクセス

2. **本番APIキーの確認**
   - 左メニュー → 「開発者」→「APIキー」
   - 「本番環境のキーを表示」をクリック（テストモードから本番モードに切り替え）
   - **公開可能キー（Publishable key）**: `pk_live_...` で始まるキーをコピー
   - **シークレットキー（Secret key）**: `sk_live_...` で始まるキーをコピー
   - ⚠️ **シークレットキーは絶対に公開しないでください**

### 2. Vercelの環境変数を本番キーに更新

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard にアクセス
   - プロジェクトを選択

2. **環境変数の設定**
   - 「Settings」→「Environment Variables」を選択
   - 以下の環境変数を設定（Production環境）：

   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
   NEXT_PUBLIC_APP_URL=https://generative-ai-passport-study.vercel.app
   ```

3. **環境変数の確認**
   - すべての環境変数が正しく設定されていることを確認
   - 「Save」をクリック

4. **再デプロイ**
   - 環境変数を変更したら、再デプロイが必要です
   - 「Deployments」タブから最新のデプロイを選択
   - 「Redeploy」をクリック

### 3. アプリケーションURLの確認

`NEXT_PUBLIC_APP_URL`が正しく設定されていることを確認してください：

- 本番URL: `https://generative-ai-passport-study.vercel.app`
- これが`/purchase/success`と`/purchase`のリダイレクトURLとして使用されます

### 4. 動作確認

#### 4-1. テスト決済（推奨）

まず、小額（500円）でテスト決済を行い、正常に動作することを確認してください。

1. ブラウザで本番サイトにアクセス
   - https://generative-ai-passport-study.vercel.app/purchase

2. 「今すぐ購入する」ボタンをクリック

3. Stripe Checkoutページが表示されることを確認

4. **テストカードで決済**（本番キーでは実際の決済が発生します）
   - カード番号: 4242 4242 4242 4242
   - 有効期限: 未来の日付（例: 12/25）
   - CVC: 任意の3桁（例: 123）
   - 郵便番号: 任意（例: 12345）

5. 決済完了後、`/purchase/success`ページにリダイレクトされることを確認

6. 購入状態がlocalStorageに保存され、有料コンテンツにアクセスできることを確認

#### 4-2. 実際の決済（小額で確認）

テストが成功したら、実際のカードで小額（500円）決済をテストしてください。

### 5. エラーハンドリングの確認

以下のエラーが発生した場合の対応：

- **「Stripe secret key is not configured」**: 環境変数が正しく設定されていない
- **「Checkout URL not found」**: APIエンドポイントのエラー
- **決済ページが表示されない**: APIキーが正しくない、または本番キーが有効でない

## 現在の実装状況

### ✅ 実装済み

- Stripe Checkoutセッションの作成（買い切り決済：`mode: 'payment'`）
- 購入状態の管理（localStorage）
- 購入ガード機能（PurchaseGuard）
- 成功ページ（`/purchase/success`）

### 📝 注意事項

1. **Webhookは実装されていません**
   - 現在はクライアント側（localStorage）で購入状態を管理
   - サーバーサイドで購入履歴を管理する場合は、Webhookの実装が必要
   - 現時点では、Webhookなしでも動作します

2. **購入状態の保存場所**
   - ブラウザのlocalStorageに保存
   - ブラウザを変更したり、データを削除すると購入状態が失われる
   - より堅牢な実装が必要な場合は、サーバーサイドのデータベース管理を検討

3. **決済の確認方法**
   - Stripeダッシュボード → 「決済」→「決済一覧」で確認可能
   - 決済が成功した場合は「成功」と表示される

## トラブルシューティング

### 環境変数が反映されない

1. Vercelダッシュボードで環境変数を確認
2. 再デプロイを実行
3. ブラウザのキャッシュをクリア

### 決済が失敗する

1. Stripeダッシュボードでエラーログを確認
   - 「開発者」→「ログ」でエラーを確認
2. ブラウザのコンソールでエラーを確認
3. 本番APIキーが正しく設定されているか確認

### 購入状態が保存されない

1. ブラウザのlocalStorageが有効か確認
2. プライベートモード/シークレットモードでないか確認
3. ブラウザの開発者ツールでlocalStorageを確認

## 次のステップ（オプション）

将来的に検討できる改善：

1. **Webhookの実装**
   - サーバーサイドで決済状態を管理
   - より堅牢な購入状態管理

2. **購入履歴の管理**
   - データベースに購入履歴を保存
   - ユーザーが購入履歴を確認できる機能

3. **メール通知**
   - 決済完了時のメール送信
   - レシートの送信

4. **分析機能**
   - 決済データの分析
   - 売上の可視化

## 参考リンク

- [Stripe Checkout ドキュメント](https://docs.stripe.com/payments/checkout)
- [Stripe API リファレンス](https://docs.stripe.com/api)
- [Stripe ダッシュボード](https://dashboard.stripe.com/)

