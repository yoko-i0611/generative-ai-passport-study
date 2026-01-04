'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isPurchased } from '../utils/purchase';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

interface PurchaseGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * 購入ガードコンポーネント
 * 未購入の場合は購入ページへのリダイレクトまたはメッセージを表示
 */
export default function PurchaseGuard({ 
  children, 
  redirectTo = '/purchase' 
}: PurchaseGuardProps) {
  const [purchased, setPurchased] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkPurchase = () => {
      const purchasedStatus = isPurchased();
      setPurchased(purchasedStatus);
      
      if (!purchasedStatus) {
        // クライアント側でリダイレクト
        router.push(redirectTo);
      }
    };

    checkPurchase();
  }, [router, redirectTo]);

  // チェック中は何も表示しない（またはローディングを表示）
  if (purchased === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 購入済みの場合のみ子コンポーネントを表示
  if (purchased) {
    return <>{children}</>;
  }

  // 未購入の場合は購入ページへのメッセージ（通常はリダイレクトされるためここには到達しない）
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-warning-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          購入が必要です
        </h2>
        <p className="text-gray-600 mb-6">
          このコンテンツにアクセスするには、プラットフォームの購入が必要です。
        </p>
        <Link href={redirectTo} className="btn-primary inline-flex items-center">
          購入ページへ
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}

