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

    console.log('セッション追加前:', {
      totalSessions: history.totalSessions,
      currentSessions: history.sessions.length
    });

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

    console.log('セッション追加後:', {
      totalSessions: history.totalSessions,
      overallAccuracy: history.overallAccuracy,
      chapterProgress: history.chapterProgress
    });
  }

  // 総合学習履歴を取得
  static getHistory(): ComprehensiveLearningHistory {
    if (typeof window === 'undefined') {
      // サーバーサイドでは初期状態を返す
      return {
        sessions: [],
        totalSessions: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        overallAccuracy: 0,
        averageSessionDuration: 0,
        lastSessionDate: 0,
        chapterProgress: {},
        skillProgress: {},
        weakAreas: [],
        strongAreas: [],
        weakSkills: [],
        strongSkills: [],
        learningTrend: 'stable' as 'stable',
        recommendedFocus: [],
      };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        console.log('📋 学習履歴読み込み成功:', {
          totalSessions: history.totalSessions,
          chapterKeys: Object.keys(history.chapterProgress || {}),
          skillKeys: Object.keys(history.skillProgress || {}),
          weakAreas: history.weakAreas?.length || 0,
          strongAreas: history.strongAreas?.length || 0
        });
        return history;
      } else {
        console.log('📋 学習履歴が見つかりません（初回利用）');
      }
    } catch (error) {
      console.error('学習履歴の読み込みに失敗しました:', error);
    }

    // 初期状態を返す
    const emptyHistory = {
      sessions: [],
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      averageSessionDuration: 0,
      lastSessionDate: 0,
      chapterProgress: {},
      skillProgress: {},
      weakAreas: [],
      strongAreas: [],
      weakSkills: [],
      strongSkills: [],
      learningTrend: 'stable' as 'stable',
      recommendedFocus: [],
    };
    console.log('📋 初期状態の履歴を返却');
    return emptyHistory;
  }

  // 統計情報を更新
  private static updateStatistics(history: ComprehensiveLearningHistory): void {
    const totalQuestions = history.sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
    const totalCorrect = history.sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    
    // 有効な期間を持つセッションのみで平均時間を計算（異常値も除外）
    const validSessions = history.sessions.filter(session => 
      session.duration > 0 && 
      session.duration <= 7200 && // 2時間以内
      !isNaN(session.duration)
    );
    const totalDuration = validSessions.reduce((sum, session) => sum + session.duration, 0);

    history.totalQuestionsAnswered = totalQuestions;
    history.totalCorrectAnswers = totalCorrect;
    history.overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    history.averageSessionDuration = validSessions.length > 0 ? Math.round(totalDuration / validSessions.length) : 0;
    history.lastSessionDate = history.sessions.length > 0 ? history.sessions[history.sessions.length - 1].timestamp : 0;
    
    // デバッグ情報
    console.log('Statistics Update:', {
      totalSessions: history.sessions.length,
      validSessions: validSessions.length,
      invalidSessions: history.sessions.filter(s => s.duration > 7200 || s.duration <= 0 || isNaN(s.duration)),
      totalDuration,
      averageSessionDuration: history.averageSessionDuration
    });
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

        // スキル別進捗も更新
        const skillCategory = this.detectSkillFromQuestion(questionText);
        if (skillCategory) {
          this.updateSkillProgress(history, questionText, skillCategory, chapter, session.timestamp, isCorrect);
        }
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
    // 有効な章のみを対象にする（chapter1-5のみ）
    const validChapters = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
    
    // 改善が必要な領域を特定（精度が60%未満の章）
    history.weakAreas = Object.entries(history.chapterProgress)
      .filter(([chapter, progress]) => 
        validChapters.includes(chapter) && 
        progress.accuracy < 60 && 
        progress.totalAnswered >= 3
      )
      .map(([chapter, _]) => chapter);

    // 強い領域を特定（精度が80%以上の章）
    history.strongAreas = Object.entries(history.chapterProgress)
      .filter(([chapter, progress]) => 
        validChapters.includes(chapter) && 
        progress.accuracy >= 80 && 
        progress.totalAnswered >= 3
      )
      .map(([chapter, _]) => chapter);

    // スキル別分析
    // 弱いスキルを特定（精度が60%未満）
    history.weakSkills = Object.entries(history.skillProgress)
      .filter(([skill, progress]) => 
        progress.accuracy < 60 && 
        progress.totalAnswered >= 2 // スキルは少ない問題数でも分析
      )
      .map(([skill, _]) => skill);

    // 強いスキルを特定（精度が80%以上）
    history.strongSkills = Object.entries(history.skillProgress)
      .filter(([skill, progress]) => 
        progress.accuracy >= 80 && 
        progress.totalAnswered >= 2
      )
      .map(([skill, _]) => skill);

    // 推奨学習領域を設定（学習順序と継続学習を考慮）
    const chapterProgress = history.chapterProgress;
    const recommendations: string[] = [];

    // 1. 未学習の章を優先（問題数が少ない章）
    const unstudiedChapters = validChapters.filter(chapter => {
      const progress = chapterProgress[chapter];
      return !progress || progress.totalAnswered < 5;
    });

    // 2. 中程度の理解度の章（60-79%）で継続学習が効果的
    const moderateChapters = Object.entries(chapterProgress)
      .filter(([chapter, progress]) => 
        validChapters.includes(chapter) && 
        progress.accuracy >= 60 && 
        progress.accuracy < 80 && 
        progress.totalAnswered >= 3
      )
      .sort(([,a], [,b]) => a.accuracy - b.accuracy) // 低い順
      .map(([chapter, _]) => chapter);

    // 3. 基礎章の優先度を高める（chapter1は常に重要）
    const foundationChapters = ['chapter1'].filter(chapter => 
      validChapters.includes(chapter) &&
      !history.strongAreas.includes(chapter)
    );

    // 推奨順序: 未学習 → 基礎章 → 中程度の章
    recommendations.push(...unstudiedChapters);
    recommendations.push(...foundationChapters.filter(c => !recommendations.includes(c)));
    recommendations.push(...moderateChapters.filter(c => !recommendations.includes(c)));

    // 全く学習していない場合は順序通り
    if (recommendations.length === 0) {
      recommendations.push('chapter1', 'chapter2', 'chapter3');
    }

    // 推奨学習領域を得意領域（strongAreas）に置き換え
    history.recommendedFocus = history.strongAreas.slice(0, 3);

    // デバッグ情報
    console.log('推奨学習領域の分析:', {
      unstudiedChapters,
      moderateChapters,
      foundationChapters,
      weakAreas: history.weakAreas,
      strongAreas: history.strongAreas,
      weakSkills: history.weakSkills,
      strongSkills: history.strongSkills,
      finalRecommendations: history.recommendedFocus
    });
  }

  // 章を問題文から推測（現在の5章構成に対応）
  private static detectChapterFromQuestion(questionText: string): string | null {
    const chapterKeywords = {
      'chapter1': ['基礎', '基本', '概要', '導入', 'AI', '人工知能', 'ANI', 'AGI', '機械学習', 'ディープラーニング'],
      'chapter2': ['生成AI', 'GPT', 'BERT', 'Transformer', 'LLM', '大規模言語モデル', 'CNN', 'RNN', 'LSTM'],
      'chapter3': ['情報リテラシー', 'AI倫理', 'バイアス', 'プライバシー', 'セキュリティ', '著作権', 'GDPR'],
      'chapter4': ['プロンプト', 'プロンプトエンジニアリング', 'Zero-Shot', 'Few-Shot', 'Chain-of-Thought', '指示'],
      'chapter5': ['実践', '応用', '活用', '事例', 'ビジネス', '導入', '実装', '技術動向', '将来展望'],
    };

    for (const [chapter, keywords] of Object.entries(chapterKeywords)) {
      if (keywords.some(keyword => questionText.includes(keyword))) {
        return chapter;
      }
    }

    return null;
  }

  // 問題文からスキルカテゴリを検出
  private static detectSkillFromQuestion(questionText: string): string | null {
    const skillKeywords = {
      // 第1章のスキル分野
      'AI基礎理論': ['定義', '歴史', 'ブーム', 'シンギュラリティ', 'ANI', 'AGI', 'AI効果', '特異点', '人工知能', 'クラスタリング'],
      '機械学習手法': ['機械学習', '教師あり', '教師なし', '強化学習', 'ディープラーニング', 'ニューラルネットワーク', '転移学習', '半教師あり'],
      'AI技術原理': ['ルールベース', 'アルゴリズム', '過学習', '転移学習', '画像認識', 'オーバーフィッティング', '特徴量'],
      
      // 第2章のスキル分野
      '生成AI概要': ['生成AI', 'GPT', 'BERT', 'Transformer', 'LLM', '大規模言語モデル', 'VAE', 'GAN'],
      'アーキテクチャ': ['CNN', 'RNN', 'LSTM', 'アテンション', 'エンコーダ', 'デコーダ', '畳み込み', 'トランスフォーマー'],
      'モデル特性': ['パラメータ', 'トークン', 'ファインチューニング', '事前学習', 'Code Interpreter', 'プラグイン'],
      
      // 第3章のスキル分野
      'AI倫理': ['AI倫理', 'バイアス', '公平性', '透明性', '説明可能性', '倫理', '差別'],
      'プライバシー・セキュリティ': ['プライバシー', 'セキュリティ', 'GDPR', '個人情報', 'データ保護', '暗号化', 'デジタル署名', 'ソーシャルエンジニアリング'],
      '著作権・法的問題': ['著作権', '知的財産', '法的責任', 'ライセンス', '法的', '所有権'],
      
      // 第4章のスキル分野
      'プロンプト基礎': ['プロンプト', 'プロンプトエンジニアリング', '指示', 'コンテキスト', 'システムメッセージ'],
      'プロンプト技法': ['Zero-Shot', 'Few-Shot', 'Chain-of-Thought', 'CoT', 'ReAct', 'ショット学習'],
      'プロンプト最適化': ['改善', '調整', '精度向上', '出力制御', 'バージョン管理', 'コンテキストウィンドウ'],
      
      // 第5章のスキル分野
      'ビジネス活用': ['ビジネス', '活用', '事例', '導入', 'ROI', '効果測定', '企業', '組織'],
      '技術実装': ['実装', '技術的課題', 'API', '統合', 'システム', '計算リソース'],
      '将来動向': ['技術動向', '将来展望', 'トレンド', '発展', '課題', '未来', '展望'],
    };

    for (const [skill, keywords] of Object.entries(skillKeywords)) {
      const matchedKeyword = keywords.find(keyword => questionText.includes(keyword));
      if (matchedKeyword) {
        console.log('🎯 スキル検出成功:', { skill, matchedKeyword, questionStart: questionText.substring(0, 50) + '...' });
        return skill;
      }
    }

    console.log('⚠️ スキル検出失敗:', questionText.substring(0, 100) + '...');
    return null;
  }

  // スキル別進捗を更新
  private static updateSkillProgress(
    history: ComprehensiveLearningHistory, 
    questionText: string, 
    skillCategory: string, 
    chapter: string,
    timestamp: number, 
    isCorrect: boolean
  ): void {
    if (!history.skillProgress[skillCategory]) {
      history.skillProgress[skillCategory] = {
        totalAnswered: 0,
        totalCorrect: 0,
        accuracy: 0,
        chapter,
        lastAttempted: 0,
      };
    }

    const skillProgress = history.skillProgress[skillCategory];
    skillProgress.totalAnswered += 1;
    
    if (isCorrect) {
      skillProgress.totalCorrect += 1;
    }
    
    skillProgress.accuracy = Math.round((skillProgress.totalCorrect / skillProgress.totalAnswered) * 100);
    skillProgress.lastAttempted = timestamp;
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
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      console.log('💾 学習履歴保存成功:', {
        totalSessions: history.totalSessions,
        chapterKeys: Object.keys(history.chapterProgress),
        storageKey: this.STORAGE_KEY
      });
      
      // カスタムイベントを発行して他のコンポーネントに通知
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('learningHistoryUpdated', {
          detail: { 
            totalSessions: history.totalSessions,
            chapterProgress: history.chapterProgress 
          }
        }));
      }
    } catch (error) {
      console.error('❌ 学習履歴保存エラー:', error);
    }
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
      weakSkills: history.weakSkills,
      strongSkills: history.strongSkills,
      recommendedFocus: history.recommendedFocus,
      chapterProgress: history.chapterProgress,
    };
  }

  // リアルタイム問題回答を記録（セッション途中での更新）
  static recordAnswer(questionText: string, userAnswer: string, isCorrect: boolean, timestamp: number = Date.now()) {
    if (typeof window === 'undefined') {
      // サーバーサイドでは何もしない
      console.log('❌ サーバーサイドのため recordAnswer をスキップ');
      return;
    }
    
    console.log('📝 recordAnswer 開始:', { questionText: questionText.substring(0, 50) + '...', isCorrect });
    
    const history = this.getHistory();
    
    // 章を検出
    const chapter = this.detectChapterFromQuestion(questionText);
    console.log('🔍 章検出結果:', { chapter, questionStart: questionText.substring(0, 50) + '...' });
    
    if (chapter) {
      // 章別進捗を更新
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
      
      if (isCorrect) {
        progress.totalCorrect += 1;
      }
      
      progress.accuracy = Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
      progress.lastAttempted = timestamp;

      // スキル別進捗も更新
      const skillCategory = this.detectSkillFromQuestion(questionText);
      if (skillCategory) {
        this.updateSkillProgress(history, questionText, skillCategory, chapter, timestamp, isCorrect);
      }
    } else {
      console.warn('⚠️ 章が検出されませんでした:', questionText.substring(0, 100) + '...');
    }

    // 推奨学習領域を更新
    this.updateRecommendations(history);
    
    this.saveHistory(history);
    
    console.log('✅ recordAnswer 完了:', {
      question: questionText.substring(0, 50) + '...',
      chapter,
      isCorrect,
      chapterProgress: history.chapterProgress[chapter || ''],
      totalChapters: Object.keys(history.chapterProgress).length
    });
  }
} 