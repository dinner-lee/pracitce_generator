import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">YouTube 퀴즈 애플리케이션</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          YouTube 동영상에 연습 문제를 추가하여 학습 효과를 높이세요.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">연습문제 만들기</h2>
            <p className="text-gray-600 mb-6">
              연습 문제와 함께 비동기적 온라인 수업의 효과를 높여 보세요.😀
            </p>
            <Link 
              href="/teacher" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              시작하기
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">연습문제 풀기</h2>
            <p className="text-gray-600 mb-6">
              영상을 시청하며 문제를 풀어 볼까요?👍
            </p>
            <Link 
              href="/student" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
