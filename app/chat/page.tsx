'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '../components/Chat';
import PurchaseGuard from '../components/PurchaseGuard';

// 環境変数からチャット機能の有効/無効を取得
const isChatEnabled = process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // チャット機能が無効化されている場合はホームページにリダイレクト
    if (!isChatEnabled) {
      router.push('/');
    }
  }, [router]);

  // チャット機能が無効化されている場合は何も表示しない（リダイレクト中）
  if (!isChatEnabled) {
    return null;
  }

  // 購入チェック: 購入済みの場合のみチャット機能を表示
  return (
    <PurchaseGuard>
      <Chat />
    </PurchaseGuard>
  );
} 