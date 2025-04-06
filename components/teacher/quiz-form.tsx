"use client"

import { useState } from 'react';

interface QuizFormData {
  timestamp: string;
  type: 'multiple-choice' | 'short-answer';
  question: string;
  correctAnswer: string;
  options: string[];
  hint: string;
}

interface QuizFormProps {
  onAddQuiz: (quizData: QuizFormData) => void;
}

export default function QuizForm({ onAddQuiz }: QuizFormProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    timestamp: '',
    type: 'multiple-choice',
    question: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    hint: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 시 해당 필드의 오류 메시지 제거
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
    
    // 입력 시 options 필드의 오류 메시지 제거
    if (errors.options) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.options;
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 타임스탬프 검증
    if (!formData.timestamp.trim()) {
      newErrors.timestamp = '타임스탬프를 입력해주세요.';
    } else if (!parseTime(formData.timestamp)) {
      newErrors.timestamp = '유효한 타임스탬프 형식(mm:ss)을 입력해주세요.';
    }
    
    // 질문 검증
    if (!formData.question.trim()) {
      newErrors.question = '질문을 입력해주세요.';
    }
    
    // 정답 검증
    if (!formData.correctAnswer.trim()) {
      newErrors.correctAnswer = '정답을 입력해주세요.';
    }
    
    // 객관식인 경우 선택지 검증
    if (formData.type === 'multiple-choice') {
      if (formData.options.some(option => !option.trim())) {
        newErrors.options = '모든 선택지를 입력해주세요.';
      }
      
      // 정답이 선택지 중에 있는지 확인
      if (!formData.options.includes(formData.correctAnswer)) {
        newErrors.correctAnswer = '정답은 선택지 중 하나여야 합니다.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddQuiz(formData);
      
      // 폼 초기화
      setFormData({
        timestamp: '',
        type: 'multiple-choice',
        question: '',
        correctAnswer: '',
        options: ['', '', '', ''],
        hint: ''
      });
    }
  };

  // 타임스탬프 문자열(mm:ss)을 초 단위로 변환
  function parseTime(timeStr: string): number | null {
    const regExp = /^(\d+):(\d{2})$/;
    const match = timeStr.match(regExp);
    
    if (!match) return null;
    
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    
    if (seconds >= 60) return null;
    
    return minutes * 60 + seconds;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
          타임스탬프 (mm:ss) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="timestamp"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleInputChange}
          placeholder="03:45"
          className={`w-full px-3 py-2 border ${errors.timestamp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.timestamp && <p className="mt-1 text-sm text-red-600">{errors.timestamp}</p>}
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          퀴즈 유형 <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="multiple-choice">객관식 (4지선다)</option>
          <option value="short-answer">주관식</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          질문 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question"
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-3 py-2 border ${errors.question ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="질문을 입력하세요"
        />
        {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
      </div>
      
      {formData.type === 'multiple-choice' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            선택지 <span className="text-red-500">*</span>
          </label>
          {formData.options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`선택지 ${index + 1}`}
                className={`w-full px-3 py-2 border ${errors.options ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          ))}
          {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}
        </div>
      )}
      
      <div>
        <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
          정답 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="correctAnswer"
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.correctAnswer ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="정답을 입력하세요"
        />
        {errors.correctAnswer && <p className="mt-1 text-sm text-red-600">{errors.correctAnswer}</p>}
      </div>
      
      <div>
        <label htmlFor="hint" className="block text-sm font-medium text-gray-700 mb-1">
          힌트 (선택사항)
        </label>
        <input
          type="text"
          id="hint"
          name="hint"
          value={formData.hint}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="힌트를 입력하세요"
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          퀴즈 추가
        </button>
      </div>
    </form>
  );
}
