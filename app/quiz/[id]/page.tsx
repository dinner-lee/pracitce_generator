"use client"

import { useState, useEffect } from 'react';
import { use } from 'react';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/video-player/VideoPlayer';
import QuizContainer, { Quiz } from '@/components/quiz/quiz-container';
import { formatTime } from '@/lib/youtube-utils';

export default function QuizPlayerPage({ params }: { params: { id: string } }) {
  const quizId = params.id;
  
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [finalQuestion, setFinalQuestion] = useState<string>('');
  
  // 퀴즈 데이터 로드
  useEffect(() => {
    try {
      // 로컬 스토리지에서 퀴즈 데이터 로드
      const savedQuizzes = JSON.parse(localStorage.getItem('youtube-quizzes') || '[]');
      const quiz = savedQuizzes.find((q: any) => q.id === quizId);
      
      if (quiz) {
        setQuizData(quiz);
        
        // 퀴즈 데이터 형식 변환
        const formattedQuizzes = quiz.quizzes.map((q: any) => ({
          ...q,
          completed: false
        }));
        
        setQuizzes(formattedQuizzes);
        setFinalQuestion(quiz.finalQuestion || '이 동영상에서 배운 내용을 요약하고, 어떤 부분이 가장 유익했는지 설명해주세요.');
      } else {
        setError('해당 ID의 퀴즈를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('퀴즈 데이터를 불러오는 중 오류가 발생했습니다:', err);
      setError('퀴즈 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [unwrappedParams.id]);
  
  // 타임스탬프 도달 시 호출되는 함수
  const handleTimestampReached = (timestamp: number) => {
    setCurrentTimestamp(timestamp);
  };
  
  // 퀴즈 완료 시 호출되는 함수
  const handleQuizCompleted = (quizId: string) => {
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, completed: true } : quiz
      )
    );
  };
  
  // 동영상 계속 재생
  const handleContinueVideo = () => {
    setCurrentTimestamp(null); // 이 상태 변경만으로 충분합니다
  };

  // 동영상 종료 시 호출되는 함수
  const handleVideoEnded = () => {
    setVideoEnded(true);
  };
  
  // 타임스탬프 배열 추출
  const timestamps = quizzes.map(quiz => quiz.timestamp);
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">퀴즈 플레이어</h1>
        
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-gray-600">퀴즈 데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              {quizData && (
                <>
                  <VideoPlayer 
                    videoId={quizData.videoId} 
                    timestamps={timestamps} 
                    currentTimestamp={currentTimestamp} // 추가
                    onTimestampReached={handleTimestampReached}
                    onVideoEnded={handleVideoEnded}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <h2 className="text-xl font-semibold text-gray-900">{quizData.title}</h2>
                    <div className="text-sm text-gray-500">퀴즈 ID: {unwrappedParams.id}</div>
                  </div>
                </>
              )}
            </div>
            
            <QuizContainer
              quizzes={quizzes}
              currentTimestamp={currentTimestamp}
              showFinalQuestion={videoEnded}
              finalQuestion={finalQuestion}
              onQuizCompleted={handleQuizCompleted}
              onContinueVideo={handleContinueVideo}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
