/**
 * Vercel KVのラッパー
 * ローカル開発環境では、localStorageまたはファイルベースのストレージにフォールバック
 * 
 * 環境変数の対応:
 * - KV_REST_API_URL / KV_REST_API_TOKEN (標準的なプレフィックス)
 * - STORAGE_REST_API_URL / STORAGE_REST_API_TOKEN (カスタムプレフィックス)
 */

// ローカル開発用の簡易ストレージ（メモリ内）
const localStorage: Map<string, any> = new Map();

// TTL管理用
const ttlStorage: Map<string, number> = new Map();

/**
 * Vercel KVクライアントを取得
 * 環境変数 KV_* または STORAGE_* から自動的に検出
 */
async function getKvClient() {
  if (typeof process === 'undefined') {
    return null;
  }

  // 環境変数を取得（KV_* を優先、なければ STORAGE_* を使用）
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL || process.env.STORAGE_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const { createClient } = await import('@vercel/kv');
    return createClient({
      url,
      token,
    });
  } catch (error) {
    console.warn('Failed to create Vercel KV client:', error);
    return null;
  }
}

/**
 * KVクライアントが利用可能かチェック
 */
function isKvAvailable(): boolean {
  if (typeof process === 'undefined') {
    return false;
  }
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL || process.env.STORAGE_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;
  return !!(url && token);
}

export async function set(key: string, value: any, options?: { ex?: number }): Promise<void> {
  if (isKvAvailable()) {
    // 本番環境またはKVが設定されている場合
    try {
      const kv = await getKvClient();
      if (kv) {
        if (options?.ex) {
          await kv.set(key, value, { ex: options.ex });
        } else {
          await kv.set(key, value);
        }
        return;
      }
    } catch (error) {
      console.warn('Failed to use Vercel KV, falling back to local storage:', error);
    }
  }

  // ローカル開発環境用のフォールバック
  localStorage.set(key, value);
  if (options?.ex) {
    const expiresAt = Date.now() + options.ex * 1000;
    ttlStorage.set(key, expiresAt);
    
    // TTLをチェックするためのタイマーを設定
    setTimeout(() => {
      const expiration = ttlStorage.get(key);
      if (expiration && Date.now() >= expiration) {
        localStorage.delete(key);
        ttlStorage.delete(key);
      }
    }, options.ex * 1000);
  }
}

export async function get<T = any>(key: string): Promise<T | null> {
  if (isKvAvailable()) {
    // 本番環境またはKVが設定されている場合
    try {
      const kv = await getKvClient();
      if (kv) {
        return await kv.get<T>(key);
      }
    } catch (error) {
      console.warn('Failed to use Vercel KV, falling back to local storage:', error);
    }
  }

  // ローカル開発環境用のフォールバック
  const expiration = ttlStorage.get(key);
  if (expiration && Date.now() >= expiration) {
    localStorage.delete(key);
    ttlStorage.delete(key);
    return null;
  }

  return (localStorage.get(key) as T) || null;
}

export async function del(key: string): Promise<void> {
  if (isKvAvailable()) {
    // 本番環境またはKVが設定されている場合
    try {
      const kv = await getKvClient();
      if (kv) {
        await kv.del(key);
        return;
      }
    } catch (error) {
      console.warn('Failed to use Vercel KV, falling back to local storage:', error);
    }
  }

  // ローカル開発環境用のフォールバック
  localStorage.delete(key);
  ttlStorage.delete(key);
}

export async function expire(key: string, seconds: number): Promise<void> {
  if (isKvAvailable()) {
    // 本番環境またはKVが設定されている場合
    try {
      const kv = await getKvClient();
      if (kv) {
        await kv.expire(key, seconds);
        return;
      }
    } catch (error) {
      console.warn('Failed to use Vercel KV, falling back to local storage:', error);
    }
  }

  // ローカル開発環境用のフォールバック
  const expiresAt = Date.now() + seconds * 1000;
  ttlStorage.set(key, expiresAt);
}

