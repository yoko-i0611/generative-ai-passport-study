/**
 * 購入状態管理ユーティリティ
 */

const PURCHASE_KEY = 'platform_purchase_status';

export interface PurchaseStatus {
  purchased: boolean;
  purchasedAt?: number;
  sessionId?: string;
}

/**
 * 購入状態を取得
 */
export function getPurchaseStatus(): PurchaseStatus {
  if (typeof window === 'undefined') {
    return { purchased: false };
  }

  try {
    const stored = localStorage.getItem(PURCHASE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading purchase status:', error);
  }

  return { purchased: false };
}

/**
 * 購入状態を保存
 */
export function setPurchaseStatus(sessionId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const status: PurchaseStatus = {
      purchased: true,
      purchasedAt: Date.now(),
      sessionId,
    };
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving purchase status:', error);
  }
}

/**
 * 購入済みかどうかをチェック
 */
export function isPurchased(): boolean {
  return getPurchaseStatus().purchased;
}

/**
 * 購入状態をリセット（開発・テスト用）
 */
export function resetPurchaseStatus(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(PURCHASE_KEY);
  } catch (error) {
    console.error('Error resetting purchase status:', error);
  }
}

