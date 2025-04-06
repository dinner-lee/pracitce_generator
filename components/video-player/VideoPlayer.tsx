"use client"

import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  timestamps: number[];
  currentTimestamp: number | null;
  onTimestampReached: (timestamp: number) => void;
  onVideoEnded?: () => void;
}

export default function VideoPlayer({
  videoId,
  timestamps,
  currentTimestamp,
  onTimestampReached,
  onVideoEnded,
}: VideoPlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [wasManuallyPaused, setWasManuallyPaused] = useState(false); // ⭐추가

  const lastCheckedTimestamp = useRef<number | null>(null);
  const sortedTimestamps = [...timestamps].sort((a, b) => a - b);

  useEffect(() => {
    if (player && isPlayerReady && currentTimestamp === null && !isPlaying && !wasManuallyPaused) {
      const iframe = player.getIframe();
      if (iframe && iframe.src) {
        player.playVideo();
      }
    }
  }, [player, isPlayerReady, currentTimestamp, isPlaying, wasManuallyPaused]);

  useEffect(() => {
    const checkTimestamp = () => {
      if (!player) return;

      const time = player.getCurrentTime();
      setCurrentTime(time);

      if (isPlaying) {
        for (const timestamp of sortedTimestamps) {
          if (
            Math.abs(time - timestamp) < 0.5 &&
            lastCheckedTimestamp.current !== timestamp
          ) {
            onTimestampReached(timestamp);
            lastCheckedTimestamp.current = timestamp;
            player.pauseVideo();
            setIsPlaying(false);
            setWasManuallyPaused(false); // ⭐자동으로 멈춘 경우는 수동 아님
            break;
          }
        }
      }
    };

    const intervalId = setInterval(checkTimestamp, 100);
    return () => clearInterval(intervalId);
  }, [player, isPlaying, sortedTimestamps, onTimestampReached]);

  const opts = {
    height: '480',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    setIsPlayerReady(true);
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      if (onVideoEnded) {
        onVideoEnded();
      }
    }
  };

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      setWasManuallyPaused(true); // ⭐사용자 수동 일시정지
    } else {
      player.playVideo();
      setWasManuallyPaused(false); // ⭐사용자 수동 재생
    }

    setIsPlaying(!isPlaying);
  };
  
  // 볼륨 조절
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    
    const newVolume = parseInt(e.target.value);
    player.setVolume(newVolume);
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  // 음소거 토글
  const toggleMute = () => {
    if (!player) return;
    
    if (isMuted) {
      player.unMute();
      player.setVolume(volume || 50);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };
  
  // 재생 속도 변경
  const handlePlaybackRateChange = (rate: number) => {
    if (!player) return;
    
    player.setPlaybackRate(rate);
    setPlaybackRate(rate);
  };
  
  // 전체 화면 토글
  const toggleFullscreen = () => {
    const container = document.getElementById('player-container');
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // 시간 포맷 변환 (초 -> mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 시간 이동 (되감기만 가능)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    
    const newTime = parseFloat(e.target.value);
    const currentTime = player.getCurrentTime();
    
    // 앞으로 건너뛰기 방지 (현재 시간보다 앞으로 이동 불가)
    if (newTime <= currentTime) {
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
      
      // 타임스탬프 체크 초기화
      lastCheckedTimestamp.current = null;
    }
  };
  
  return (
    <div id="player-container" className="relative">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full"
      />
      
      {/* 커스텀 컨트롤 */}
      <div className="bg-gray-900 text-white p-3">
        {/* 진행 바 */}
        <div className="mb-2">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 재생/일시 중지 버튼 */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* 음소거 버튼 */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            
            {/* 볼륨 조절 */}
            <div className="flex items-center space-x-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 재생 속도 */}
            <div className="relative group">
              <button className="text-white hover:text-blue-400 transition-colors text-sm">
                {playbackRate}x
              </button>
              <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-md p-1 hidden group-hover:block">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`block w-full text-left px-2 py-1 text-sm ${
                      playbackRate === rate ? 'text-blue-400' : 'text-white hover:text-blue-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            
            {/* 전체 화면 버튼 */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M15 9H19.5M15 9V4.5M15 15v4.5M15 15h4.5M9 15H4.5M9 15v4.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
