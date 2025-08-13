# AI学習アシスタント - 生成AIパスポート試験対策

生成AIパスポート試験の学習をサポートするAIチャットボットアプリケーションです。

## 🚀 機能

- **AIチャットボット**: 生成AIパスポート試験に関する質問に回答
- **学習コース**: 章別の学習コンテンツ
- **クイズ機能**: 理解度を確認するクイズ
- **モダンUI**: 美しく使いやすいインターフェース

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **アイコン**: Lucide React
- **アニメーション**: Framer Motion

## 📦 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/ai-learning-platform.git
cd ai-learning-platform
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、必要な設定を行う：

```env
# 必須: OpenAI APIキー
OPENAI_API_KEY=your_openai_api_key_here

# オプション: チャット機能の有効/無効（本番環境では false 推奨）
NEXT_PUBLIC_ENABLE_CHAT=true
```

⚠️ **セキュリティ注意事項**: 
- `.env.local` ファイルは絶対にGitにコミットしないでください
- 本番環境では `NEXT_PUBLIC_ENABLE_CHAT=false` でコストを制御することを推奨

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🌐 デプロイ

### Vercel（推奨）

#### 1. 事前準備
```bash
# プロジェクトのビルドテスト
npm run build

# 設定ファイルの確認
ls vercel.json next.config.mjs
```

#### 2. Vercelでのデプロイ手順
1. [Vercel](https://vercel.com) にアカウント作成
2. GitHubリポジトリを接続
3. **重要**: 以下の環境変数を設定
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ENABLE_CHAT=true
   NODE_ENV=production
   ```
4. デプロイ実行

#### 3. デプロイ後の確認事項
- ✅ チャット機能が正常動作すること
- ✅ APIエンドポイントが保護されていること
- ✅ 不正アクセスがブロックされること
- ✅ レート制限が機能していること

### その他のプラットフォーム

- **Netlify**: 同様の手順でデプロイ可能（functions設定が必要）
- **Railway**: GitHubリポジトリを接続して自動デプロイ

## 📚 使用方法

1. **ホームページ**: 学習コースの一覧を確認
2. **チャット**: AIアシスタントに質問
3. **コース学習**: 章別の学習コンテンツを閲覧
4. **クイズ**: 理解度を確認

## 🔧 カスタマイズ

### 学習コンテンツの追加

`data/courses.ts` ファイルを編集して新しいコースを追加できます。

### UIのカスタマイズ

`app/components/Chat.tsx` を編集してチャットUIをカスタマイズできます。

## 🔒 セキュリティとデプロイメント

### 本番環境での安全な公開方法

#### 1. APIキーの保護
- ✅ **サーバーサイドのみでAPIキーを使用**（クライアントに露出しない）
- ✅ **環境変数での管理**（`.env.local` は `.gitignore` で除外済み）
- ✅ **デプロイ先での環境変数設定**（Vercel、Netlify等で設定）

#### 2. コスト制御対策
```env
# 本番環境推奨設定
NEXT_PUBLIC_ENABLE_CHAT=false  # チャット機能を無効化
NODE_ENV=production
```

#### 3. 実装済みセキュリティ対策
- **オリジン制限**: 本番環境では許可されたドメインのみアクセス可能
- **リファラーチェック**: 直接API呼び出しをブロック
- **レート制限**: 3秒に1回のリクエスト制限
- **メッセージ長制限**: 1000文字以内
- **不正アクセス検出**: ボット・クローラーのブロック
- **セキュリティヘッダー**: XSS対策、フレーム埋め込み防止
- **入力検証**: 不正なリクエストの拒否
- **エラーハンドリング**: APIキー情報の非表示

#### 4. 推奨デプロイメント設定

**Vercel デプロイ時**:
```bash
# 環境変数設定
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_ENABLE_CHAT=false  # コスト制御
NODE_ENV=production
```

**注意事項**:
- 🚨 チャット機能は OpenAI API の従量課金となります
- 🚨 公開時は `NEXT_PUBLIC_ENABLE_CHAT=false` でチャット無効化を推奨
- 🚨 使用量監視とAPI利用制限の設定を行ってください

### 懸念事項と対策

#### 主要リスク
1. **API コスト**: 大量利用時の予想外の課金
2. **悪用**: 自動化ツールによる大量リクエスト
3. **負荷**: 同時アクセス増加時のパフォーマンス

#### 対策済み項目
- ✅ レート制限（3秒/リクエスト）
- ✅ メッセージ長制限（1000文字）
- ✅ ボット検出・ブロック
- ✅ チャット機能の簡単無効化
- ✅ エラーハンドリング強化

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📞 サポート

問題が発生した場合は、GitHubのイシューを作成してください。 