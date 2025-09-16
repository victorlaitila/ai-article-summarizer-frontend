interface ArticleSummaryProps {
  summary: string;
}

export default function SummaryBlock({ summary }: ArticleSummaryProps) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">📝 Summary</h2>
      <p className="bg-blue-50 p-5 rounded-lg shadow-inner whitespace-pre-wrap text-gray-700 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}