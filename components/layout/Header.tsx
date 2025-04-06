import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
            📺 연습문제 추가하기
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              홈
            </Link>
            <Link href="/teacher" className="text-gray-600 hover:text-gray-900">
              연습문제 만들기
            </Link>
            <Link href="/student" className="text-gray-600 hover:text-gray-900">
              연습문제 풀기
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
