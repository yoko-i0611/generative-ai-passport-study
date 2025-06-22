'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearningHistoryManager } from '@/app/utils/learningHistory';
import { TrendingUp, TrendingDown, Minus, Target, Award, Clock, BarChart3, BookOpen } from 'lucide-react';

interface ComprehensiveProgressProps {
  className?: string;
}

// 学習領域と章の対応関係
const getChapterForArea = (area: string): string => {
  // 実際に保存されている章名（'chapter1', 'chapter2'など）を日本語の章名に変換
  const chapterMapping: { [key: string]: string } = {
    'chapter1': '第1章 生成AIの基礎知識',
    'chapter2': '第2章 プロンプトエンジニアリング', 
    'chapter3': '第3章 生成AIの活用方法',
    'chapter4': '第4章 生成AIの倫理とリスク',
    'chapter5': '第5章 生成AIの最新トレンド',
    // 日本語の学習領域名も対応（念のため）
    '生成AIの基礎知識': '第1章 生成AIの基礎知識',
    '生成AIの仕組み': '第1章 生成AIの基礎知識',
    '機械学習': '第1章 生成AIの基礎知識',
    'ディープラーニング': '第1章 生成AIの基礎知識',
    'プロンプトエンジニアリング': '第2章 プロンプトエンジニアリング',
    'プロンプト設計': '第2章 プロンプトエンジニアリング',
    'プロンプト技法': '第2章 プロンプトエンジニアリング',
    '生成AIの活用方法': '第3章 生成AIの活用方法',
    'ビジネス活用': '第3章 生成AIの活用方法',
    '実践的活用': '第3章 生成AIの活用方法',
    '生成AIの倫理とリスク': '第4章 生成AIの倫理とリスク',
    '倫理的考慮': '第4章 生成AIの倫理とリスク',
    'リスク管理': '第4章 生成AIの倫理とリスク',
    '生成AIの最新トレンド': '第5章 生成AIの最新トレンド',
    '最新技術': '第5章 生成AIの最新トレンド',
    '将来展望': '第5章 生成AIの最新トレンド'
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
    '生成AIの基礎知識': '/courses/chapter1',
    '生成AIの仕組み': '/courses/chapter1',
    '機械学習': '/courses/chapter1',
    'ディープラーニング': '/courses/chapter1',
    'プロンプトエンジニアリング': '/courses/chapter2',
    'プロンプト設計': '/courses/chapter2',
    'プロンプト技法': '/courses/chapter2',
    '生成AIの活用方法': '/courses/chapter3',
    'ビジネス活用': '/courses/chapter3',
    '実践的活用': '/courses/chapter3',
    '生成AIの倫理とリスク': '/courses/chapter4',
    '倫理的考慮': '/courses/chapter4',
    'リスク管理': '/courses/chapter4',
    '生成AIの最新トレンド': '/courses/chapter5',
    '最新技術': '/courses/chapter5',
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
  }, []);

  const loadProgressData = () => {
    const learningStats = LearningHistoryManager.getLearningStats();
    const recent = LearningHistoryManager.getRecentSessions(5);
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const formatDate = (timestamp: number) => {
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
        {/* 推奨学習領域 */}
        {stats.recommendedFocus.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">推奨学習領域</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.recommendedFocus.map((area: string, index: number) => {
                const chapter = getChapterForArea(area);
                const chapterUrl = getChapterUrl(area);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                  >
                    <span>{area}</span>
                    <Link 
                      href={chapterUrl}
                      className="flex items-center gap-1 px-2 py-0.5 bg-yellow-200 rounded-full text-xs hover:bg-yellow-300 transition-colors cursor-pointer"
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

        {/* 強い領域 */}
        {stats.strongAreas.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-green-800">得意な領域</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.strongAreas.map((area: string, index: number) => {
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
        <button
          onClick={loadProgressData}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          進捗を更新
        </button>
      </div>
    </div>
  );
} 