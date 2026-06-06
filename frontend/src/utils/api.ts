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
            // アクセストークンをリフレッシュ
            accessToken = await refreshAccessToken();

            // 再度リクエスト
            response = await fetchWithAuth(url, method, body_data);
        }

        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('エラー:', error);
        throw error;
    }
};