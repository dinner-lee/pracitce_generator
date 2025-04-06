// app/quiz/[id]/page.tsx
import QuizPlayerPage from './QuizPlayerPage';

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  return <QuizPlayerPage id={params.id} />;
}
