"use client"

import { useState } from 'react';

interface OpenEndedQuestionProps {
  question: string;
  onSubmit: (answer: string) => void;
}

export default function OpenEndedQuestion({ question, onSubmit }: OpenEndedQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    onSubmit(answer);
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-md mb-4">
      <div className="mb-4">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          서술형 질문
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {question}
      </h3>
      
      <div className="mb-4">
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          disabled={isSubmitted}
          rows={5}
          placeholder="답변을 입력하세요"
          className={`w-full px-3 py-2 border ${
            isSubmitted 
              ? 'bg-gray-100 border-gray-300' 
              : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } rounded-md`}
        />
      </div>
      
      {isSubmitted ? (
        <div className="p-3 bg-green-100 text-green-800 rounded-md">
          답변이 제출되었습니다. 감사합니다!
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className={`${
            !answer.trim() 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white font-medium py-2 px-4 rounded-md transition-colors`}
        >
          제출하기
        </button>
      )}
    </div>
  );
}
