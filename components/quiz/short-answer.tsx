"use client"

import { useState } from 'react';

interface ShortAnswerQuizProps {
  question: string;
  correctAnswer: string;
  hint?: string;
  onCorrectAnswer: () => void;
}

export default function ShortAnswerQuiz({
  question,
  correctAnswer,
  hint,
  onCorrectAnswer
}: ShortAnswerQuizProps) {
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;
    setAnswer(e.target.value);
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    if (!answer.trim()) return;
    
    // 정답 확인 (대소문자 구분 없이, 공백 제거)
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswerNormalized = correctAnswer.trim().toLowerCase();
    
    // 정확히 일치하거나, 정답이 사용자 답변에 포함되어 있으면 정답으로 처리
    const correct = userAnswer === correctAnswerNormalized || 
                   correctAnswerNormalized.includes(userAnswer) || 
                   userAnswer.includes(correctAnswerNormalized);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setIsCompleted(true);
      // 정답일 경우 콜백 함수 호출
      onCorrectAnswer();
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className={`p-6 rounded-lg ${isCompleted ? 'bg-gray-100' : 'bg-white'} shadow-md mb-4`}>
      <div className="mb-4">
        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          주관식
        </span>
      </div>
      
      <h3 className={`text-lg font-medium mb-4 ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
        {question}
      </h3>
      
      <div className="mb-4">
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          disabled={isCompleted}
          placeholder="답변을 입력하세요"
          className={`w-full px-3 py-2 border ${
            isCompleted 
              ? 'bg-gray-100 border-gray-300' 
              : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } rounded-md`}
        />
      </div>
      
      {showFeedback && (
        <div className={`p-3 rounded-md mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? (
            <>정답입니다! 정확한 답변: <strong>{correctAnswer}</strong></>
          ) : (
            '다시 생각해보세요.'
          )}
        </div>
      )}
      
      {showHint && hint && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
          <strong>힌트:</strong> {hint}
        </div>
      )}
      
      {!isCompleted && (
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={!answer.trim()}
            className={`${
              !answer.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium py-2 px-4 rounded-md transition-colors`}
          >
            정답 확인
          </button>
          {hint && (
            <button
              type="button"
              onClick={toggleHint}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              {showHint ? '힌트 숨기기' : '힌트 보기'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
