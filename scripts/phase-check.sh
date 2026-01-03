#!/bin/bash
# 各Phaseごとにチェックするスクリプト

PHASE=$1

if [ -z "$PHASE" ]; then
    echo "使用方法: ./scripts/phase-check.sh <phase-number>"
    echo "例: ./scripts/phase-check.sh 1"
    exit 1
fi

echo "🔍 Phase $PHASE の確認を開始します..."

# 1. ビルド確認
echo ""
echo "🔨 ビルド確認中..."
if npm run build 2>&1 | grep -i "error\|failed" > /dev/null; then
    echo "❌ ビルドエラーがあります"
    npm run build 2>&1 | grep -i "error\|failed" | head -10
    exit 1
else
    echo "✅ ビルド成功"
fi

# 2. リンター確認
echo ""
echo "📝 リンター確認中..."
if npm run lint 2>&1 | grep -i "error" > /dev/null; then
    echo "❌ リンターエラーがあります"
    npm run lint 2>&1 | grep -i "error" | head -10
    exit 1
else
    echo "✅ リンターエラーなし"
fi

# 3. 開発サーバーの状態確認
echo ""
echo "🌐 開発サーバーの状態:"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ 開発サーバーが起動しています"
    echo ""
    echo "📋 次のステップ:"
    echo "1. ブラウザで http://localhost:3000 を確認"
    echo "2. エラーがないか確認（F12でコンソールを確認）"
    echo "3. 正常に動作することを確認"
    echo ""
    echo "✅ Phase $PHASE の確認完了"
    echo "問題がなければ、コミットしてください:"
    echo "  git add ."
    echo "  git commit -m \"Phase $PHASE: [変更内容]\""
else
    echo "⚠️  開発サーバーが起動していません"
    echo "以下のコマンドで起動してください:"
    echo "  npm run dev"
fi

