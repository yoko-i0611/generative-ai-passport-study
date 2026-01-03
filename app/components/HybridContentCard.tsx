'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HybridContentCardProps {
  slideImage?: string;
  title?: string; // タイトル
  unitPoint?: string; // ユニットのポイント
  learningTips?: string; // 学習のコツ
  keyPoints: string[]; // 要点
  importantExplanations?: Array<{ category: string; explanation: string }>; // 重要箇所の解説
  versionInfo?: {
    version?: string;
    lastUpdated?: string;
    tokenLimit?: string;
    hallucinationReduction?: string;
  };
  textContent?: string; // テキスト教材（アコーディオンで表示）
  quizQuestions?: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }>; // 確認問題
  sectionId?: string;
  onOpenQuiz?: (sectionId: string, questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation?: string }>) => void; // 確認問題を開くコールバック
  onOpenChat?: (sectionId: string, title: string) => void; // チャットを開くコールバック
}

export default function HybridContentCard({
  slideImage,
  title,
  unitPoint,
  learningTips,
  keyPoints,
  importantExplanations,
  versionInfo,
  textContent,
  quizQuestions,
  sectionId,
  onOpenQuiz,
  onOpenChat,
}: HybridContentCardProps) {
  const [showExplanations, setShowExplanations] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slideImage && imageContainerRef.current) {
      setImageError(false);
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setImageAspectRatio(aspectRatio);
      };
      img.onerror = () => {
        console.error('Failed to load image:', slideImage);
        setImageError(true);
        setImageAspectRatio(null);
      };
      img.src = slideImage;
    }
  }, [slideImage]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* 上部：スライド画像 */}
      {slideImage && !imageError && (
        <div 
          ref={imageContainerRef}
          className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-100"
          style={{ 
            aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : '16/9',
            minHeight: '300px',
            maxHeight: '600px'
          }}
        >
          <Image
            src={slideImage}
            alt={title || "学習コンテンツ"}
            fill
            className="object-contain p-4"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* 下部：テキストエリア */}
      <div className="p-6">
        {/* タイトル */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        )}

        {/* バージョン情報 */}
        {versionInfo && (
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-gray-500">
            {versionInfo.version && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                バージョン: {versionInfo.version}
              </span>
            )}
            {versionInfo.lastUpdated && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                更新日: {versionInfo.lastUpdated}
              </span>
            )}
            {versionInfo.tokenLimit && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                トークン: {versionInfo.tokenLimit}
              </span>
            )}
            {versionInfo.hallucinationReduction && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                ハルシネーション減少: {versionInfo.hallucinationReduction}
              </span>
            )}
          </div>
        )}

        {/* 要点リスト */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">要点</h3>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* アクションボタン（動的列レイアウト） */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          {(() => {
            const buttonCount = [
              textContent,
              (unitPoint || learningTips || (importantExplanations && importantExplanations.length > 0)),
              (quizQuestions && quizQuestions.length > 0 && sectionId && onOpenQuiz),
              (sectionId && title && onOpenChat)
            ].filter(Boolean).length;
            const gridCols = buttonCount === 1 ? 'grid-cols-1' : 
                           buttonCount === 2 ? 'grid-cols-2' : 
                           buttonCount === 3 ? 'grid-cols-3' : 'grid-cols-4';
            return (
              <div className={`grid ${gridCols} gap-3`}>
            {/* テキストを開くボタン */}
            {textContent && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="flex flex-col items-center justify-center px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <span className="text-2xl mb-1">{showFullText ? '📖' : '📖'}</span>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {showFullText ? '閉じる' : 'テキスト'}
                </span>
              </button>
            )}

            {/* 重要ポイントまとめボタン */}
            {(unitPoint || learningTips || (importantExplanations && importantExplanations.length > 0)) && (
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="flex flex-col items-center justify-center px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <span className="text-2xl mb-1">{showExplanations ? '📌' : '📌'}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {showExplanations ? '閉じる' : '重要ポイントまとめ'}
                </span>
              </button>
            )}

            {/* 確認問題ボタン */}
            {quizQuestions && quizQuestions.length > 0 && sectionId && onOpenQuiz && (
              <button
                onClick={() => onOpenQuiz(sectionId, quizQuestions)}
                className="flex flex-col items-center justify-center px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <span className="text-2xl mb-1">✅</span>
                <span className="text-xs font-medium text-gray-700 text-center">
                  確認問題
                  <span className="block text-[10px] text-gray-500 mt-0.5">
                    ({quizQuestions.length}問)
                  </span>
                </span>
              </button>
            )}

            {/* チャットボタン */}
            {sectionId && title && onOpenChat && (
              <button
                onClick={() => onOpenChat(sectionId, title)}
                className="flex flex-col items-center justify-center px-3 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <span className="text-2xl mb-1">💬</span>
                <span className="text-xs font-medium text-blue-700 text-center">
                  AI講師に質問
                </span>
              </button>
            )}
              </div>
            );
          })()}
        </div>

        {/* テキストコンテンツ（アコーディオン展開時） */}
        {textContent && showFullText && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {textContent}
            </div>
          </div>
        )}

        {/* 重要ポイントまとめコンテンツ（アコーディオン展開時） */}
        {showExplanations && (unitPoint || learningTips || (importantExplanations && importantExplanations.length > 0)) && (
          <div className="mb-6 space-y-4">
            {/* ユニットのポイント */}
            {unitPoint && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">ユニットのポイント</h3>
                <p className="text-gray-700 leading-relaxed">{unitPoint}</p>
              </div>
            )}

            {/* 学習のコツ */}
            {learningTips && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">学習のコツ</h3>
                <div className="text-gray-700 leading-relaxed">
                  {learningTips.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div key={index} className="flex items-start mb-1">
                      <span className="text-yellow-700 mr-2 mt-1">•</span>
                      <span>{line.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 重要箇所の解説 */}
            {importantExplanations && importantExplanations.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-semibold text-blue-700 mb-2">{item.category}</div>
                <div className="text-gray-700 leading-relaxed">{item.explanation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

