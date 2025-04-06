"use client"

import { useState } from 'react';
import { formatTime } from '@/lib/youtube-utils';

export interface QuizItem {
  id: string;
  timestamp: number;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

interface QuizListProps {
  quizzes: QuizItem[];
  onRemoveQuiz: (id: string) => void;
  onEditQuiz: (id: string) => void;
}

export default function QuizList({ quizzes, onRemoveQuiz, onEditQuiz }: QuizListProps) {
  if (quizzes.length === 0) {
    return (
      <div className="text-gray-500 italic">아직 추가된 퀴즈가 없습니다.</div>
    );
  }

  // 타임스탬프 순으로 정렬
  const sortedQuizzes = [...quizzes].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-4">
      {sortedQuizzes.map((quiz) => (
        <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {formatTime(quiz.timestamp)}
              </span>
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {quiz.type === 'multiple-choice' ? '객관식' : '주관식'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditQuiz(quiz.id)}
                className="text-gray-600 hover:text-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => onRemoveQuiz(quiz.id)}
                className="text-gray-600 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">{quiz.question}</h3>
          
          {quiz.type === 'multiple-choice' && quiz.options && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-1">선택지:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                {quiz.options.map((option, index) => (
                  <li key={index} className={option === quiz.correctAnswer ? 'font-semibold' : ''}>
                    {option} {option === quiz.correctAnswer && '(정답)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {quiz.type === 'short-answer' && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">정답: <span className="font-semibold">{quiz.correctAnswer}</span></p>
            </div>
          )}
          
          {quiz.hint && (
            <div className="text-sm text-gray-600">
              <p>힌트: {quiz.hint}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
