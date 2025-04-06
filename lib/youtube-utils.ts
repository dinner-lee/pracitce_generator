/**
 * YouTube URL에서 비디오 ID를 추출하는 함수
 * 
 * 지원하는 URL 형식:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * 
 * @param url YouTube 동영상 URL
 * @returns 추출된 비디오 ID 또는 유효하지 않은 URL인 경우 null
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  // URL에서 비디오 ID 추출을 위한 정규식 패턴
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID 형식
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
    // youtu.be/VIDEO_ID 형식
    /youtu\.be\/([^?]+)/,
    // youtube.com/embed/VIDEO_ID 형식
    /youtube\.com\/embed\/([^?]+)/
  ];
  
  // 각 패턴에 대해 URL 매칭 시도
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * 초 단위 시간을 mm:ss 형식의 문자열로 변환
 * 
 * @param seconds 초 단위 시간
 * @returns mm:ss 형식의 시간 문자열
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  // 두 자리 숫자로 포맷팅 (01:05 형식)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * mm:ss 형식의 시간 문자열을 초 단위로 변환
 * 
 * @param timeString mm:ss 형식의 시간 문자열
 * @returns 초 단위 시간 또는 유효하지 않은 형식인 경우 null
 */
export function parseTime(timeString: string): number | null {
  // mm:ss 형식 검증
  const pattern = /^(\d{1,2}):(\d{2})$/;
  const match = timeString.match(pattern);
  
  if (!match) return null;
  
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  
  // 유효한 분, 초 값인지 확인
  if (seconds >= 60) return null;
  
  return minutes * 60 + seconds;
}
