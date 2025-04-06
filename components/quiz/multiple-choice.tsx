"use client"

import { useState } from 'react';

interface MultipleChoiceQuizProps {
  question: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  onCorrectAnswer: () => void;
}

export default function MultipleChoiceQuiz({
  question,
  options,
  correctAnswer,
  hint,
  onCorrectAnswer
}: MultipleChoiceQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (isCompleted) return;
    setSelectedOption(option);
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === correctAnswer;
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
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          객관식
        </span>
      </div>
      
      <h3 className={`text-lg font-medium mb-4 ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
        {question}
      </h3>
      
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-md cursor-pointer border ${
              isCompleted
                ? option === correctAnswer
                  ? 'bg-green-100 border-green-300'
                  : 'bg-gray-50 border-gray-200'
                : selectedOption === option
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border ${
                isCompleted
                  ? option === correctAnswer
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                  : selectedOption === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              } mr-3 flex items-center justify-center`}>
                {(isCompleted && option === correctAnswer) || selectedOption === option ? (
                  <span className="text-white text-xs">✓</span>
                ) : null}
              </div>
              <span className={`${
                isCompleted && option === correctAnswer ? 'font-medium' : ''
              }`}>
                {option}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {showFeedback && (
        <div className={`p-3 rounded-md mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? '정답입니다!' : '다시 생각해보세요.'}
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
            disabled={!selectedOption}
            className={`${
              !selectedOption 
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
