import { Download } from 'lucide-react';
import { useLanguage } from '../context/language';

interface DownloadAllProps {
  onDownloadAll: () => void;
  count: number;
  disabled: boolean;
}

export function DownloadAll({ onDownloadAll, count, disabled }: DownloadAllProps) {
  const { copy } = useLanguage();
  return (
    <button
      type="button"
      onClick={onDownloadAll}
      disabled={disabled}
      className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="w-5 h-5" />
      {copy.actions.downloadAll(count)}
    </button>
  );
}
