import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ページが見つかりません</h2>
        <Link href="/" className="text-blue-600 hover:underline">TOPに戻る</Link>
      </div>
    </div>
  )
}

