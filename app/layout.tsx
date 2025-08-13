import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI学習プラットフォーム - 生成AIと情報リテラシーを学ぶ',
  description: 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム。5つの章で構成された包括的なカリキュラムで、基礎から上級まで段階的に学習できます。',
  keywords: ['AI', '人工知能', '生成AI', 'ジェネレーティブAI', '情報リテラシー', 'プロンプト制作', 'オンライン学習', '教育'],
  authors: [{ name: 'AI Learning Platform' }],
  creator: 'AI Learning Platform',
  publisher: 'AI Learning Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://generative-ai-passport-study.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI学習プラットフォーム - 生成AIと情報リテラシーを学ぶ',
    description: 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム。',
    url: 'https://generative-ai-passport-study.vercel.app',
    siteName: 'AI学習プラットフォーム',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'AI学習プラットフォーム - トップページ',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI学習プラットフォーム - 生成AIと情報リテラシーを学ぶ',
    description: 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム。',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 