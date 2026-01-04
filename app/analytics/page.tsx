'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearningHistoryManager } from '@/app/utils/learningHistory';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award, 
  Clock, 
  BookOpen,
  Brain,
  PieChart,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    
    // ローカルストレージの変更を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'comprehensiveLearningHistory') {
        loadAnalyticsData();
      }
    };
    
    // カスタムイベントを監視
    const handleCustomUpdate = () => {
      loadAnalyticsData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('learningHistoryUpdated', handleCustomUpdate);
    
    // 定期的な更新（10秒間隔）
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('learningHistoryUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadAnalyticsData = () => {
    setIsLoading(true);
    const learningStats = LearningHistoryManager.getLearningStats();
    const recent = LearningHistoryManager.getRecentSessions(10);
    
    setStats(learningStats);
    setRecentSessions(recent);
    setIsLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
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
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0 || isNaN(seconds)) {
      return '未計測';
    }
    
    if (seconds > 86400) {
      return 'エラー';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    } else if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    } else {
      return `${remainingSeconds}秒`;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChapterName = (chapter: string): string => {
    const chapterNames: { [key: string]: string } = {
      'chapter1': '第1章 AI（人工知能）',
      'chapter2': '第2章 生成AI（ジェネレーティブAI）',
      'chapter3': '第3章 現在の生成AIの動向',
      'chapter4': '第4章 情報リテラシー・法律・倫理',
      'chapter5': '第5章 テキスト生成AIのプロンプト制作と実例',
      // 問題データの章カテゴリ名にも対応
      '第1章 AI（人工知能）': '第1章 AI（人工知能）',
      '第2章 生成AI（ジェネレーティブAI）': '第2章 生成AI（ジェネレーティブAI）',
      '第3章 現在の生成AIの動向': '第3章 現在の生成AIの動向',
      '第4章 情報リテラシー・法律・倫理': '第4章 情報リテラシー・法律・倫理',
      '第5章 テキスト生成AIのプロンプト制作と実例': '第5章 テキスト生成AIのプロンプト制作と実例',
    };
    return chapterNames[chapter] || chapter;
  };

  const getChapterUrl = (chapter: string): string => {
    const chapterUrls: { [key: string]: string } = {
      'chapter1': '/courses/chapter1',
      'chapter2': '/courses/chapter2',
      'chapter3': '/courses/chapter3',
      'chapter4': '/courses/chapter4',
      'chapter5': '/courses/chapter5',
    };
    return chapterUrls[chapter] || '#';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-50';
    if (accuracy >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 80) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (accuracy >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">データを読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">学習分析データがありません</h2>
            <p className="text-gray-600 mb-6">問題演習を開始して学習データを蓄積しましょう</p>
            <Link 
              href="/quiz" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              問題演習を開始
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 章別進捗データを整理
  const chapterProgressData = Object.entries(stats.chapterProgress || {})
    .filter(([chapter]: [string, any]) => chapter.startsWith('chapter'))
    .map(([chapter, progress]: [string, any]) => ({
      chapter,
      name: getChapterName(chapter),
      url: getChapterUrl(chapter),
      ...progress
    }))
    .sort((a: { chapter: string }, b: { chapter: string }) => a.chapter.localeCompare(b.chapter));

  // 得意領域のデータを整理
  const strongAreasData = (stats.strongAreas || [])
    .map((chapter: string) => {
      const progress = stats.chapterProgress?.[chapter];
      return {
        chapter,
        name: getChapterName(chapter),
        url: getChapterUrl(chapter),
        accuracy: progress?.accuracy || 0,
        ...progress
      };
    })
    .filter((area: { accuracy: number }) => area.accuracy > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">生成AIパスポート試験対策</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                ホーム
              </Link>
              <Link href="/quiz" className="text-gray-700 hover:text-primary-600 transition-colors">
                問題演習
              </Link>
              <Link href="/analytics" className="text-primary-600 font-semibold">
                学習分析
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary-600" />
            学習分析ダッシュボード
          </h1>
          <p className="text-gray-600">学習進捗とパフォーマンスの詳細分析</p>
        </div>

        {/* 主要統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">総演習回数</div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalSessions}</div>
            <div className="text-xs text-gray-500 mt-1">回の演習を完了</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">総合正答率</div>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.overallAccuracy}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalQuestionsAnswered}問中{stats.totalCorrectAnswers}問正解
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">
                {stats.averageTimePerQuestion > 0 ? '1問あたりの平均時間' : '平均演習時間'}
              </div>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.averageTimePerQuestion > 0 
                ? `${Math.round(stats.averageTimePerQuestion)}秒/問`
                : formatDuration(stats.averageSessionDuration)
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.averageTimePerQuestion > 0 ? (
                <>
                  目標: 60秒/問
                  {stats.averageTimePerQuestion <= 60 ? (
                    <span className="text-green-600 ml-1">✓ 目標達成</span>
                  ) : (
                    <span className="text-orange-600 ml-1">要改善</span>
                  )}
                </>
              ) : (
                '1回あたりの平均'
              )}
            </div>
          </div>

          <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${getTrendColor(stats.learningTrend)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">学習傾向</div>
              {getTrendIcon(stats.learningTrend)}
            </div>
            <div className="text-3xl font-bold">{getTrendText(stats.learningTrend)}</div>
            <div className="text-xs mt-1">直近3回のセッション</div>
          </div>
        </div>

        {/* 章別進捗分析 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary-600" />
            章別学習進捗
          </h2>
          
          {chapterProgressData.length > 0 ? (
            <div className="space-y-4">
              {chapterProgressData.map((chapter) => (
                <div key={chapter.chapter} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={chapter.url}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {chapter.name}
                      </Link>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getAccuracyColor(chapter.accuracy)}`}>
                      {getAccuracyIcon(chapter.accuracy)}
                      <span className="font-bold">{chapter.accuracy}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>回答数: {chapter.totalAnswered}問</span>
                      <span>正解数: {chapter.totalCorrect}問</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          chapter.accuracy >= 80 ? 'bg-green-500' :
                          chapter.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${chapter.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    最終演習: {chapter.lastAttempted > 0 ? formatDate(chapter.lastAttempted) : '未実施'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              章別の学習データがまだありません
            </div>
          )}
        </div>

        {/* 得意領域 */}
        {strongAreasData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary-600" />
              得意領域
            </h2>
            <div className="flex flex-wrap gap-3">
              {strongAreasData.map((area: { chapter: string; name: string; url: string; accuracy: number }, index: number) => (
                <Link
                  key={index}
                  href={area.url}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-gray-800">{area.name}</span>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-bold text-green-600">{area.accuracy}%</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 推奨学習領域 */}
        {stats.recommendedFocus && stats.recommendedFocus.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary-600" />
              推奨学習領域
            </h2>
            <div className="flex flex-wrap gap-3">
              {stats.recommendedFocus.map((area: string, index: number) => {
                const chapterUrl = getChapterUrl(area);
                return (
                  <Link
                    key={index}
                    href={chapterUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{getChapterName(area)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 演習履歴 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-600" />
            演習履歴
          </h2>
          
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">{recentSessions.length - index}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {session.selectedQuestionCount}問演習
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(session.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getAccuracyColor(session.accuracy).split(' ')[0]}`}>
                        {session.accuracy}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              演習履歴がありません
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={loadAnalyticsData}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            データを更新
          </button>
          <Link
            href="/quiz"
            className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            問題演習を開始
          </Link>
        </div>
      </div>
    </div>
  );
}


