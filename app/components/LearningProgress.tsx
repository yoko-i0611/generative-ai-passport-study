'use client';

import { useState, useEffect } from 'react';
import { LearningHistory, SkillAnalysis } from '@/types';
import { calculateSkillLevel, generateProgressData } from '@/app/utils/skillAnalysis';
import { Brain, Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function LearningProgress() {
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // ローカルストレージから学習履歴を読み込み
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      try {
        const history: LearningHistory = JSON.parse(savedHistory);
        const analysis = calculateSkillLevel(history);
        setSkillAnalysis(analysis);
        setHasHistory(true);
      } catch (error) {
        console.error('学習履歴の読み込みに失敗しました:', error);
      }
    }
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
            <p>• 24時間以内の履歴が有効です</p>
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

      {/* 弱点分野 */}
      {skillAnalysis.weakAreas.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-warning-500" />
            弱点分野
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillAnalysis.weakAreas.map((area, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 推奨学習 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-success-500" />
          推奨学習
        </h4>
        <div className="space-y-2">
          {skillAnalysis.recommendedTopics.map((topic, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-success-500" />
              {topic}
            </div>
          ))}
        </div>
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
              <li>• 24時間以内の学習履歴が分析に使用されます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 