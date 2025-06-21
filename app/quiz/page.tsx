'use client';

import { useState, useEffect } from 'react';
import { courses } from '@/data/courses';
import { Question } from '@/types';
import { Brain, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

// 学習履歴の型定義
interface QuizHistory {
  answers: { [key: string]: string }; // 問題IDをキーとして使用
  correctAnswers: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  completed: boolean;
  timestamp: number;
  isReviewMode: boolean; // 復習モードかどうかを追加
}

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // 問題IDをキーとして使用
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false); // 復習モードの状態を追加

  // ローカルストレージから学習履歴を読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      try {
        const history: QuizHistory = JSON.parse(savedHistory);
        // 24時間以内の履歴のみ有効とする
        const isRecent = Date.now() - history.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent && !history.completed) {
          setAnswers(history.answers);
          setCorrectAnswers(history.correctAnswers);
          setCurrentQuestionIndex(history.currentQuestionIndex);
          setQuizCompleted(false);
          setIsReviewMode(history.isReviewMode || false);
        }
      } catch (error) {
        console.error('学習履歴の読み込みに失敗しました:', error);
      }
    }
  }, []);

  // 全章の問題を取得してランダムに並び替え
  useEffect(() => {
    const questions: Question[] = [];
    courses.forEach(course => {
      course.quiz.forEach(quiz => {
        questions.push(...quiz.questions);
      });
    });
    
    // ランダムに並び替え
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    setAllQuestions(shuffledQuestions);
  }, []);

  // 学習履歴をローカルストレージに保存
  const saveHistory = (newAnswers: { [key: string]: string }, newCorrectAnswers: number, newCurrentIndex: number, completed: boolean) => {
    const history: QuizHistory = {
      answers: newAnswers,
      correctAnswers: newCorrectAnswers,
      totalQuestions: allQuestions.length,
      currentQuestionIndex: newCurrentIndex,
      completed,
      timestamp: Date.now(),
      isReviewMode
    };
    localStorage.setItem('quizHistory', JSON.stringify(history));
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
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

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswers = {
      ...answers,
      [currentQuestion.question]: selectedAnswer // 問題文をIDとして使用
    };
    
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    
    setAnswers(newAnswers);
    setCorrectAnswers(newCorrectAnswers);
    setShowResult(true);

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
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setIsReviewMode(false);
    
    // 問題を再度ランダムに並び替え
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    setAllQuestions(shuffledQuestions);
    
    // 学習履歴をクリア
    localStorage.removeItem('quizHistory');
  };

  // 学習履歴をクリアする関数
  const clearHistory = () => {
    localStorage.removeItem('quizHistory');
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

    // 復習用の履歴を保存
    const reviewHistory: QuizHistory = {
      answers: {},
      correctAnswers: 0,
      totalQuestions: wrongQuestions.length,
      currentQuestionIndex: 0,
      completed: false,
      timestamp: Date.now(),
      isReviewMode: true
    };
    localStorage.setItem('quizHistory', JSON.stringify(reviewHistory));
  };

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  // 学習履歴がある場合の復元確認
  const savedHistory = localStorage.getItem('quizHistory');
  let hasIncompleteHistory = false;
  if (savedHistory) {
    try {
      const history: QuizHistory = JSON.parse(savedHistory);
      const isRecent = Date.now() - history.timestamp < 24 * 60 * 60 * 1000;
      hasIncompleteHistory = isRecent && !history.completed;
    } catch (error) {
      // エラーが発生した場合は履歴を無視
    }
  }

  if (hasIncompleteHistory && answeredQuestions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">学習を続けますか？</h2>
            <p className="text-gray-600 mb-6">
              前回の学習履歴が見つかりました。続きから学習を再開しますか？
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const history: QuizHistory = JSON.parse(savedHistory!);
                  setAnswers(history.answers);
                  setCorrectAnswers(history.correctAnswers);
                  setCurrentQuestionIndex(history.currentQuestionIndex);
                  setSelectedAnswer(history.answers[allQuestions[history.currentQuestionIndex]?.question] || null);
                  setIsReviewMode(history.isReviewMode || false);
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                続きから学習を再開
              </button>
              <button
                onClick={clearHistory}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                新しい学習を開始
              </button>
            </div>
          </div>
        </div>
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
              {!isReviewMode && (
                <button
                  onClick={reviewWrongAnswers}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  間違えた問題を復習する
                </button>
              )}
              <Link
                href="/"
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ホームに戻る
              </Link>
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
              {wrongAnswersCount > 0 && !isReviewMode && (
                <button
                  onClick={reviewWrongAnswers}
                  className="inline-flex items-center mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  間違えた問題を復習
                </button>
              )}
              <Link
                href="/"
                className="inline-flex items-center mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                TOPに戻る
              </Link>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                問題 {currentQuestionIndex + 1}
              </h3>
              <p className="text-gray-700">{currentQuestion?.question}</p>
            </div>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, optionIndex) => (
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
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                TOPに戻る
              </Link>
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
      </div>
    </div>
  );
} 