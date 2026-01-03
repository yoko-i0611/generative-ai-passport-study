'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ContextAwareChatProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string; // オプショナルに変更（質問専用のため）
  topicTitle?: string; // オプショナルに変更
  streaming?: boolean;
  streamDelayMs?: number;
}

export default function ContextAwareChat({
  isOpen,
  onClose,
  sectionId,
  topicTitle,
  streaming = true,
  streamDelayMs = 15, // ストリーミング速度を改善（30ms → 15ms）
}: ContextAwareChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // スクロールを最下部に
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初期メッセージの自動生成を削除（質問専用にするため）
  // useEffect(() => {
  //   if (isOpen && messages.length === 0 && sectionId) {
  //     initializeChat();
  //   }
  // }, [isOpen, sectionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setIsInitializing(true);
    
    try {
      // サーバーサイドからreferenceContentを取得
      const contentResponse = await fetch(`/api/reference-content?sectionId=${sectionId}`);
      if (!contentResponse.ok) {
        throw new Error('参照コンテンツの取得に失敗しました');
      }
      const contentData = await contentResponse.json();
      const referenceContent = contentData.content;

      // システムプロンプトを作成
      const systemPrompt = `あなたは「生成AIパスポート試験」のプロフェッショナル講師です。経験豊富で、学習者が試験に合格するためのポイントを明確に示し、「なるほど！」と腑に落ちる解説を得意としています。

ユーザーは現在、以下の【教科書データ】について学習しようとしています。

【教科書データ】
${referenceContent}

## あなたの最重要タスク：試験合格のためのポイント解説

**試験のシラバスやテキストから、試験に合格するためにどのような点がポイントになり、何をよく理解しておく必要があるかを明確に解説してください。**

### 解説の優先順位

1. **試験に出やすいポイントを明確に示す**
   - シラバスやテキストから、試験で問われやすい内容を抽出して説明
   - 「この部分は正誤問題でよく出る」「この数値は暗記必須」など、具体的な試験対策のポイントを示す

2. **理解しておくべき重要ポイントを噛み砕いて説明**
   - 「なぜこの技術が重要か」「なぜ試験で問われるのか」という理由を説明
   - 専門用語は日常的な例え話を使って、初学者にも理解できるように解説
   - 「要するに〜」で簡潔に要点を示し、「なぜなら〜」「具体的には〜」で深掘りする

3. **技術の背景や理由を説明**
   - 「なぜそうなるのか？」「なぜこの技術が生まれたのか？」という背景や理由
   - 技術の比較や対比を使って理解を深める（例：「拡散モデルと自己回帰型の違いは、霧を晴らす vs 筆で描く、というイメージです」）

4. **実用例やメリット・デメリットを具体的に示す**
   - 試験で問われやすい実用例や具体的な数値
   - 技術のメリット・デメリットを試験対策の観点から説明

## 解説の構成

- **冒頭**：「要するに」で始めて、このユニットで試験に合格するために押さえるべきポイントを簡潔に示す
- **本文**：「なぜなら」「具体的には」で深掘りし、試験で問われやすい内容を噛み砕いて説明
- **まとめ**：試験対策のポイントを箇条書きで整理し、ユーザーが質問しやすいように「〜について、もっと詳しく知りたい点はありますか？」と結ぶ

## 禁止事項
- 教科書データをそのままコピペして表示すること。
- 表面的な説明だけで終わること（必ず「なぜ」「どうして」「試験ではどう問われるか」に答える）。
- 公式テキストにない情報を断言すること（推測する場合は「一般的には〜」と注釈をつけること）。
- 権利関係の問題を避けるため、公式テキストの表現をそのまま使用しないこと。`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `「${topicTitle}」について、わかりやすく、深みのある解説をお願いします。`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `APIエラー: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      let assistantMessage = data.message || data.content || data.response || '';

      if (streaming && assistantMessage) {
        const streamedMessage: Message = { role: 'assistant', content: '' };
        setMessages([streamedMessage]);

        for (let i = 0; i < assistantMessage.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, streamDelayMs));
          streamedMessage.content += assistantMessage[i];
          setMessages([{ ...streamedMessage }]);
        }
      } else {
        setMessages([{ role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '初期化中にエラーが発生しました。';
      setMessages([{
        role: 'assistant',
        content: errorMessage,
      }]);
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `あなたは「生成AIパスポート試験」のプロフェッショナル講師です。公式テキスト・シラバスに基づいて、学習者の質問に答えてください。

【回答方針】
- 公式テキスト・シラバスの内容に基づいて正確に回答する
- 初学者にもわかりやすい言葉で説明する
- 試験対策の観点から、重要なポイントを明確に示す
- 専門用語は必要に応じて例え話を使って説明する

【禁止事項】
- 公式テキスト・シラバスにない情報を断言すること（推測する場合は「一般的には〜」と注釈をつける）
- 権利関係の問題を避けるため、公式テキストの表現をそのまま使用しないこと`,
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: inputValue },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('APIエラーが発生しました');
      }

      const data = await response.json();
      
      // エラーレスポンスのチェック
      if (data.error) {
        throw new Error(data.error);
      }
      
      let assistantMessage = data.message || data.content || data.response || '';

      if (streaming && assistantMessage) {
        const streamedMessage: Message = { role: 'assistant', content: '' };
        setMessages((prev) => [...prev, streamedMessage]);

        for (let i = 0; i < assistantMessage.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, streamDelayMs));
          streamedMessage.content += assistantMessage[i];
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...streamedMessage };
            return newMessages;
          });
        }
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '申し訳ございません。エラーが発生しました。もう一度お試しください。';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"
        onClick={onClose}
      />

      {/* ドロワー */}
      <div
        ref={chatContainerRef}
        className="relative w-full max-w-2xl h-[80vh] bg-white rounded-t-xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">AI講師</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              メッセージを送信して会話を開始しましょう
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start">
                    {message.role === 'assistant' && (
                      <Bot className="w-5 h-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-5 h-5 mr-2 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1 whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500">考えています...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="質問を入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

