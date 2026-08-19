import { X, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/imageProcessing';
import { downloadImage } from '../utils/download';
import { formatErrorMessage } from '../copy';
import { useLanguage } from '../context/language';

interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
}

export function ImageList({ images, onRemove }: ImageListProps) {
  const { language, copy } = useLanguage();
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="flex min-w-0 items-start gap-3 overflow-hidden rounded-lg bg-white p-4 shadow-sm sm:gap-4"
        >
          {image.status === 'complete' && image.outputType === 'jxl' ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-gray-100 p-2 text-center text-xs text-gray-500">
              {copy.list.previewNotSupported}
            </div>
          ) : image.preview ? (
            <img
              src={image.preview}
              alt={image.file.name}
              className="h-16 w-16 shrink-0 rounded object-cover"
            />
          ) : null}
          <div className="flex-1 min-w-0">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <p className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-gray-900">
                {image.file.name}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                {image.status === 'complete' && (
                  <button
                    type="button"
                    onClick={() => downloadImage(image)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title={`${copy.list.download}: ${image.file.name}`}
                    aria-label={`${copy.list.download}: ${image.file.name}`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title={`${copy.list.remove}: ${image.file.name}`}
                  aria-label={`${copy.list.remove}: ${image.file.name}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
              {image.status === 'pending' && (
                <span>{copy.list.pending}</span>
              )}
              {image.status === 'queued' && (
                <span>{copy.list.queued}</span>
              )}
              {image.status === 'processing' && (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {copy.list.processing}
                </span>
              )}
              {image.status === 'complete' && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {copy.list.complete}
                </span>
              )}
              {image.status === 'error' && (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {formatErrorMessage(image.error, language)}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {formatFileSize(image.originalSize)}
              {image.compressedSize && (
                <>
                  {' → '}
                  {formatFileSize(image.compressedSize)}{' '}
                  <span className="text-green-600">
                    (
                    {copy.list.smaller}{' '}
                    {Math.round(
                      ((image.originalSize - image.compressedSize) /
                        image.originalSize) *
                        100
                    )}
                    %)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
