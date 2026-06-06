import Cookies from 'js-cookie';

/**
 * アクセストークンをリフレッシュする関数
 * @returns 新しいアクセストークン
 * @throws リフレッシュトークンがない場合やリフレッシュに失敗した場合にエラーをスロー
 */
export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = Cookies.get('refresh');
    if (!refreshToken) {
        alert('ログインが必要です');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken') || '',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('トークンのリフレッシュに失敗しました');
        }

        const data = await response.json();
        const newAccessToken = data['access'];

        // 新しいアクセスキーをクッキーに保存
        Cookies.set('access', newAccessToken, { expires: 1/24, path: '/' });

        return newAccessToken;
    } catch (error) {
        console.error('トークンのリフレッシュエラー:', error);
        throw error;
    }
};

/**
 * アクセストークンを取得する関数
 * @returns 現在のアクセストークン
 */
export const getAccessToken = (): string | undefined => {
    return Cookies.get('access');
};

/**
 * アクセストークンを削除する関数
 */
export const clearAccessToken = (): void => {
    console.log('アクセストークンを削除します');
    Cookies.remove('access');
};

/**
 * リフレッシュトークンを削除する関数
 */
export const clearRefreshToken = (): void => {
    console.log('リフレッシュトークンを削除します');
    Cookies.remove('refresh');
};