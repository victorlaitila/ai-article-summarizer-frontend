import { CardContent } from "./ui/Card";

export default function FullArticle({article}: {article: string}) {
  return (
    <CardContent>
      <div className="bg-indigo-50 rounded-lg p-2.5">
        {article}
      </div>
    </CardContent>
  )
}