import { refreshAccessToken, getAccessToken, clearAccessToken, clearRefreshToken } from '@/utils/auth';

/**
 * 認証付きでAPIリクエストを行う関数
 * @param url リクエストを送信するURL
 * @returns APIからのレスポンスデータ
 * @throws リクエストが失敗した場合にエラーをスロー
 */
export const fetchWithAuth = async (url: string, method: string, body_data?: any): Promise<any> => {
    try {
        let accessToken = getAccessToken();

        let fetchData: any = {
          method: method,
          headers: {
              'Authorization': 'Bearer ' + accessToken,
          },
          body: body_data instanceof FormData ? body_data : JSON.stringify(body_data),
        };

        if (!(body_data instanceof FormData)) {
          fetchData.headers['Content-Type'] = 'application/json';
        }

        let response: any = await fetch(url, fetchData);

        // アクセストークンが無効な場合
        if (response.status === 401) {
            // アクセストークンをリフレッシュして再度リクエスト
            await refreshAccessToken();
            return await fetchWithAuth(url, method, body_data);
        }

        if (!response.ok) {
            const error = new Error('データの取得に失敗しました');
            (error as any).status = response.status;
            throw error;
        }

        const text = await response.text();
        if (!text) return null;
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error('エラー:', error);
        throw error;
    }
};

type CacheEntry = {
  expiresAt: number;
  data: any;
};

const CACHE_TTL_MS = 2 * 60 * 1000;

const readCache = (key: string): any | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry;
    if (!entry || entry.expiresAt < Date.now()) {
      sessionStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
};

const writeCache = (key: string, data: any) => {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      data,
    };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore storage quota/private mode failures.
  }
};

export const fetchJsonCached = async (url: string, init?: RequestInit) => {
  const cacheKey = `json-cache:${url}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("JSONではないレスポンスが返されました");
  }

  const data = await response.json();
  writeCache(cacheKey, data);
  return data;
};
