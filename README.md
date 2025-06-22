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

`.env.local` ファイルを作成し、OpenAI APIキーを設定：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🌐 デプロイ

### Vercel（推奨）

1. [Vercel](https://vercel.com) にアカウント作成
2. GitHubリポジトリを接続
3. 環境変数 `OPENAI_API_KEY` を設定
4. デプロイ完了

### その他のプラットフォーム

- **Netlify**: 同様の手順でデプロイ可能
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

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📞 サポート

問題が発生した場合は、GitHubのイシューを作成してください。 