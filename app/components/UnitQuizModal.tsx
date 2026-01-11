'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface UnitQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  unitTitle?: string;
}

export default function UnitQuizModal({
  isOpen,
  onClose,
  questions,
  unitTitle,
}: UnitQuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const getCorrectAnswersCount = () => {
    return questions.filter(
      (q, index) => selectedAnswers[index] === q.correctAnswer
    ).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {unitTitle ? `${unitTitle} - 確認問題` : '確認問題'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showResults ? (
            <>
              {/* 進捗バー */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>問題 {currentQuestionIndex + 1} / {questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 問題 */}
              <div className="mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    問題 {currentQuestionIndex + 1}
                  </h3>
                  <p className="text-gray-700">{currentQuestion.question}</p>
                </div>

                {/* 選択肢 */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswers[currentQuestionIndex] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                          selectedAnswers[currentQuestionIndex] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700 flex-1">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    前の問題
                  </div>
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    !selectedAnswers[currentQuestionIndex]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <div className="flex items-center">
                    {isLastQuestion ? '結果を見る' : '次の問題'}
                    {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* 結果表示 */
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">確認問題完了！</h2>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {getCorrectAnswersCount()} / {questions.length}
                  </div>
                  <div className="text-gray-600">
                    正答率: {Math.round((getCorrectAnswersCount() / questions.length) * 100)}%
                  </div>
                </div>
              </div>

              {/* 各問題の結果 */}
              <div className="space-y-4 mb-6 text-left">
                {questions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">問題 {index + 1}</span>
                        <span className={`text-sm font-semibold ${
                          isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isCorrect ? '正解' : '不正解'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                      <div className="text-sm">
                        <span className="text-gray-600">あなたの答え: </span>
                        <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAnswers[index] || '未回答'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">正解: </span>
                          <span className="font-medium text-green-600">{question.correctAnswer}</span>
                        </div>
                      )}
                      {question.explanation && (
                        <div className="text-sm mt-2 p-2 bg-white rounded border border-gray-200">
                          <span className="font-semibold text-blue-700">解説: </span>
                          <span className="text-gray-700">{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* リセットボタン */}
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                もう一度挑戦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


