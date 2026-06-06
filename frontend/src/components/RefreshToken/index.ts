import Cookies from 'js-cookie';

export default function RefreshToken() {
  const refreshAccessToken = async () => {
    const refreshApiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/jwt/refresh';
    const refreshToken = Cookies.get('refresh') || '';
    const response = await fetch(refreshApiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('リフレッシュトークンの更新に失敗しました');
    }

    const data = await response.json();
    console.log(data);
    Cookies.set('access', data['access'], { expires: 1 / 24, path: '/' });
    Cookies.set('refresh', data['refresh'], { expires: 7, path: '/' });
    return data['access'];
  };
}