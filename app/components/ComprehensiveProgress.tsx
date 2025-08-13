'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearningHistoryManager } from '@/app/utils/learningHistory';
import { TrendingUp, TrendingDown, Minus, Target, Award, Clock, BarChart3, BookOpen } from 'lucide-react';

interface ComprehensiveProgressProps {
  className?: string;
}

// 学習領域と章の対応関係（現在の5章構成に対応）
const getChapterForArea = (area: string): string => {
  // 実際に保存されている章名（'chapter1', 'chapter2'など）を日本語の章名に変換
  const chapterMapping: { [key: string]: string } = {
    'chapter1': '第1章 AI（人工知能）',
    'chapter2': '第2章 生成AI',
    'chapter3': '第3章 情報リテラシー',
    'chapter4': '第4章 テキスト生成AIのプロンプト制作と実例',
    'chapter5': '第5章 実践と応用',
    // 日本語の学習領域名も対応
    'AI（人工知能）': '第1章 AI（人工知能）',
    'AI基礎': '第1章 AI（人工知能）',
    'AIの基礎知識': '第1章 AI（人工知能）',
    '機械学習': '第1章 AI（人工知能）',
    'ディープラーニング': '第1章 AI（人工知能）',
    'ニューラルネットワーク': '第1章 AI（人工知能）',
    '生成AI': '第2章 生成AI',
    '生成AIの基礎': '第2章 生成AI',
    'GPT': '第2章 生成AI',
    'BERT': '第2章 生成AI',
    'Transformer': '第2章 生成AI',
    'LLM': '第2章 生成AI',
    '大規模言語モデル': '第2章 生成AI',
    '情報リテラシー': '第3章 情報リテラシー',
    'AI倫理': '第3章 情報リテラシー',
    'AIバイアス': '第3章 情報リテラシー',
    'プライバシー': '第3章 情報リテラシー',
    'セキュリティ': '第3章 情報リテラシー',
    'プロンプトエンジニアリング': '第4章 テキスト生成AIのプロンプト制作と実例',
    'プロンプト設計': '第4章 テキスト生成AIのプロンプト制作と実例',
    'プロンプト技法': '第4章 テキスト生成AIのプロンプト制作と実例',
    'Zero-Shot': '第4章 テキスト生成AIのプロンプト制作と実例',
    'Few-Shot': '第4章 テキスト生成AIのプロンプト制作と実例',
    'Chain-of-Thought': '第4章 テキスト生成AIのプロンプト制作と実例',
    '実践と応用': '第5章 実践と応用',
    'AI活用事例': '第5章 実践と応用',
    'ビジネス活用': '第5章 実践と応用',
    '実践的活用': '第5章 実践と応用',
    'AI技術動向': '第5章 実践と応用',
    '将来展望': '第5章 実践と応用'
  };
  
  return chapterMapping[area] || '該当なし';
};

// 章名からURLパスを生成する関数
const getChapterUrl = (area: string): string => {
  const chapterMapping: { [key: string]: string } = {
    'chapter1': '/courses/chapter1',
    'chapter2': '/courses/chapter2',
    'chapter3': '/courses/chapter3',
    'chapter4': '/courses/chapter4',
    'chapter5': '/courses/chapter5',
    // 日本語の学習領域名も対応
    'AI（人工知能）': '/courses/chapter1',
    'AI基礎': '/courses/chapter1',
    'AIの基礎知識': '/courses/chapter1',
    '機械学習': '/courses/chapter1',
    'ディープラーニング': '/courses/chapter1',
    'ニューラルネットワーク': '/courses/chapter1',
    '生成AI': '/courses/chapter2',
    '生成AIの基礎': '/courses/chapter2',
    'GPT': '/courses/chapter2',
    'BERT': '/courses/chapter2',
    'Transformer': '/courses/chapter2',
    'LLM': '/courses/chapter2',
    '大規模言語モデル': '/courses/chapter2',
    '情報リテラシー': '/courses/chapter3',
    'AI倫理': '/courses/chapter3',
    'AIバイアス': '/courses/chapter3',
    'プライバシー': '/courses/chapter3',
    'セキュリティ': '/courses/chapter3',
    'プロンプトエンジニアリング': '/courses/chapter4',
    'プロンプト設計': '/courses/chapter4',
    'プロンプト技法': '/courses/chapter4',
    'Zero-Shot': '/courses/chapter4',
    'Few-Shot': '/courses/chapter4',
    'Chain-of-Thought': '/courses/chapter4',
    '実践と応用': '/courses/chapter5',
    'AI活用事例': '/courses/chapter5',
    'ビジネス活用': '/courses/chapter5',
    '実践的活用': '/courses/chapter5',
    'AI技術動向': '/courses/chapter5',
    '将来展望': '/courses/chapter5'
  };
  
  return chapterMapping[area] || '#';
};

export default function ComprehensiveProgress({ className = '' }: ComprehensiveProgressProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadProgressData();
    
    // ローカルストレージの変更を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'comprehensiveLearningHistory') {
        console.log('🔄 総合学習進捗が更新されました - 再読み込み');
        loadProgressData();
      }
    };
    
    // カスタムイベントを監視（同一タブ内での更新）
    const handleCustomUpdate = (e: any) => {
      console.log('🔄 総合進捗カスタムイベント受信 - 再読み込み');
      loadProgressData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('learningHistoryUpdated', handleCustomUpdate);
    
    // 定期的な更新（5秒間隔）
    const interval = setInterval(() => {
      loadProgressData();
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('learningHistoryUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadProgressData = () => {
    const learningStats = LearningHistoryManager.getLearningStats();
    const recent = LearningHistoryManager.getRecentSessions(5);
    
    // デバッグ情報
    console.log('📊 ComprehensiveProgress 読み込みデータ:', learningStats);
    console.log('📝 Recent Sessions:', recent);
    console.log('📈 ChapterProgress 詳細:', learningStats.chapterProgress);
    
    setStats(learningStats);
    setRecentSessions(recent);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '向上中';
      case 'declining':
        return '低下中';
      default:
        return '安定';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0 || isNaN(seconds)) {
      return '未計測';
    }
    
    // 異常に大きな値の場合はエラー表示
    if (seconds > 86400) { // 24時間 = 86400秒
      console.error('異常な時間値を検出:', seconds);
      return 'エラー';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds}秒`;
    } else if (remainingSeconds === 0) {
      return `${minutes}分`;
    } else {
      return `${minutes}分${remainingSeconds}秒`;
    }
  };

  const formatDate = (timestamp: number) => {
    console.log('🕐 日付フォーマット:', { timestamp, date: new Date(timestamp) });
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!stats || stats.totalSessions === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">総合学習進捗</h3>
          <BarChart3 className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <BarChart3 className="w-12 h-12 mx-auto mb-3" />
          </div>
          <p className="text-gray-500">まだ演習履歴がありません</p>
          <p className="text-sm text-gray-400 mt-1">問題演習を開始して学習進捗を確認しましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">総合学習進捗</h3>
        <div className="flex items-center gap-2">
          {getTrendIcon(stats.learningTrend)}
          <span className={`text-sm font-medium ${getTrendColor(stats.learningTrend)}`}>
            {getTrendText(stats.learningTrend)}
          </span>
        </div>
      </div>

      {/* 主要統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
          <div className="text-sm text-gray-600">演習回数</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.overallAccuracy}%</div>
          <div className="text-sm text-gray-600">総合正答率</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatDuration(stats.averageSessionDuration)}
          </div>
          <div className="text-sm text-gray-600">平均時間</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {recentSessions.length > 0 ? formatDate(recentSessions[recentSessions.length - 1].timestamp) : '-'}
          </div>
          <div className="text-sm text-gray-600">最終演習</div>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-4">
        {/* 得意領域 */}
        {stats.recommendedFocus.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">得意領域</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.recommendedFocus.map((area: string, index: number) => {
                const chapter = getChapterForArea(area);
                const chapterUrl = getChapterUrl(area);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    <span>{area}</span>
                    <Link 
                      href={chapterUrl}
                      className="flex items-center gap-1 px-2 py-0.5 bg-green-200 rounded-full text-xs hover:bg-green-300 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{chapter}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 弱い領域 */}
        {stats.weakAreas.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-600" />
              <h4 className="font-medium text-red-800">改善が必要な領域</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.weakAreas.map((area: string, index: number) => {
                const chapter = getChapterForArea(area);
                const chapterUrl = getChapterUrl(area);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    <span>{area}</span>
                    <Link 
                      href={chapterUrl}
                      className="flex items-center gap-1 px-2 py-0.5 bg-red-200 rounded-full text-xs hover:bg-red-300 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{chapter}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* スキル別分析 */}
        {stats.strongSkills?.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">詳細スキル分析（正答率の高い領域）</h4>
            </div>
            
            {/* 正答率の高いスキル */}
            <div>
              <h5 className="text-sm font-medium text-green-700 mb-2">習得済みスキル</h5>
              <div className="flex flex-wrap gap-2">
                {stats.strongSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 直近の演習履歴 */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span className="font-medium">直近の演習履歴</span>
            <span className="text-sm">({recentSessions.length}回)</span>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {recentSessions.map((session, index) => (
                <div key={session.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {recentSessions.length - index}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {session.selectedQuestionCount}問演習
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(session.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {session.accuracy}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDuration(session.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 更新ボタン */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={loadProgressData}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            進捗を更新
          </button>
          <button
            onClick={() => {
              if (confirm('学習履歴をすべてリセットしますか？\n\n現在の日時: ' + new Date().toLocaleString('ja-JP'))) {
                // 両方のストレージをクリア
                LearningHistoryManager.clearHistory();
                localStorage.removeItem('quizHistory'); // 旧形式もクリア
                console.log('🗑️ 学習履歴を完全削除しました - 現在時刻:', new Date());
                loadProgressData();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
} 