'use client';

import { useState, useEffect, useMemo } from 'react';
import { Question, Course, Quiz } from '@/types';
import { Brain, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Clock, Target, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LearningHistoryManager } from '@/app/utils/learningHistory';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 学習履歴の型定義
interface QuizHistory {
  answers: { [key: string]: string }; // 問題IDをキーとして使用
  correctAnswers: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  completed: boolean;
  timestamp: number;
  isReviewMode: boolean; // 復習モードかどうかを追加
  selectedQuestionCount?: number; // 選択された問題数を追加
}

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // 問題IDをキーとして使用
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false); // 復習モードの状態を追加
  const [showQuestionCountSelector, setShowQuestionCountSelector] = useState(true); // 問題数選択画面の表示状態
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | null>(null); // 選択された問題数
  const [sessionStartTime, setSessionStartTime] = useState<number>(0); // セッション開始時間
  const [showQuestionCountModal, setShowQuestionCountModal] = useState(false); // 問題数変更モーダルの表示状態
  const [availableQuestions, setAvailableQuestions] = useState(0); // 利用可能な問題数
  const [questionStartTimes, setQuestionStartTimes] = useState<{ [questionId: string]: number }>({}); // 各問題の表示時刻
  const [questionTimes, setQuestionTimes] = useState<{ [questionId: string]: number }>({}); // 各問題の解答時間（秒）
  const [reviewModeSelector, setReviewModeSelector] = useState<'normal' | 'review'>('normal'); // 復習モード選択状態
  // 問題数オプション
  const questionCountOptions = [
    { count: 10, label: '10問', time: '約5分', description: '短時間でサクッと復習' },
    { count: 20, label: '20問', time: '約10分', description: '標準的な演習時間' },
    { count: 30, label: '30問', time: '約15分', description: 'じっくりと学習' },
    { count: 60, label: '60問', time: '約60分', description: '本番試験レベル' },
    { count: 100, label: '100問', time: '約50分', description: '集中的な演習' },
    { count: 300, label: '300問', time: '約150分', description: '全問題制覇・完全マスター' },
  ];

  // ローカルストレージから学習履歴を読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    
    if (savedHistory) {
      try {
        const history: QuizHistory = JSON.parse(savedHistory);
        // 24時間以内の履歴のみ有効とする
        const isRecent = Date.now() - history.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent && !history.completed && history.selectedQuestionCount) {
          // 履歴がある場合は、APIから問題を取得
          console.log('📋 保存された履歴を復元中...');
          fetchQuestions(history.selectedQuestionCount, history);
          return;
        }
      } catch (error) {
        console.error('学習履歴の読み込みに失敗しました:', error);
      }
    }
    
    // 履歴がない場合や無効な場合は問題数選択画面を表示
    setIsLoading(false);
  }, []);

  // 復習していない間違えた問題を取得（問題数選択なし、すべての間違えた問題を出題）
  const fetchReviewQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. 全問題データを取得
      const allQuestionsResponse = await fetch(`/api/quiz-questions?count=300`);
      if (!allQuestionsResponse.ok) {
        throw new Error('問題データの取得に失敗しました');
      }
      const allQuestionsData = await allQuestionsResponse.json();
      const allQuestionsList: Question[] = allQuestionsData.questions;

      // 2. 復習していない間違えた問題文のリストを取得
      const unreviewedWrongQuestionTexts = LearningHistoryManager.getUnreviewedWrongQuestionTexts();
      
      if (unreviewedWrongQuestionTexts.length === 0) {
        alert('復習する問題がありません。まず通常モードで問題演習を行ってください。');
        setIsLoading(false);
        return;
      }

      // 3. 問題データから間違えた問題をフィルタリング（正解判定が必要）
      const history = LearningHistoryManager.getHistory();
      const wrongQuestions: Question[] = [];
      const wrongQuestionTextSet = new Set(unreviewedWrongQuestionTexts);

      // 全問題データから、間違えた問題を抽出
      allQuestionsList.forEach(question => {
        if (wrongQuestionTextSet.has(question.question)) {
          // 通常モードのセッションで間違えた問題か確認
          let isWrong = false;
          history.sessions.forEach(session => {
            if (!session.isReviewMode && session.answers[question.question]) {
              const userAnswer = session.answers[question.question];
              if (userAnswer !== question.correctAnswer) {
                isWrong = true;
              }
            }
          });
          
          // 復習モードで正解した問題は除外
          let isReviewed = false;
          history.sessions.forEach(session => {
            if (session.isReviewMode && session.answers[question.question]) {
              const userAnswer = session.answers[question.question];
              if (userAnswer === question.correctAnswer) {
                isReviewed = true;
              }
            }
          });

          if (isWrong && !isReviewed) {
            wrongQuestions.push(question);
          }
        }
      });

      if (wrongQuestions.length === 0) {
        alert('復習する問題がありません。すべて復習済みです！');
        setIsLoading(false);
        return;
      }

      // 4. シャッフルしてすべての間違えた問題を出題
      const shuffled = shuffleArray(wrongQuestions);

      console.log('📊 復習問題データ取得成功:', shuffled.length, '問');

      setAllQuestions(shuffled);
      setAvailableQuestions(shuffled.length);
      setSelectedQuestionCount(shuffled.length);
      setIsReviewMode(true);
      setSessionStartTime(Date.now());
      setQuestionStartTimes({});
      setQuestionTimes({});
      setShowQuestionCountSelector(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (count: number, history?: QuizHistory) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/quiz-questions?count=${count}`);
      if (!response.ok) {
        throw new Error('問題の取得に失敗しました');
      }
      const data = await response.json();
      
      // デバッグ情報を追加
      console.log('📊 問題データ取得成功:', data.questions.length, '問');
      
      setAllQuestions(data.questions); // data.questionsから配列を取得
      setAvailableQuestions(data.totalQuestions); // 利用可能な問題数を設定
      
      if (history) {
        // 履歴から状態を復元
        setAnswers(history.answers);
        setCorrectAnswers(history.correctAnswers);
        setCurrentQuestionIndex(history.currentQuestionIndex);
        setQuizCompleted(false);
        setIsReviewMode(history.isReviewMode || false);
        setSelectedQuestionCount(history.selectedQuestionCount || null);
        // 履歴から復元する場合も、新しいセッション開始時間を設定（計測を継続）
        setSessionStartTime(Date.now());
      }
      
      // 問題数選択画面を隠す
      setShowQuestionCountSelector(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 学習履歴をローカルストレージに保存
  const saveHistory = (newAnswers: { [key: string]: string }, newCorrectAnswers: number, newCurrentIndex: number, completed: boolean) => {
    const history: QuizHistory = {
      answers: newAnswers,
      correctAnswers: newCorrectAnswers,
      totalQuestions: selectedQuestionCount || allQuestions.length,
      currentQuestionIndex: newCurrentIndex,
      completed,
      timestamp: Date.now(),
      isReviewMode,
      selectedQuestionCount: selectedQuestionCount || undefined
    };
    localStorage.setItem('quizHistory', JSON.stringify(history));
  };

  // 復習モード開始処理
  const handleStartReviewMode = () => {
    fetchReviewQuestions();
  };

  // 問題数選択時の処理
  const handleQuestionCountSelect = (count: number) => {

    // 通常モード: 学習履歴がある場合は確認
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      try {
        const history: QuizHistory = JSON.parse(savedHistory);
        const isRecent = Date.now() - history.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent && !history.completed && !history.isReviewMode) {
          const choice = window.confirm(
            `前回の学習履歴があります。\n\n` +
            `前回: ${history.answers ? Object.keys(history.answers).length : 0}問回答済み\n` +
            `正解: ${history.correctAnswers || 0}問\n\n` +
            `「OK」を押すと前回の続きから再開します。\n` +
            `「キャンセル」を押すと新しい演習を開始します。\n\n` +
            `前回の続きから再開しますか？`
          );
          
          if (choice) {
            // 前回の続きから再開
            fetchQuestions(history.selectedQuestionCount || count, history);
            return;
          } else {
            // 新しい演習を開始（履歴は削除しない）
          }
        }
      } catch (error) {
        console.error('学習履歴の読み込みに失敗しました:', error);
      }
    }
    
    setSelectedQuestionCount(count);
    setShowQuestionCountSelector(false);
    setSessionStartTime(Date.now());
    setQuestionStartTimes({});
    setQuestionTimes({});
    fetchQuestions(count);
    
    // 初期状態をリセット
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setIsReviewMode(false);
  };

  const currentQuestion = useMemo(() => allQuestions[currentQuestionIndex], [allQuestions, currentQuestionIndex]);
  
  // 選択肢の順序をシャッフル（問題が変わるたびに再シャッフル）
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) return [];
    return shuffleArray([...currentQuestion.options]);
  }, [currentQuestion, currentQuestionIndex]);

  const answeredQuestions = Object.keys(answers).length;
  const currentAccuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

  // 間違えた問題の数を計算
  const wrongAnswersCount = Object.keys(answers).filter(questionId => {
    const userAnswer = answers[questionId];
    const question = allQuestions.find(q => q.question === questionId);
    return question && userAnswer !== question.correctAnswer;
  }).length;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // 問題が表示された時刻を記録
  useEffect(() => {
    if (currentQuestion && allQuestions.length > 0) {
      const questionId = currentQuestion.question;
      // まだ記録されていない場合のみ記録（復元時は記録しない）
      if (!questionStartTimes[questionId]) {
        setQuestionStartTimes(prev => ({
          ...prev,
          [questionId]: Date.now()
        }));
      }
    }
  }, [currentQuestionIndex, currentQuestion, allQuestions.length]); // questionStartTimesは依存関係に含めない（無限ループを防ぐ）

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const questionId = currentQuestion.question;
    
    // 解答時間を計算（問題表示時刻から現在時刻まで）
    const startTime = questionStartTimes[questionId] || Date.now(); // フォールバック（念のため）
    const answerTime = Date.now();
    const timeSpent = Math.round((answerTime - startTime) / 1000); // 秒単位
    
    // 解答時間を記録（0秒以下は記録しない）
    if (timeSpent > 0) {
      setQuestionTimes(prev => ({
        ...prev,
        [questionId]: timeSpent
      }));
    }
    
    const newAnswers = {
      ...answers,
      [questionId]: selectedAnswer // 問題文をIDとして使用
    };
    
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    
    setAnswers(newAnswers);
    setCorrectAnswers(newCorrectAnswers);
    setShowResult(true);

    // リアルタイム学習履歴を記録
    console.log('🎯 問題回答記録開始:', {
      question: currentQuestion.question.substring(0, 50) + '...',
      chapter: currentQuestion.chapter,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent
    });
    
    try {
      LearningHistoryManager.recordAnswer(
        currentQuestion.question,
        selectedAnswer,
        isCorrect,
        Date.now()
      );
      console.log('✅ リアルタイム学習履歴記録成功');
    } catch (error) {
      console.error('❌ 学習履歴記録エラー:', error);
    }

    // 学習履歴を保存
    saveHistory(newAnswers, newCorrectAnswers, currentQuestionIndex, false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      
      // 学習履歴を保存
      saveHistory(answers, correctAnswers, newIndex, false);
    } else {
      setQuizCompleted(true);
      // 完了時の履歴を保存
      saveHistory(answers, correctAnswers, currentQuestionIndex, true);
      
      // 総合学習履歴にセッションを追加
      const currentTime = Date.now();
      const sessionDuration = sessionStartTime > 0 ? Math.round((currentTime - sessionStartTime) / 1000) : 0; // 秒単位
      const finalAccuracy = Math.round((correctAnswers / allQuestions.length) * 100);
      
      // 実際の解答時間を記録（回答した問題のみ）
      const actualQuestionTimes: { [questionId: string]: number } = {};
      Object.keys(answers).forEach(questionId => {
        if (questionTimes[questionId]) {
          actualQuestionTimes[questionId] = questionTimes[questionId];
        }
      });
      
      // デバッグ情報
      console.log('Session End Debug:', {
        sessionStartTime,
        currentTime,
        rawDuration: currentTime - sessionStartTime,
        sessionDuration,
        finalAccuracy,
        questionTimesCount: Object.keys(actualQuestionTimes).length,
        totalAnswered: Object.keys(answers).length
      });
      
      console.log('🏁 セッション完了 - 学習履歴に追加中...', {
        answers: Object.keys(answers).length,
        correctAnswers,
        totalQuestions: allQuestions.length,
        accuracy: finalAccuracy,
        duration: sessionDuration,
        questionTimes: Object.keys(actualQuestionTimes).length
      });
      
      try {
        LearningHistoryManager.addSession({
          timestamp: currentTime,
          answers,
          correctAnswers,
          totalQuestions: allQuestions.length,
          accuracy: finalAccuracy,
          duration: Math.max(0, sessionDuration), // 負の値を防ぐ
          selectedQuestionCount: selectedQuestionCount || allQuestions.length,
          isReviewMode,
          questionTimes: Object.keys(actualQuestionTimes).length > 0 ? actualQuestionTimes : undefined,
        });
        console.log('✅ セッション学習履歴記録成功 - タイムスタンプ:', new Date(currentTime));
      } catch (error) {
        console.error('❌ セッション学習履歴記録エラー:', error);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(answers[allQuestions[newIndex]?.question] || null);
      setShowResult(false);
      
      // 学習履歴を保存
      saveHistory(answers, correctAnswers, newIndex, false);
    }
  };

  const resetQuiz = () => {
    setShowQuestionCountSelector(true);
    setSelectedQuestionCount(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setIsReviewMode(false);
    setQuestionStartTimes({});
    setQuestionTimes({});
    
    // 学習履歴をクリア
    localStorage.removeItem('quizHistory');
  };

  // 学習履歴をクリアする関数
  const clearHistory = () => {
    localStorage.removeItem('quizHistory');
    // 総合学習履歴もクリア
    LearningHistoryManager.clearHistory();
    resetQuiz();
  };

  // 間違えた問題のみを復習する関数
  const reviewWrongAnswers = () => {
    const wrongQuestions: Question[] = [];
    
    // 間違えた問題を特定
    Object.keys(answers).forEach(questionId => {
      const userAnswer = answers[questionId];
      const question = allQuestions.find(q => q.question === questionId);
      
      if (question && userAnswer !== question.correctAnswer) {
        wrongQuestions.push(question);
      }
    });

    if (wrongQuestions.length === 0) {
      alert('間違えた問題はありません。素晴らしいです！');
      return;
    }

    // 間違えた問題のみで新しいクイズを開始
    setAllQuestions(wrongQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setIsReviewMode(true);
    setSessionStartTime(Date.now()); // 復習モードでも新しいセッション開始時間を設定

    // 復習用の履歴を保存
    const reviewHistory: QuizHistory = {
      answers: {},
      correctAnswers: 0,
      totalQuestions: wrongQuestions.length,
      currentQuestionIndex: 0,
      completed: false,
      timestamp: Date.now(),
      isReviewMode: true,
      selectedQuestionCount: wrongQuestions.length
    };
    localStorage.setItem('quizHistory', JSON.stringify(reviewHistory));
  };

  // 問題数変更の処理
  const handleQuestionCountChange = async (newCount: number) => {
    // 現在の進捗を確認
    const hasProgress = Object.keys(answers).length > 0;
    
    if (hasProgress) {
      // 進捗がある場合は確認ダイアログを表示
      const confirmed = window.confirm(
        `⚠️ 問題数を変更すると、現在の学習履歴が削除されます！\n\n` +
        `現在の状況:\n` +
        `• ${Object.keys(answers).length}問回答済み\n` +
        `• 正解: ${correctAnswers}問\n` +
        `• 現在の問題: ${currentQuestionIndex + 1}問目\n\n` +
        `問題数を${newCount}問に変更すると、\n` +
        `現在の進捗は全てリセットされ、\n` +
        `続きから再開することはできません。\n\n` +
        `本当に問題数を変更しますか？`
      );
      
      if (!confirmed) {
        return;
      }
    }

    try {
      // 実際の利用可能な問題数を取得
      const response = await fetch(`/api/quiz-questions?count=1`);
      if (!response.ok) {
        throw new Error('問題数の取得に失敗しました');
      }
      const data = await response.json();
      const actualAvailableQuestions = data.totalQuestions;
      
      if (newCount > actualAvailableQuestions) {
        alert(`利用可能な問題数（${actualAvailableQuestions}問）を超えています。全${actualAvailableQuestions}問で演習を開始します。`);
        newCount = actualAvailableQuestions;
      }

      // 学習履歴を削除
      clearHistory();
      
      // 新しい問題セットを取得
      const newResponse = await fetch(`/api/quiz-questions?count=${newCount}`);
      if (!newResponse.ok) {
        throw new Error('新しい問題の取得に失敗しました');
      }
      const newData = await newResponse.json();
      
      // 状態をリセットして新しい問題セットを設定
      setAllQuestions(newData.questions);
      setAvailableQuestions(newData.totalQuestions);
      setSelectedQuestionCount(newCount);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswers({});
      setCorrectAnswers(0);
      setQuizCompleted(false);
      setIsReviewMode(false);
      setSessionStartTime(Date.now());
      setQuestionStartTimes({});
      setQuestionTimes({});
      setShowQuestionCountModal(false);
      
      // 成功メッセージを表示
      alert(`問題数を${newCount}問に変更しました。\n新しい演習を開始します。`);
      
    } catch (err) {
      alert('問題数の変更に失敗しました: ' + (err instanceof Error ? err.message : '不明なエラー'));
    }
  };

  // 問題数変更モーダルを開く
  const openQuestionCountModal = () => {
    setShowQuestionCountModal(true);
  };

  // TOPに戻る際の確認処理（途中で辞めた場合もセッションを保存）
  const handleGoHome = () => {
    const hasProgress = Object.keys(answers).length > 0;
    
    if (hasProgress) {
      const choice = window.confirm(
        `現在${Object.keys(answers).length}問回答済みです。\n\n` +
        `「OK」を押すと学習履歴を保持してホームに戻ります。\n` +
        `次回問題演習にアクセスした際に、続きから再開できます。\n\n` +
        `「キャンセル」を押すとそのまま演習を続けます。\n\n` +
        `学習履歴を保持してホームに戻りますか？`
      );
      
      if (choice) {
        // 途中で辞めた場合でも、回答した問題のセッションを保存
        const currentTime = Date.now();
        const sessionDuration = sessionStartTime > 0 ? Math.round((currentTime - sessionStartTime) / 1000) : 0;
        const answeredCount = Object.keys(answers).length;
        const finalAccuracy = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;
        
        // 実際の解答時間を記録（回答した問題のみ）
        const actualQuestionTimes: { [questionId: string]: number } = {};
        Object.keys(answers).forEach(questionId => {
          if (questionTimes[questionId]) {
            actualQuestionTimes[questionId] = questionTimes[questionId];
          }
        });
        
        try {
          LearningHistoryManager.addSession({
            timestamp: currentTime,
            answers,
            correctAnswers,
            totalQuestions: answeredCount, // 回答した問題数
            accuracy: finalAccuracy,
            duration: Math.max(0, sessionDuration),
            selectedQuestionCount: selectedQuestionCount || allQuestions.length,
            isReviewMode,
            questionTimes: Object.keys(actualQuestionTimes).length > 0 ? actualQuestionTimes : undefined,
          });
          console.log('✅ 途中終了セッション記録成功');
        } catch (error) {
          console.error('❌ 途中終了セッション記録エラー:', error);
        }
        
        // 履歴を保持してホームに戻る
        window.location.href = '/';
      }
      // キャンセルの場合は何もしない（そのまま演習を続ける）
    } else {
      // 進捗がない場合は直接ホームに戻る
      window.location.href = '/';
    }
  };

  // 問題数選択画面
  if (showQuestionCountSelector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-600">準備中です...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">問題演習</h1>
              <p className="text-gray-500 mt-2">問題数を選択して、実力を試しましょう</p>
              <button 
                onClick={handleGoHome}
                className="inline-flex items-center mt-6 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ホームに戻る
              </button>
            </div>

            {/* モード選択タブ */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setReviewModeSelector('normal')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  reviewModeSelector === 'normal'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Brain className="w-4 h-4 inline-block mr-2" />
                通常モード
              </button>
              <button
                onClick={() => setReviewModeSelector('review')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  reviewModeSelector === 'review'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BookOpen className="w-4 h-4 inline-block mr-2" />
                復習モード
                <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">推奨</span>
              </button>
            </div>

            {reviewModeSelector === 'review' ? (
              <div className="space-y-4">
                <div className="p-6 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <BookOpen className="w-6 h-6 text-orange-600 mr-3" />
                    <h3 className="text-xl font-bold text-orange-800">復習モード</h3>
                  </div>
                  <p className="text-sm text-orange-800 mb-4">
                    まだ復習していない間違えた問題から出題します。間隔を置いた復習で記憶の定着を促進します。
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartReviewMode}
                    className="w-full py-4 px-6 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                  >
                    復習を開始する
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionCountOptions.map((option) => (
                <motion.button
                  key={option.count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuestionCountSelect(option.count)}
                  className="p-6 text-left bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.time}</div>
                  <p className="text-gray-600 mt-2">{option.description}</p>
                </motion.button>
              ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="ml-4 text-gray-600">問題を読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>エラー: {error}</p>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">問題が見つかりませんでした。</p>
        <button
          onClick={() => setShowQuestionCountSelector(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          問題数を選択し直す
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    const finalAccuracy = Math.round((correctAnswers / allQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isReviewMode ? '復習完了！' : '問題演習完了！'}
              </h1>
              <p className="text-xl text-gray-600">お疲れさまでした</p>
            </div>

            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={finalAccuracy >= 80 ? "#10b981" : finalAccuracy >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - finalAccuracy / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{finalAccuracy}%</span>
                </div>
              </div>
              <p className="text-lg text-gray-700">
                正解: {correctAnswers} / {allQuestions.length}問
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isReviewMode ? 'もう一度復習する' : 'もう一度挑戦'}
              </button>
              <button
                onClick={openQuestionCountModal}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Target className="w-4 h-4 mr-2" />
                問題数を変更して再挑戦
              </button>
              {!isReviewMode && (
                <button
                  onClick={reviewWrongAnswers}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  間違えた問題を復習する
                </button>
              )}
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-600" />
                {isReviewMode ? '復習モード' : '問題演習'}
                {isReviewMode && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                    復習モード
                  </span>
                )}
              </h1>
              <p className="text-gray-600">問題 {currentQuestionIndex + 1} / {allQuestions.length}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-blue-600 font-medium">
                  {selectedQuestionCount}問演習
                </span>
              </div>
              {answeredQuestions > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ 学習履歴が保存されています
                </p>
              )}
              {wrongAnswersCount > 0 && !isReviewMode && (
                <p className="text-sm text-orange-600 mt-1">
                  ⚠ 間違えた問題: {wrongAnswersCount}問
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">現在の正答率</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentAccuracy}%
              </div>
              <div className="text-sm text-gray-500">
                正解: {correctAnswers} / {answeredQuestions}問
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={openQuestionCountModal}
                  className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Target className="w-4 h-4 mr-1" />
                  問題数変更
                </button>
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  TOPに戻る
                </button>
              </div>
              {wrongAnswersCount > 0 && !isReviewMode && (
                <button
                  onClick={reviewWrongAnswers}
                  className="inline-flex items-center mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  間違えた問題を復習
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* 問題 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  問題 {currentQuestionIndex + 1}
                </h3>
                {currentQuestion?.chapter && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {currentQuestion.chapter}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{currentQuestion?.question}</p>
            </div>

            <div className="space-y-3">
              {shuffledOptions.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : showResult && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option
                        ? showResult
                          ? option === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-blue-500 bg-blue-500'
                        : showResult && option === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                      {showResult && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 結果表示 */}
          {showResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-semibold ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '正解！' : '不正解'}
                </span>
              </div>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                前の問題
              </button>
            </div>

            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                解答する
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                次の問題
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* 問題数変更モーダル */}
        {showQuestionCountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">問題数を変更</h3>
                  <button
                    onClick={() => setShowQuestionCountModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                
                {/* 現在の進捗表示 */}
                {Object.keys(answers).length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800 font-medium">現在の進捗</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      {Object.keys(answers).length}問回答済み（正答率: {currentAccuracy}%）
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      問題数を変更すると、現在の進捗はリセットされます
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {questionCountOptions.map((option) => (
                    <button
                      key={option.count}
                      onClick={() => handleQuestionCountChange(option.count)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedQuestionCount === option.count
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {option.count <= availableQuestions 
                              ? `全${availableQuestions}問中${option.count}問を重複なしで出題`
                              : `利用可能な問題数: ${availableQuestions}問`
                            }
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{option.time}</div>
                          {selectedQuestionCount === option.count && (
                            <div className="text-xs text-blue-600 font-medium mt-1">現在選択中</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowQuestionCountModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 