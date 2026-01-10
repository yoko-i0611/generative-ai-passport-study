'use client';

import { useState, useEffect } from 'react';
import { LearningHistory, SkillAnalysis } from '@/types';
import { calculateSkillLevel, generateProgressData } from '@/app/utils/skillAnalysis';
import { LearningHistoryManager } from '@/app/utils/learningHistory';
import { Brain, Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// 章名の変換関数
const getChapterName = (area: string): string => {
  const chapterMapping: { [key: string]: string } = {
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
  return chapterMapping[area] || area;
};

const getChapterUrl = (area: string): string => {
  const chapterMapping: { [key: string]: string } = {
    'chapter1': '/courses/chapter1',
    'chapter2': '/courses/chapter2',
    'chapter3': '/courses/chapter3',
    'chapter4': '/courses/chapter4',
    'chapter5': '/courses/chapter5',
  };
  return chapterMapping[area] || '#';
};

export default function LearningProgress() {
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  const loadProgressData = () => {
    // 新しい学習履歴システムから読み込み
    try {
      const stats = LearningHistoryManager.getLearningStats();
      console.log('📊 LearningProgress 読み込みデータ:', stats);
      
      if (stats.totalSessions > 0 || Object.keys(stats.chapterProgress).length > 0) {
        // 統計データからスキル分析データに変換
        const analysisData: SkillAnalysis = {
          overallLevel: stats.overallAccuracy,
          chapterLevels: {
            chapter1: stats.chapterProgress.chapter1?.accuracy || 0,
            chapter2: stats.chapterProgress.chapter2?.accuracy || 0,
            chapter3: stats.chapterProgress.chapter3?.accuracy || 0,
            chapter4: stats.chapterProgress.chapter4?.accuracy || 0,
            chapter5: stats.chapterProgress.chapter5?.accuracy || 0,
          },
          weakAreas: stats.weakAreas,
          recommendedTopics: stats.recommendedFocus.slice(0, 5),
          nextLearningPath: stats.recommendedFocus.length > 0 ? [stats.recommendedFocus[0]] : ['基礎から復習しましょう']
        };
        
        console.log('📈 LearningProgress 変換データ:', analysisData);
        setSkillAnalysis(analysisData);
        setHasHistory(true);
      } else {
        setHasHistory(false);
      }
    } catch (error) {
      console.error('学習履歴の読み込みに失敗しました:', error);
    }
  };

  useEffect(() => {
    loadProgressData();
    
    // ローカルストレージの変更を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'comprehensiveLearningHistory') {
        console.log('🔄 学習履歴が更新されました - 進捗を再読み込み');
        loadProgressData();
      }
    };
    
    // カスタムイベントを監視（同一タブ内での更新）
    const handleCustomUpdate = (e: any) => {
      console.log('🔄 カスタムイベント受信 - 進捗を再読み込み');
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

  if (!hasHistory) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            学習履歴がありません
          </h3>
          <p className="text-gray-600 mb-4">
            問題演習に挑戦して学習履歴を作成しましょう
          </p>
          <div className="text-sm text-gray-500">
            <p>• 学習履歴はこのブラウザに保存されます</p>
            <p>• 他のブラウザやデバイスとは共有されません</p>
            <p>• ブラウザの閲覧履歴を削除すると、学習履歴も失われます</p>
          </div>
        </div>
      </div>
    );
  }

  if (!skillAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const progressData = generateProgressData(skillAnalysis);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          学習進捗
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          このブラウザでの履歴
        </div>
      </div>

      {/* 全体の習得レベル */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">全体の習得レベル</span>
          <span className="text-lg font-bold text-primary-600">
            {skillAnalysis.overallLevel}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${skillAnalysis.overallLevel}%` }}
          ></div>
        </div>
      </div>

      {/* 章別の習得レベル */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">章別の習得レベル</h4>
        <div className="space-y-3">
          {progressData.labels.map((label, index) => {
            const level = progressData.datasets[0].data[index];
            const color = progressData.datasets[0].backgroundColor[index];
            return (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-16">{label}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${level}%`,
                        backgroundColor: color.replace('0.8', '1')
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {level}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 推奨学習 */}
      {skillAnalysis.recommendedTopics.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-success-500" />
            推奨学習領域
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillAnalysis.recommendedTopics.map((topic, index) => (
              <Link
                key={index}
                href={getChapterUrl(topic)}
                className="flex items-center gap-1 px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm hover:bg-success-200 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                {getChapterName(topic)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 更新ボタン */}
      <div className="flex justify-center">
        <button
          onClick={loadProgressData}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          進捗を更新
        </button>
      </div>

      {/* 注意事項 */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <Brain className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">学習履歴について</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• この履歴は現在のブラウザにのみ保存されています</li>
              <li>• 他のブラウザやデバイスとは共有されません</li>
              <li>• ブラウザのデータを削除すると履歴も消去されます</li>
              <li>• 保存されているすべての学習履歴が分析に使用されます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 