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

/**
 * メールアドレスで購入状態を復元する
 */
export async function restorePurchaseByEmail(email: string): Promise<{
  success: boolean;
  message?: string;
}> {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Client-side only function' };
  }

  try {
    const response = await fetch('/api/restore-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.success && data.purchased) {
      // 購入状態をクライアント側に保存
      const status: PurchaseStatus = {
        purchased: true,
        purchasedAt: data.purchasedAt,
        sessionId: data.sessionId,
      };
      localStorage.setItem(PURCHASE_KEY, JSON.stringify(status));
      return { success: true };
    }

    return {
      success: false,
      message: data.message || '購入履歴が見つかりませんでした。',
    };
  } catch (error) {
    console.error('Error restoring purchase:', error);
    return {
      success: false,
      message: '購入状態の復元に失敗しました。もう一度お試しください。',
    };
  }
}

/**
 * メールアドレスで購入状態を確認する
 */
export async function verifyPurchaseByEmail(email: string): Promise<{
  purchased: boolean;
  purchasedAt?: number;
  sessionId?: string;
}> {
  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.purchased) {
      return {
        purchased: true,
        purchasedAt: data.purchasedAt,
        sessionId: data.sessionId,
      };
    }

    return { purchased: false };
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return { purchased: false };
  }
}

