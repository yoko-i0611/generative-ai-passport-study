#!/bin/bash
# 変更前に状態を確認するスクリプト

echo "🔍 変更前の状態確認を開始します..."

# 1. Gitの状態確認
echo ""
echo "📋 Gitの状態:"
git status --short

# 2. ビルド確認
echo ""
echo "🔨 ビルド確認中..."
if npm run build > /dev/null 2>&1; then
    echo "✅ ビルド成功"
else
    echo "❌ ビルドエラーがあります"
    echo "以下のコマンドで詳細を確認してください:"
    echo "  npm run build"
    exit 1
fi

# 3. リンター確認
echo ""
echo "📝 リンター確認中..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ リンターエラーなし"
else
    echo "⚠️  リンターエラーがあります（警告のみの可能性）"
    echo "以下のコマンドで詳細を確認してください:"
    echo "  npm run lint"
fi

# 4. 開発サーバーの状態確認
echo ""
echo "🌐 開発サーバーの状態:"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ 開発サーバーが起動しています（ポート3000）"
else
    echo "⚠️  開発サーバーが起動していません"
    echo "以下のコマンドで起動してください:"
    echo "  npm run dev"
fi

echo ""
echo "✅ 状態確認完了"
echo ""
echo "📝 次のステップ:"
echo "1. 変更を開始する前に、現在の状態で動作確認"
echo "2. 各Phaseごとにビルドと動作確認"
echo "3. 問題があればすぐに元に戻す"


