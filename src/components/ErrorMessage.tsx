interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return <p className="mt-6 text-red-600 font-semibold text-center">{error}</p>;
}