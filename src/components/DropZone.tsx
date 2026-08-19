import { useCallback, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import type { ImageFile } from '../types';
import { useLanguage } from '../context/language';

interface DropZoneProps {
  onFilesDrop: (files: ImageFile[]) => void;
}

const supportedMimeTypes = new Set([
  'image/avif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const supportedExtensions = new Set(['avif', 'jpeg', 'jpg', 'jxl', 'png', 'webp']);
const unsupportedExtensions = new Set(['heic', 'heif']);
let fallbackImageIdCounter = 0;

function createImageId(): string {
  const cryptoApi = typeof globalThis.crypto !== 'undefined' ? globalThis.crypto : undefined;

  if (typeof cryptoApi?.randomUUID === 'function') {
    try {
      return cryptoApi.randomUUID();
    } catch {
      // Fall through to the compatible ID generator.
    }
  }

  fallbackImageIdCounter += 1;
  return [
    'image',
    Date.now().toString(36),
    fallbackImageIdCounter.toString(36),
    Math.random().toString(36).slice(2),
  ].join('-');
}

function getFileExtension(file: File): string {
  const fileName = file.name.toLowerCase();
  const lastDotIndex = fileName.lastIndexOf('.');

  return lastDotIndex >= 0 ? fileName.slice(lastDotIndex + 1) : '';
}

function isSupportedImageFile(file: File): boolean {
  const fileType = file.type.toLowerCase();
  const extension = getFileExtension(file);

  if (
    unsupportedExtensions.has(extension) ||
    fileType === 'image/heic' ||
    fileType === 'image/heif'
  ) {
    return false;
  }

  return supportedExtensions.has(extension) || supportedMimeTypes.has(fileType);
}

function getUnsupportedImageError(file: File): string | undefined {
  const fileType = file.type.toLowerCase();
  const extension = getFileExtension(file);

  if (
    fileType === 'image/heic' ||
    fileType === 'image/heif' ||
    unsupportedExtensions.has(extension)
  ) {
    return 'Unsupported HEIC image';
  }

  if (fileType.startsWith('image/')) {
    return 'Unsupported input format';
  }

  return undefined;
}

function createImageFiles(files: File[]): ImageFile[] {
  return files.flatMap((file) => {
    const baseImage = {
      id: createImageId(),
      file,
      originalSize: file.size,
    };

    if (isSupportedImageFile(file)) {
      const image: ImageFile = {
        ...baseImage,
        status: 'pending',
      };

      return [image];
    }

    const error = getUnsupportedImageError(file);
    if (!error) return [];

    const image: ImageFile = {
      ...baseImage,
      status: 'error',
      error,
    };

    return [image];
  });
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
  const { copy } = useLanguage();
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const files = createImageFiles(Array.from(e.dataTransfer.files));
    onFilesDrop(files);
  }, [onFilesDrop]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const initialFiles = Array.from(e.currentTarget.files || []);
    const input = e.currentTarget;
    const files = createImageFiles(initialFiles);

    onFilesDrop(files);
    input.value = '';
  }, [onFilesDrop]);

  return (
    <div
      className="w-full max-w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40 sm:p-12"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label
        className="flex w-full cursor-pointer flex-col items-center gap-4 select-none"
      >
        <Upload className="w-12 h-12 text-blue-500" />
        <div className="min-w-0 max-w-full">
          <p className="text-lg font-semibold text-gray-900">
            {copy.upload.title}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {copy.upload.hint}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {copy.upload.formats}
          </p>
        </div>
        <span className="relative inline-flex min-h-[44px] w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white touch-manipulation sm:w-auto">
          <span>{copy.upload.action}</span>
          <input
            type="file"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            multiple
            accept="image/avif,image/jpeg,image/png,image/webp,.avif,.jpeg,.jpg,.jxl,.png,.webp"
            aria-label={copy.upload.action}
            onChange={handleFileInput}
          />
        </span>
      </label>
    </div>
  );
}
