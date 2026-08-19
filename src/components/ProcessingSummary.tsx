import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/imageProcessing';
import { useLanguage } from '../context/language';

interface ProcessingSummaryProps {
  images: ImageFile[];
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function ProcessingSummary({ images }: ProcessingSummaryProps) {
  const { copy } = useLanguage();
  if (images.length === 0) return null;

  const totalCount = images.length;
  const completeImages = images.filter((image) => image.status === 'complete');
  const processingCount = images.filter((image) => image.status === 'processing').length;
  const waitingCount = images.filter(
    (image) => image.status === 'pending' || image.status === 'queued'
  ).length;
  const failedImages = images.filter((image) => image.status === 'error');
  const finishedCount = completeImages.length + failedImages.length;
  const originalSize = images.reduce((total, image) => total + image.file.size, 0);
  const processedSize = completeImages.reduce(
    (total, image) =>
      image.blob && image.compressedSize !== undefined
        ? total + image.compressedSize
        : total,
    0
  );
  const savedSize = originalSize - processedSize;
  const savedPercentage = originalSize > 0
    ? (savedSize / originalSize) * 100
    : 0;
  const progressPercentage = (finishedCount / totalCount) * 100;
  const allComplete = completeImages.length === totalCount;
  const processingDone = finishedCount === totalCount;
  const savedLabel = savedSize >= 0 ? copy.batch.saved : copy.batch.increased;

  let statusText: string = copy.batch.processing;
  if (allComplete) {
    statusText = copy.batch.allComplete;
  } else if (processingDone) {
    statusText = copy.batch.completeWithErrors(failedImages.length);
  } else if (processingCount === 0 && waitingCount > 0) {
    statusText = copy.batch.waiting;
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-gray-900">{copy.batch.title}</h2>
        <span className="text-sm font-medium text-blue-600">{statusText}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{copy.batch.completed(completeImages.length, totalCount)}</span>
          <span>{copy.batch.processed(finishedCount, totalCount)}</span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label={copy.batch.title}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-valuenow={finishedCount}
        >
          <div
            className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>{copy.batch.processingCount(processingCount)}</span>
          <span>{copy.batch.waitingCount(waitingCount)}</span>
          {failedImages.length > 0 && (
            <span className="text-red-600">{copy.batch.failedCount(failedImages.length)}</span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">{copy.batch.originalSize}</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {formatFileSize(originalSize)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">{copy.batch.processedSize}</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {formatFileSize(processedSize)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">{savedLabel}</p>
          <p className={`mt-1 text-base font-semibold ${savedSize >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
            {formatFileSize(Math.abs(savedSize))}（{formatPercentage(Math.abs(savedPercentage))}）
          </p>
        </div>
      </div>

      {failedImages.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">{copy.batch.failedImages}</p>
          <p className="mt-1 break-words text-sm text-red-600">
            {failedImages.map((image) => image.file.name).join('、')}
          </p>
        </div>
      )}
    </section>
  );
}
