'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { courses } from '@/data/courses';
import { 
  BookOpen, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

export default function HomePage() {
  const getColorGradient = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-primary-500 to-transparent';
      case 'secondary':
        return 'from-secondary-500 to-transparent';
      case 'accent':
        return 'from-accent-500 to-transparent';
      case 'info':
        return 'from-info-500 to-transparent';
      case 'yellow':
        return 'from-yellow-500 to-transparent';
      default:
        return 'from-primary-500 to-transparent';
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'badge-primary';
      case 'secondary':
        return 'badge-secondary';
      case 'accent':
        return 'badge-accent';
      case 'info':
        return 'badge-info';
      case 'yellow':
        return 'badge-yellow';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">生成AIパスポート試験対策</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#courses" className="text-gray-700 hover:text-primary-600 transition-colors">
                コース
              </Link>
              <Link href="/quiz" className="text-gray-700 hover:text-primary-600 transition-colors">
                問題演習
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
                利用方法
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="#contact" className="btn-primary">
                質問する
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient">生成AIパスポート</span>
                <br />
                試験対策プラットフォーム
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                生成AIパスポート試験に合格するための包括的な学習プラットフォームです。
                5つの章で構成されたカリキュラムで、基礎から実践まで段階的に学習できます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses/chapter1" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  学習を始める
                </Link>
                <Link href="/quiz" className="btn-outline text-lg px-8 py-4 flex items-center justify-center">
                  問題演習に挑戦
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  無料で利用可能
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-primary-500 mr-2" />
                  いつでも学習可能
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-warning-500 mr-2" />
                  試験対策に最適
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="mt-6 flex space-x-2">
                    <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                      生成AI基礎
                    </div>
                    <div className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm">
                      プロンプト
                    </div>
                    <div className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm">
                      実践
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 利用方法セクション */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              プラットフォームの利用方法
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              簡単なステップで生成AIパスポート試験対策を始め、合格を目指しましょう。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. コースを選択
              </h3>
              <p className="text-gray-600">
                興味のあるコースを選び、学習を開始します。生成AIの基礎からプロンプト制作まで、幅広く学べます。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. 問題演習で復習
              </h3>
              <p className="text-gray-600">
                各章の学習が終わったら、問題演習に挑戦して理解度を確認しましょう。間違えた問題は解説で復習できます。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                3. AIチャットで質問
              </h3>
              <p className="text-gray-600">
                学習中に分からないことがあれば、AIチャットボットに質問できます。24時間いつでもあなたの学習をサポートします。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* コースセクション */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              学習コース
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              体系的に構成された5つの章で、AIリテラシーと生成AIのスキルを習得しましょう。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card overflow-hidden group border-2 border-transparent hover:border-${course.color}-500 transition-all duration-300`}
              >
                <Link href={course.link} className="block">
                  <div className="relative h-48">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getColorGradient(course.color)} opacity-20`}></div>
                    <div className="p-6 relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className={`badge ${getBadgeClass(course.color)} mb-2`}>
                          {course.difficulty}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-4">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 mb-4 h-24 overflow-hidden">
                      {course.description}
                    </p>
                    <span className={`font-semibold text-${course.color}-600 group-hover:underline flex items-center`}>
                      詳細を見る
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer id="contact" className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h2 className="text-3xl font-bold text-white mb-4">
                お問い合わせ
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                ご質問やご相談がありましたら、お気軽にお問い合わせください。
              </p>
              <a href="mailto:support@example.com" className="btn-primary text-lg px-8 py-4">
                メールで問い合わせる
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 