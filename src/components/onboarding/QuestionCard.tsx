interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({
  question,
}: QuestionCardProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold leading-tight text-zinc-900">
        {question}
      </h2>
    </div>
  );
}