// app/quiz/[id]/page.tsx

import QuizPlayerPage from './QuizPlayerPage';

export default function Page({ params }: any) {
  return <QuizPlayerPage id={params.id} />;
}
