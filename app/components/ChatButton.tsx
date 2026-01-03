'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ContextAwareChat from './ContextAwareChat';

export default function ChatButton() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* 右下固定のチャットボタン */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label="AI講師に質問する"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* チャットウィンドウ */}
      {chatOpen && (
        <ContextAwareChat
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          streaming={true}
          streamDelayMs={15}
        />
      )}
    </>
  );
}

