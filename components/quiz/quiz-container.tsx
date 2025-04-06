"use client"

import { useState } from 'react';
import MultipleChoiceQuiz from './multiple-choice';
import ShortAnswerQuiz from './short-answer';
import OpenEndedQuestion from './open-ended';

export interface Quiz {
  id: string;
  timestamp: number;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
  completed: boolean;
}

interface QuizContainerProps {
  quizzes: Quiz[];
  currentTimestamp: number | null;
  showFinalQuestion: boolean;
  finalQuestion?: string;
  onQuizCompleted: (quizId: string) => void;
  onContinueVideo: () => void;
}

export default function QuizContainer({
  quizzes,
  currentTimestamp,
  showFinalQuestion,
  finalQuestion,
  onQuizCompleted,
  onContinueVideo
}: QuizContainerProps) {
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  // 현재 타임스탬프에 해당하는 퀴즈 찾기
  const currentQuiz = currentTimestamp 
    ? quizzes.find(quiz => Math.abs(quiz.timestamp - currentTimestamp) < 0.5 && !quiz.completed)
    : null;

  // 완료된 퀴즈들
  const completedQuizzes = quizzes.filter(quiz => quiz.completed);

  const handleQuizCompleted = (quizId: string) => {
    setSubmittedAnswers(prev => ({ ...prev, [quizId]: true }));
    onQuizCompleted(quizId);
    
    // 정답 확인 후 1.5초 후에 동영상 계속 재생
    setTimeout(() => {
      onContinueVideo();
    }, 1500);
  };

  const handleFinalQuestionSubmit = (answer: string) => {
    console.log('서술형 답변:', answer);
    // 서술형 답변은 저장만 하고 별도의 채점은 하지 않음
  };

  return (
    <div className="space-y-6">
      {/* 현재 타임스탬프의 퀴즈 */}
      {currentQuiz && (
        <div>
          {currentQuiz.type === 'multiple-choice' && currentQuiz.options && (
            <MultipleChoiceQuiz
              question={currentQuiz.question}
              options={currentQuiz.options}
              correctAnswer={currentQuiz.correctAnswer}
              hint={currentQuiz.hint}
              onCorrectAnswer={() => handleQuizCompleted(currentQuiz.id)}
            />
          )}
          
          {currentQuiz.type === 'short-answer' && (
            <ShortAnswerQuiz
              question={currentQuiz.question}
              correctAnswer={currentQuiz.correctAnswer}
              hint={currentQuiz.hint}
              onCorrectAnswer={() => handleQuizCompleted(currentQuiz.id)}
            />
          )}
        </div>
      )}
      
      {/* 완료된 퀴즈들 (역순으로 표시) */}
      {completedQuizzes.slice().reverse().map(quiz => (
        <div key={quiz.id} className="bg-gray-100 p-6 rounded-lg border border-gray-300">
          <div className="mb-4">
            <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              타임스탬프: {Math.floor(quiz.timestamp / 60)}:{(quiz.timestamp % 60).toString().padStart(2, '0')}
            </span>
            <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {quiz.type === 'multiple-choice' ? '객관식' : '주관식'}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-500 mb-4">
            {quiz.question}
          </h3>
          
          <div className="text-green-600 font-medium">
            정답: {quiz.correctAnswer}
          </div>
        </div>
      ))}
      
      {/* 동영상 종료 후 서술형 질문 */}
      {showFinalQuestion && finalQuestion && (
        <OpenEndedQuestion
          question={finalQuestion}
          onSubmit={handleFinalQuestionSubmit}
        />
      )}
    </div>
  );
}
