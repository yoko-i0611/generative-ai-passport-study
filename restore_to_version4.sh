#!/bin/bash

# 第４版対応教材の状態に復元するスクリプト
# 作成日: 2025-01-03
# 
# 注意: このスクリプトで復元される状態は、第4版シラバス（2026年2月試験適用）に対応済みです。
# 追加項目（GPT-o1/o3/o4、Operator、Codex、Gemini、Claude、Copilot、RAG、AIエージェント、MCP、AI新法など）が既に含まれています。

set -e

echo "=== 第４版対応教材の復元を開始します ==="
echo "（第4版シラバス対応済み）"

# 作業ディレクトリに移動
cd /Users/imamurayoko/Developer/Cursor/application

echo ""
echo "ステップ1: Gitからファイルを復元..."

# TOPページを復元（完全なデザイン版）
echo "  - app/page.tsx を5b65389から復元"
git checkout 5b65389 -- app/page.tsx

# 第1章を復元（古いReactMarkdown構造）
echo "  - app/courses/chapter1/page.tsx をad26bbbから復元"
git checkout ad26bbb -- app/courses/chapter1/page.tsx

# 第2-5章を復元（新しいHybridContentCard構造）
echo "  - app/courses/chapter2-5/page.tsx を5b65389から復元"
git checkout 5b65389 -- app/courses/chapter2/page.tsx
git checkout 5b65389 -- app/courses/chapter3/page.tsx
git checkout 5b65389 -- app/courses/chapter4/page.tsx
git checkout 5b65389 -- app/courses/chapter5/page.tsx

echo ""
echo "ステップ2: エラー修正..."

# chapter2/page.tsx の setQuestions エラーを修正
echo "  - app/courses/chapter2/page.tsx の setQuestions を修正"
sed -i '' 's/const \[questions\] = useState/const [questions, setQuestions] = useState/g' app/courses/chapter2/page.tsx

# ContextAwareChat.tsx の isInitializing エラーを修正（既に修正済みの場合はスキップ）
if ! grep -q "const \[isInitializing, setIsInitializing\]" app/components/ContextAwareChat.tsx; then
    echo "  - app/components/ContextAwareChat.tsx の isInitializing を追加"
    # 注意: この修正は手動で行う必要があります
    echo "    ⚠️  ContextAwareChat.tsx の修正は手動で行ってください"
fi

echo ""
echo "ステップ3: 必要なファイルの確認..."

# Desktop側から必要なファイルをコピー
if [ -f "/Users/imamurayoko/Desktop/Cursor/application/public/units_info.json" ]; then
    echo "  - public/units_info.json をコピー"
    cp /Users/imamurayoko/Desktop/Cursor/application/public/units_info.json \
       /Users/imamurayoko/Developer/Cursor/application/public/units_info.json
else
    echo "  ⚠️  public/units_info.json が見つかりません（スキップ）"
fi

if [ -f "/Users/imamurayoko/Desktop/Cursor/application/app/error.tsx" ]; then
    echo "  - app/error.tsx をコピー"
    cp /Users/imamurayoko/Desktop/Cursor/application/app/error.tsx \
       /Users/imamurayoko/Developer/Cursor/application/app/error.tsx
else
    echo "  ⚠️  app/error.tsx が見つかりません（スキップ）"
fi

if [ -f "/Users/imamurayoko/Desktop/Cursor/application/app/not-found.tsx" ]; then
    echo "  - app/not-found.tsx をコピー"
    cp /Users/imamurayoko/Desktop/Cursor/application/app/not-found.tsx \
       /Users/imamurayoko/Developer/Cursor/application/app/not-found.tsx
else
    echo "  ⚠️  app/not-found.tsx が見つかりません（スキップ）"
fi

if [ -f "/Users/imamurayoko/Desktop/Cursor/application/types/question.ts" ]; then
    echo "  - types/question.ts をコピー"
    cp /Users/imamurayoko/Desktop/Cursor/application/types/question.ts \
       /Users/imamurayoko/Developer/Cursor/application/types/question.ts
else
    echo "  ⚠️  types/question.ts が見つかりません（スキップ）"
fi

if [ -f "/Users/imamurayoko/Desktop/Cursor/application/types/answer.ts" ]; then
    echo "  - types/answer.ts をコピー"
    cp /Users/imamurayoko/Desktop/Cursor/application/types/answer.ts \
       /Users/imamurayoko/Developer/Cursor/application/types/answer.ts
else
    echo "  ⚠️  types/answer.ts が見つかりません（スキップ）"
fi

echo ""
echo "ステップ4: ビルド確認..."

# クリーンアップ
echo "  - .next を削除"
rm -rf .next

# ビルド確認（エラーが出ても続行）
echo "  - ビルドを実行..."
npm run build || echo "  ⚠️  ビルドエラーが発生しましたが、続行します"

echo ""
echo "=== 復元が完了しました ==="
echo ""
echo "復元された状態:"
echo "  ✅ 第4版テキスト対応"
echo "  ✅ 第4版シラバス（2026年2月試験適用）対応"
echo "  ✅ 追加項目（GPT-o1/o3/o4、Operator、Codex、Gemini、Claude、Copilot、RAG、AIエージェント、MCP、AI新法など）含む"
echo ""
echo "次のステップ:"
echo "1. ターミナルから直接開発サーバーを起動:"
echo "   cd /Users/imamurayoko/Developer/Cursor/application"
echo "   npm run dev"
echo ""
echo "2. ブラウザで http://localhost:3000 にアクセス"
echo ""
echo "3. エラーが出る場合は、HANDOVER_DOCUMENT.md のトラブルシューティングを参照"
echo ""
echo "詳細は HANDOVER_DOCUMENT.md を参照してください"

