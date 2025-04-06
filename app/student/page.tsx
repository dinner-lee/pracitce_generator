"use client"

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface SavedQuiz {
  id: string;
  videoId: string;
  title: string;
  quizzes: any[];
  finalQuestion?: string;
}

export default function StudentPage() {
  const [quizId, setQuizId] = useState('');
  const [error, setError] = useState('');
  const [recentQuizzes, setRecentQuizzes] = useState<SavedQuiz[]>([]);
  const router = useRouter();

  // 저장된 퀴즈 목록 불러오기
  useEffect(() => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('youtube-quizzes') || '[]');
      setRecentQuizzes(savedQuizzes.slice(-5).reverse()); // 최근 5개만 표시
    } catch (err) {
      console.error('퀴즈 데이터를 불러오는 중 오류가 발생했습니다:', err);
    }
  }, []);

  const handleQuizIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizId(e.target.value);
    setError('');
  };

  const handleStartQuiz = () => {
    if (!quizId.trim()) {
      setError('퀴즈 ID를 입력해주세요.');
      return;
    }

    // 로컬 스토리지에서 해당 ID의 퀴즈 확인
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('youtube-quizzes') || '[]');
      const quiz = savedQuizzes.find((q: SavedQuiz) => q.id === quizId);

      if (!quiz) {
        setError('해당 ID의 퀴즈를 찾을 수 없습니다.');
        return;
      }

      // 퀴즈 페이지로 이동
      router.push(`/quiz/${quizId}`);
    } catch (err) {
      console.error('퀴즈 데이터를 확인하는 중 오류가 발생했습니다:', err);
      setError('퀴즈 데이터를 확인하는 중 오류가 발생했습니다.');
    }
  };

  const handleRecentQuizClick = (id: string) => {
    setQuizId(id);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">학생 모드</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">퀴즈 시작하기</h2>
          <p className="text-gray-600 mb-4">
            교사가 제공한 퀴즈 ID를 입력하여 학습을 시작하세요.
          </p>
          
          <div className="mb-4">
            <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 mb-1">
              퀴즈 ID
            </label>
            <input
              type="text"
              id="quizId"
              value={quizId}
              onChange={handleQuizIdChange}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="퀴즈 ID를 입력하세요"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <button
            type="button"
            onClick={handleStartQuiz}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            퀴즈 시작하기
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 생성된 퀴즈</h2>
          
          {recentQuizzes.length === 0 ? (
            <p className="text-gray-500 italic">아직 생성된 퀴즈가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRecentQuizClick(quiz.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <span className="text-xs text-gray-500">ID: {quiz.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">퀴즈 {quiz.quizzes.length}개</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
