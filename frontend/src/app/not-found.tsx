import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container mx-auto p-4 text-white text-center">
      <h2 className="text-4xl font-bold mb-4">404 Not Found</h2>
      <p className="mb-4">申し訳ありませんが、お探しのページは見つかりませんでした。</p>
      <Link href="/" className="text-blue-300 hover:underline">
        トップページに戻る
      </Link>
    </main>
  )
}
