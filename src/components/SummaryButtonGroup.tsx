import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Copy, Download, Share2 } from 'lucide-react';
import { useSummaryActions } from '../hooks/useSummaryActions';

export default function SummaryButtonGroup({summary}: {summary: string}) {
  const { t } = useTranslation();
  const { handleCopy, handleDownload, handleShare } = useSummaryActions(summary);

  return (
    <div className="flex gap-2">
      <Button
        title={t("copy")}
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button
        title={t("download")}
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        title={t("share")}
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  )
}