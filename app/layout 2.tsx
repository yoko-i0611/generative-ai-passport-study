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
  metadataBase: new URL('https://ai-learning-platform.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI学習プラットフォーム - 生成AIと情報リテラシーを学ぶ',
    description: 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム。',
    url: 'https://ai-learning-platform.vercel.app',
    siteName: 'AI学習プラットフォーム',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI学習プラットフォーム',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI学習プラットフォーム - 生成AIと情報リテラシーを学ぶ',
    description: 'AI（人工知能）、生成AI、情報リテラシー、プロンプト制作を学ぶオンライン学習プラットフォーム。',
    images: ['/og-image.jpg'],
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased font-sans">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
} 