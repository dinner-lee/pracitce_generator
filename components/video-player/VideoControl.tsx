"use client"

import { useState } from 'react';
import { extractVideoId } from '@/lib/youtube-utils';

interface VideoControlProps {
  onVideoIdSubmit: (videoId: string) => void;
}

export default function VideoControl({ onVideoIdSubmit }: VideoControlProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // URL에서 비디오 ID 추출
    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      setError('유효한 YouTube URL을 입력해주세요.');
      return;
    }
    
    setError('');
    onVideoIdSubmit(videoId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className={`flex-1 px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="https://www.youtube.com/watch?v=..."
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        시작
      </button>
      {error && <p className="text-sm text-red-600 absolute mt-1">{error}</p>}
    </form>
  );
}
