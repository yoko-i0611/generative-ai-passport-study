import { QuizSession, ComprehensiveLearningHistory } from '@/types';
import { courses } from '../../data/courses';

// 学習履歴の管理クラス
export class LearningHistoryManager {
  private static readonly STORAGE_KEY = 'comprehensiveLearningHistory';

  // 新しい演習セッションを追加
  static addSession(session: Omit<QuizSession, 'id'>): void {
    const history = this.getHistory();
    
    const newSession: QuizSession = {
      ...session,
      id: this.generateSessionId(),
    };

    history.sessions.push(newSession);
    history.totalSessions = history.sessions.length;
    
    // 統計情報を更新
    this.updateStatistics(history);
    
    // 章別進捗を更新
    this.updateChapterProgress(history, newSession);
    
    // 学習傾向を分析
    this.analyzeLearningTrend(history);
    
    // 推奨学習領域を更新
    this.updateRecommendations(history);
    
    this.saveHistory(history);
  }

  // 総合学習履歴を取得
  static getHistory(): ComprehensiveLearningHistory {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('学習履歴の読み込みに失敗しました:', error);
      }
    }

    // 初期状態を返す
    return {
      sessions: [],
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      averageSessionDuration: 0,
      lastSessionDate: 0,
      chapterProgress: {},
      weakAreas: [],
      strongAreas: [],
      learningTrend: 'stable',
      recommendedFocus: [],
    };
  }

  // 統計情報を更新
  private static updateStatistics(history: ComprehensiveLearningHistory): void {
    const totalQuestions = history.sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    const totalCorrect = history.sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalDuration = history.sessions.reduce((sum, session) => sum + session.duration, 0);

    history.totalQuestionsAnswered = totalQuestions;
    history.totalCorrectAnswers = totalCorrect;
    history.overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    history.averageSessionDuration = history.sessions.length > 0 ? Math.round(totalDuration / history.sessions.length) : 0;
    history.lastSessionDate = history.sessions.length > 0 ? history.sessions[history.sessions.length - 1].timestamp : 0;
  }

  // 章別進捗を更新
  private static updateChapterProgress(history: ComprehensiveLearningHistory, session: QuizSession): void {
    // 各問題の章を特定（問題文から章を推測）
    Object.keys(session.answers).forEach(questionText => {
      const chapter = this.detectChapterFromQuestion(questionText);
      if (chapter) {
        if (!history.chapterProgress[chapter]) {
          history.chapterProgress[chapter] = {
            totalAnswered: 0,
            totalCorrect: 0,
            accuracy: 0,
            lastAttempted: 0,
          };
        }

        const progress = history.chapterProgress[chapter];
        progress.totalAnswered += 1;
        
        // 正解かどうかを判定
        const isCorrect = this.isAnswerCorrect(questionText, session.answers[questionText]);
        if (isCorrect) {
          progress.totalCorrect += 1;
        }
        
        progress.accuracy = Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
        progress.lastAttempted = session.timestamp;
      }
    });
  }

  // 学習傾向を分析
  private static analyzeLearningTrend(history: ComprehensiveLearningHistory): void {
    if (history.sessions.length < 3) {
      history.learningTrend = 'stable';
      return;
    }

    // 直近3回のセッションの精度を比較
    const recentSessions = history.sessions.slice(-3);
    const accuracies = recentSessions.map(session => session.accuracy);
    
    // 単純な傾向分析
    if (accuracies[2] > accuracies[0] && accuracies[2] > accuracies[1]) {
      history.learningTrend = 'improving';
    } else if (accuracies[2] < accuracies[0] && accuracies[2] < accuracies[1]) {
      history.learningTrend = 'declining';
    } else {
      history.learningTrend = 'stable';
    }
  }

  // 推奨学習領域を更新
  private static updateRecommendations(history: ComprehensiveLearningHistory): void {
    // 弱い領域を特定（精度が60%未満の章）
    history.weakAreas = Object.entries(history.chapterProgress)
      .filter(([_, progress]) => progress.accuracy < 60 && progress.totalAnswered >= 3)
      .map(([chapter, _]) => chapter);

    // 強い領域を特定（精度が80%以上の章）
    history.strongAreas = Object.entries(history.chapterProgress)
      .filter(([_, progress]) => progress.accuracy >= 80 && progress.totalAnswered >= 3)
      .map(([chapter, _]) => chapter);

    // 推奨学習領域を設定
    history.recommendedFocus = [
      ...history.weakAreas,
      ...Object.keys(history.chapterProgress).filter(chapter => 
        !history.weakAreas.includes(chapter) && 
        !history.strongAreas.includes(chapter)
      )
    ].slice(0, 3); // 上位3つまで
  }

  // 章を問題文から推測（簡易的な実装）
  private static detectChapterFromQuestion(questionText: string): string | null {
    const chapterKeywords = {
      'chapter1': ['基礎', '基本', '概要', '導入', '生成AI', 'AI', '人工知能'],
      'chapter2': ['生成', 'AI', 'モデル', '学習', '機械学習', 'ディープラーニング', 'ニューラルネットワーク'],
      'chapter3': ['プロンプト', '入力', '出力', '指示', 'プロンプトエンジニアリング', 'プロンプト設計'],
      'chapter4': ['倫理', '責任', '安全', 'バイアス', 'プライバシー', '透明性', '説明可能性'],
      'chapter5': ['応用', '実践', '活用', '事例', 'ビジネス', '導入', '実装'],
    };

    for (const [chapter, keywords] of Object.entries(chapterKeywords)) {
      if (keywords.some(keyword => questionText.includes(keyword))) {
        return chapter;
      }
    }

    return null;
  }

  // 正解判定（改善版）
  private static isAnswerCorrect(questionText: string, userAnswer: string | null): boolean {
    if (userAnswer === null) {
      return false;
    }
    // 問題データベースから正解を検索
    for (const course of courses) {
      for (const quiz of course.quiz) {
        for (const question of quiz.questions) {
          if (question.question === questionText) {
            return question.correctAnswer === userAnswer;
          }
        }
      }
    }
    
    // 問題が見つからない場合は、セッションの正解数から推測
    return false;
  }

  // セッションIDを生成
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 履歴を保存
  private static saveHistory(history: ComprehensiveLearningHistory): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  // 履歴をクリア
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 直近N回のセッションを取得
  static getRecentSessions(count: number = 5): QuizSession[] {
    const history = this.getHistory();
    return history.sessions.slice(-count);
  }

  // 学習統計を取得
  static getLearningStats() {
    const history = this.getHistory();
    return {
      totalSessions: history.totalSessions,
      overallAccuracy: history.overallAccuracy,
      averageSessionDuration: history.averageSessionDuration,
      learningTrend: history.learningTrend,
      weakAreas: history.weakAreas,
      strongAreas: history.strongAreas,
      recommendedFocus: history.recommendedFocus,
    };
  }
} 