# Operation not permitted エラーの対処方法

**作成日**: 2025-01-03  
**問題**: Next.jsのビルド時に`Operation not permitted (os error 1)`エラーが発生

---

## 🔍 問題の原因

Next.jsが`node_modules/next/dist/client/components/router-reducer/`内のファイルを読み取れない権限エラーが発生しています。

**エラーメッセージ**:
```
Error: Failed to read source code from /Users/imamurayoko/Developer/Cursor/application/node_modules/next/dist/client/components/router-reducer/create-router-cache-key.js
Caused by:
    Operation not permitted (os error 1)
```

---

## ✅ 対処方法

### 方法1: 開発サーバーを完全に停止して再起動（推奨）

```bash
cd /Users/imamurayoko/Developer/Cursor/application

# 1. 既存のプロセスを停止
kill -9 $(lsof -ti:3000) 2>/dev/null || true

# 2. .nextディレクトリを削除
rm -rf .next

# 3. 開発サーバーを再起動（ターミナルで直接実行）
npm run dev
```

### 方法2: node_modulesの権限を確認・修正

```bash
cd /Users/imamurayoko/Developer/Cursor/application

# node_modulesの読み取り権限を確認
ls -la node_modules/next/dist/client/components/router-reducer/ | head -5

# 権限を修正（必要に応じて）
chmod -R u+r node_modules/next
```

### 方法3: node_modulesを再インストール（最終手段）

```bash
cd /Users/imamurayoko/Developer/Cursor/application

# 1. 既存のプロセスを停止
kill -9 $(lsof -ti:3000) 2>/dev/null || true

# 2. node_modulesと.nextを削除
rm -rf node_modules .next package-lock.json

# 3. 再インストール
npm install

# 4. 開発サーバーを起動
npm run dev
```

---

## 🔍 確認事項

### 1. ポート3000が使用中でないことを確認

```bash
lsof -ti:3000
# 何も出力されなければ使用されていない
```

### 2. 開発サーバーが正常に起動していることを確認

ターミナルで`npm run dev`を実行した際に、以下のようなメッセージが表示されることを確認：

```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000

 ✓ Ready in X.XXs
```

### 3. ブラウザで確認

- `http://localhost:3000/` にアクセス
- エラーが解消されているか確認

---

## ⚠️ 重要な注意事項

1. **このエラーはAPI実装とは無関係です**
   - 今回実装した`app/api/quiz-questions/route.ts`の変更は原因ではありません
   - システムレベルの権限問題です

2. **開発サーバーをターミナルで直接起動することを推奨**
   - Cursor内から起動するよりも、ターミナルで直接`npm run dev`を実行する方が安定します

3. **iCloudの影響はありません**
   - 現在のワークスペース（`/Users/imamurayoko/Developer/Cursor/application`）はiCloud Driveの影響を受けません

---

## 📝 次のステップ

1. 上記の方法1を試してください（最も簡単）
2. エラーが解消されれば、300問の問題演習をテストしてください
3. まだエラーが出る場合は、方法2または方法3を試してください

---

## 📚 関連ドキュメント

- [`開発サーバー起動手順.md`](./開発サーバー起動手順.md) - 開発サーバーの起動方法とトラブルシューティング
- [`README.md`](./README.md) - プロジェクトの概要とトラブルシューティング
- [`HANDOVER_SUMMARY.md`](./HANDOVER_SUMMARY.md) - 引き継ぎサマリー

---

**最終更新**: 2025-01-03  
**状態**: 対処方法を整理、関連ドキュメントへのリンクを追加

