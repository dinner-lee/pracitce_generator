"use client"

import { useState } from 'react';
import { extractVideoId } from '@/lib/youtube-utils';

interface VideoInputProps {
  onVideoSubmit: (videoId: string, title: string) => void;
}

export default function VideoInput({ onVideoSubmit }: VideoInputProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // URL에서 비디오 ID 추출
    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      setError('유효한 YouTube URL을 입력해주세요.');
      return;
    }
    
    if (!title.trim()) {
      setError('퀴즈 제목을 입력해주세요.');
      return;
    }
    
    setError('');
    onVideoSubmit(videoId, title);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube 동영상 URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={`w-full px-3 py-2 border ${error && !videoUrl ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          퀴즈 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border ${error && !title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="퀴즈 제목을 입력하세요"
        />
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        동영상 설정
      </button>
    </form>
  );
}
