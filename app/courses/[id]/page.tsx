'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { courses } from '../../../data/courses';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  BarChart3, 
  Play,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courses.find(c => c.id === courseId);

  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">コースが見つかりません</h1>
          <Link href="/" className="btn-primary">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === course.quiz[selectedQuiz!].questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < course.quiz[selectedQuiz!].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-primary-500 to-primary-600';
      case 'secondary':
        return 'from-secondary-500 to-secondary-600';
      case 'accent':
        return 'from-accent-500 to-accent-600';
      case 'info':
        return 'from-info-500 to-info-600';
      case 'yellow':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初級':
        return 'bg-success-100 text-success-800';
      case '中級':
        return 'bg-warning-100 text-warning-800';
      case '上級':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/quiz" className="btn-outline">
                クイズ一覧
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* コースヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-r ${getColorClasses(course.color)} rounded-2xl p-8 text-white shadow-xl`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-white/90 mt-2">{course.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>{course.time}</span>
              </div>
              <div className={`px-4 py-2 rounded-lg ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <BarChart3 className="w-4 h-4" />
                <span>{course.quiz.length}個のクイズ</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Play className="w-6 h-6 mr-3 text-primary-600" />
                学習コンテンツ
              </h2>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{course.content}</ReactMarkdown>
              </div>
            </motion.div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* クイズセクション */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">演習問題</h3>
              
              {course.quiz.length === 0 ? (
                <p className="text-gray-600">このコースにはまだ演習問題がありません。</p>
              ) : (
                <div className="space-y-4">
                  {course.quiz.map((quiz, index) => (
                    <button
                      key={quiz.id}
                      onClick={() => setSelectedQuiz(index)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{quiz.title}</h4>
                      <p className="text-sm text-gray-600">{quiz.questions.length}問</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 学習の進捗 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">学習の進捗</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">コンテンツ</span>
                  <span className="text-success-600 font-semibold">完了</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">演習問題</span>
                  <span className="text-warning-600 font-semibold">未完了</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* クイズモーダル */}
        {selectedQuiz !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {!quizCompleted ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {course.quiz[selectedQuiz].title}
                    </h3>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">
                        問題 {currentQuestion + 1} / {course.quiz[selectedQuiz].questions.length}
                      </span>
                      <span className="text-primary-600 font-semibold">
                        スコア: {score}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {course.quiz[selectedQuiz].questions[currentQuestion].question}
                    </h4>

                    <div className="space-y-3">
                      {course.quiz[selectedQuiz].questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            selectedAnswer === option
                              ? option === course.quiz[selectedQuiz].questions[currentQuestion].correctAnswer
                                ? 'border-success-500 bg-success-50'
                                : 'border-error-500 bg-error-50'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {selectedAnswer === option ? (
                              option === course.quiz[selectedQuiz].questions[currentQuestion].correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-success-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-error-600" />
                              )
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                            <span className="text-gray-900">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-blue-900 mb-2">解説</h5>
                            <p className="text-blue-800">
                              {course.quiz[selectedQuiz].questions[currentQuestion].explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showExplanation && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleNextQuestion}
                          className="btn-primary"
                        >
                          {currentQuestion < course.quiz[selectedQuiz].questions.length - 1 ? '次の問題' : '結果を見る'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">クイズ完了！</h3>
                  <div className="text-6xl font-bold text-primary-600 mb-4">
                    {Math.round((score / course.quiz[selectedQuiz].questions.length) * 100)}%
                  </div>
                  <p className="text-gray-600 mb-6">
                    {score} / {course.quiz[selectedQuiz].questions.length} 問正解
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={resetQuiz}
                      className="btn-outline"
                    >
                      もう一度挑戦
                    </button>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="btn-primary"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 