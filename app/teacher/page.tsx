"use client"

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoInput from '@/components/teacher/video-input';
import QuizForm from '@/components/teacher/quiz-form';
import QuizList, { QuizItem } from '@/components/teacher/quiz-list';
import { parseTime } from '@/lib/youtube-utils';

export default function TeacherPage() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [finalQuestion, setFinalQuestion] = useState<string>('');
  const [quizId, setQuizId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 동영상 설정 처리
  const handleVideoSubmit = (videoId: string, title: string) => {
    setVideoId(videoId);
    setQuizTitle(title);
  };

  // 퀴즈 추가 처리
  const handleAddQuiz = (formData: any) => {
    const timestamp = parseTime(formData.timestamp);
    if (!timestamp) return;

    const newQuiz: QuizItem = {
      id: Date.now().toString(),
      timestamp,
      type: formData.type,
      question: formData.question,
      correctAnswer: formData.correctAnswer,
      options: formData.type === 'multiple-choice' ? formData.options : undefined,
      hint: formData.hint || undefined
    };

    setQuizzes(prev => [...prev, newQuiz]);
  };

  // 퀴즈 삭제 처리
  const handleRemoveQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  // 퀴즈 수정 처리 (현재 버전에서는 삭제 후 다시 추가하는 방식)
  const handleEditQuiz = (id: string) => {
    // 실제 구현에서는 수정 폼을 표시하고 기존 데이터를 채워넣는 로직 필요
    alert('현재 버전에서는 수정 기능이 지원되지 않습니다. 삭제 후 다시 추가해주세요.');
  };

  // 서술형 질문 변경 처리
  const handleFinalQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFinalQuestion(e.target.value);
  };

  // 퀴즈 저장 처리
  const handleSaveQuiz = () => {
    if (!videoId || !quizTitle || quizzes.length === 0) {
      alert('동영상 URL, 퀴즈 제목, 그리고 최소 1개 이상의 퀴즈가 필요합니다.');
      return;
    }

    // 실제 구현에서는 서버에 저장하는 로직 필요
    // 현재는 로컬 스토리지에 저장하는 방식으로 구현
    const quizData = {
      id: Date.now().toString(),
      videoId,
      title: quizTitle,
      quizzes,
      finalQuestion
    };

    // 로컬 스토리지에 저장
    const savedQuizzes = JSON.parse(localStorage.getItem('youtube-quizzes') || '[]');
    savedQuizzes.push(quizData);
    localStorage.setItem('youtube-quizzes', JSON.stringify(savedQuizzes));

    // 퀴즈 ID 설정 및 성공 메시지 표시
    setQuizId(quizData.id);
    setShowSuccess(true);

    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">교사 모드</h1>
        
        {!videoId ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">YouTube 동영상 설정</h2>
            <VideoInput onVideoSubmit={handleVideoSubmit} />
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">YouTube 동영상 설정</h2>
                <button
                  onClick={() => setVideoId(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  변경
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                    alt="동영상 썸네일" 
                    className="max-w-full max-h-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{quizTitle}</h3>
                  <p className="text-sm text-gray-500">Video ID: {videoId}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">퀴즈 추가</h2>
              <p className="text-gray-600 mb-4">
                동영상의 특정 타임스탬프에 표시될 퀴즈를 추가하세요.
              </p>
              
              <QuizForm onAddQuiz={handleAddQuiz} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">추가된 퀴즈 목록</h2>
              <QuizList 
                quizzes={quizzes} 
                onRemoveQuiz={handleRemoveQuiz} 
                onEditQuiz={handleEditQuiz} 
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">동영상 종료 후 서술형 질문</h2>
              <p className="text-gray-600 mb-4">
                동영상이 끝난 후 표시될 서술형 질문을 입력하세요. (선택사항)
              </p>
              
              <textarea
                value={finalQuestion}
                onChange={handleFinalQuestionChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="서술형 질문을 입력하세요"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleSaveQuiz}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  퀴즈 저장하기
                </button>
                
                <div className="text-sm text-gray-500">
                  총 {quizzes.length}개의 퀴즈
                </div>
              </div>
              
              {showSuccess && quizId && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                  <p>퀴즈가 성공적으로 저장되었습니다!</p>
                  <p className="font-medium">퀴즈 ID: {quizId}</p>
                  <p className="text-sm">이 ID를 학생들에게 공유하여 퀴즈를 시작하게 할 수 있습니다.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
