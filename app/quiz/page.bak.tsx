'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types';
import { Brain, CheckCircle, XCircle, ArrowRight, RotateCcw, Clock, Target, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { LearningHistoryManager } from '@/app/utils/learningHistory';

const questionCountOptions = [
  { count: 10, label: '10問', time: '約5分' },
  { count: 20, label: '20問', time: '約10分' },
  { count: 30, label: '30問', time: '約15分' },
  { count: 50, label: '50問', time: '約25分' },
];

type QuizState = 'selecting' | 'loading' | 'active' | 'finished' | 'error';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalAvailableQuestions, setTotalAvailableQuestions] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);

  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchTotalCount = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz-questions?count=1`);
      if (!response.ok) throw new Error('問題数の取得に失敗しました。');
      const data = await response.json();
      setTotalAvailableQuestions(data.totalQuestions);
      setQuizState('selecting');
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      setQuizState('error');
    }
  }, []);

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  const handleStartQuiz = useCallback(async (count: number) => {
    setQuizState('loading');
    setError(null);
    setSelectedQuestionCount(count);

    try {
      const response = await fetch(`/api/quiz-questions?count=${count}`);
      if (!response.ok) throw new Error('問題の読み込みに失敗しました。');
      const data = await response.json();

      if (data.questions.length === 0) {
        throw new Error('問題が見つかりませんでした。');
      }

      setQuestions(data.questions);
      setSelectedAnswers(new Array(data.questions.length).fill(null));
      setCurrentQuestionIndex(0);
      setShowResult(false);
      setStartTime(Date.now());
      setQuizState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      setQuizState('error');
    }
  }, []);

  const handleSelectAnswer = (option: string) => {
    if (showResult) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (selectedAnswers[currentQuestionIndex] === null) return;
    setShowResult(true);
  };

  const calculateScore = useCallback(() => {
    return selectedAnswers.reduce((acc, answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [selectedAnswers, questions]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
    } else {
      setQuizState('finished');
      const score = calculateScore();
      const duration = startTime ? (Date.now() - startTime) / 1000 : 0;
      
      const answersObject: { [key: string]: string | null } = {};
      questions.forEach((q, i) => {
        answersObject[q.question] = selectedAnswers[i];
      });

      LearningHistoryManager.addSession({
        timestamp: Date.now(),
        answers: answersObject,
        correctAnswers: score,
        totalQuestions: questions.length,
        accuracy: (score / questions.length) * 100,
        duration: duration,
        selectedQuestionCount: questions.length,
        isReviewMode: false,
      });
    }
  }, [currentQuestionIndex, questions, calculateScore, startTime, selectedAnswers]);

  const handleGoToSelectionScreen = () => {
    setQuizState('selecting');
    setQuestions([]);
    setError(null);
  };

  const handleRestartQuiz = () => {
    if (selectedQuestionCount > 0) {
      handleStartQuiz(selectedQuestionCount);
    } else {
      handleGoToSelectionScreen();
    }
  };

  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-4">
      <XCircle className="w-12 h-12 mb-4" />
      <h2 className="text-2xl font-bold mb-2">エラーが発生しました</h2>
      <p className="mb-6">{error}</p>
      <button
        onClick={handleGoToSelectionScreen}
        className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
      >
        問題選択に戻る
      </button>
    </div>
  );

  const renderSelection = () => (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">問題演習</h1>
        <p className="text-gray-600">問題数を選択して、実力を試しましょう</p>
        <p className="text-sm text-gray-500 mt-2">利用可能な問題数: {totalAvailableQuestions}問</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          ホームに戻る
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {questionCountOptions.map((option) => (
          <button
            key={option.count}
            onClick={() => handleStartQuiz(option.count)}
            className="p-6 text-center bg-white rounded-lg border hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={option.count > totalAvailableQuestions}
          >
            <div className="text-2xl font-bold">{option.label}</div>
            <div className="text-sm text-gray-500 mt-1">{option.time}</div>
            {option.count > totalAvailableQuestions && <p className="text-xs text-red-500 mt-2">問題数が不足しています</p>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderActiveQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;
    const progress = (currentQuestionIndex / questions.length) * 100;
    
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">問題 {currentQuestionIndex + 1} / {questions.length}</span>
            <button onClick={handleGoToSelectionScreen} className="text-sm text-gray-500 hover:underline">終了する</button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              let buttonClass = 'w-full text-left p-3 rounded-lg border-2 ';
              if (showResult) {
                const isCorrect = option === currentQuestion.correctAnswer;
                if (isCorrect) {
                  buttonClass += 'bg-green-100 border-green-300';
                } else if (isSelected) {
                  buttonClass += 'bg-red-100 border-red-300';
                } else {
                  buttonClass += 'bg-white border-gray-200';
                }
              } else {
                if (isSelected) {
                  buttonClass += 'bg-blue-100 border-blue-500';
                } else {
                  buttonClass += 'bg-white hover:bg-gray-50 border-gray-200';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-2">
                {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? '正解' : '不正解'}
              </h3>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-6 text-right">
            {showResult ? (
              <button onClick={handleNextQuestion} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={selectedAnswers[currentQuestionIndex] === null} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">
                回答する
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFinished = () => {
    const score = calculateScore();
    const accuracy = (score / questions.length) * 100;
    const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    return (
      <div className="container mx-auto p-4 max-w-2xl text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">クイズ結果</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">正解率</p>
              <p className="text-2xl font-bold">{accuracy.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">スコア</p>
              <p className="text-2xl font-bold">{score} / {questions.length}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">所要時間</p>
              <p className="text-2xl font-bold">{duration}秒</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              もう一度挑戦
            </button>
            <button
              onClick={handleGoToSelectionScreen}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              問題選択に戻る
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (quizState === 'loading') return renderLoading();
  if (quizState === 'error') return renderError();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {quizState === 'selecting' && renderSelection()}
      {quizState === 'active' && renderActiveQuiz()}
      {quizState === 'finished' && renderFinished()}
    </div>
  );
} 