import { useState, useCallback, useEffect, useRef } from 'react';
import { Image, Trash2 } from 'lucide-react';
import { CompressionOptions } from './components/CompressionOptions';
import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { DownloadAll } from './components/DownloadAll';
import { ProcessingSummary } from './components/ProcessingSummary';
import { PrivacyNotice } from './components/PrivacyNotice';
import { HowToSection } from './components/HowToSection';
import { FaqSection } from './components/FaqSection';
import { SiteFooter } from './components/SiteFooter';
import { useImageQueue } from './hooks/useImageQueue';
import { DEFAULT_QUALITY_SETTINGS } from './utils/formatDefaults';
import { downloadAllImages } from './utils/download';
import { copy } from './copy/zh';
import type { ImageFile, OutputType, CompressionOptions as CompressionOptionsType } from './types';

export function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [showLargeBatchHint, setShowLargeBatchHint] = useState(false);
  const [showMobileLargeBatchHint, setShowMobileLargeBatchHint] = useState(false);
  const [outputType, setOutputType] = useState<OutputType>('webp');
  const [options, setOptions] = useState<CompressionOptionsType>({
    quality: DEFAULT_QUALITY_SETTINGS.webp,
    resizeMode: 'original',
    resizeWidth: 1920,
    resizeHeight: 1080,
    maintainAspectRatio: true,
  });

  const { addToQueue, reprocessImages } = useImageQueue(options, outputType, setImages);
  const imagesRef = useRef(images);
  const previousSettingsSignatureRef = useRef('');
  imagesRef.current = images;

  const settingsSignature = [
    outputType,
    options.quality,
    options.resizeMode,
    options.resizeWidth,
    options.resizeHeight,
    options.maintainAspectRatio,
  ].join('|');

  useEffect(() => {
    if (!previousSettingsSignatureRef.current) {
      previousSettingsSignatureRef.current = settingsSignature;
      return;
    }

    if (previousSettingsSignatureRef.current === settingsSignature) {
      return;
    }

    previousSettingsSignatureRef.current = settingsSignature;
    const timeoutId = window.setTimeout(() => {
      reprocessImages(
        imagesRef.current
          .filter((image) =>
            image.status === 'complete' ||
            image.status === 'processing' ||
            image.status === 'queued'
          )
          .map((image) => image.id)
        );
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [settingsSignature, reprocessImages]);

  const handleOutputTypeChange = useCallback((type: OutputType) => {
    setOutputType(type);
    if (type !== 'png') {
      setOptions((previous) => ({
        ...previous,
        quality: DEFAULT_QUALITY_SETTINGS[type],
      }));
    }
  }, []);

  const handleFilesDrop = useCallback((newImages: ImageFile[]) => {
    const isMobileViewport =
      typeof window !== 'undefined' && window.innerWidth <= 767;

    const pendingImages = newImages.filter((image) => image.status === 'pending');

    setShowLargeBatchHint(pendingImages.length > 30 && !isMobileViewport);
    setShowMobileLargeBatchHint(pendingImages.length > 10 && isMobileViewport);

    // First add all images to state
    setImages((prev) => [...prev, ...newImages]);
    
    // Use requestAnimationFrame to wait for render to complete
    requestAnimationFrame(() => {
      // Then add to queue after UI has updated
      pendingImages.forEach(image => addToQueue(image.id));
    });
  }, [addToQueue]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setImages([]);
  }, [images]);

  const handleDownloadAll = useCallback(async () => {
    await downloadAllImages(images);
  }, [images]);

  const completedImages = images.filter(img => img.status === 'complete').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`mx-auto w-full max-w-4xl px-4 pt-12 ${
          completedImages > 0 ? 'pb-28 sm:pb-12' : 'pb-12'
        }`}
      >
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Image className="h-8 w-8 text-blue-500" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">{copy.brand}</h1>
          </div>
          <p className="text-gray-600">{copy.tagline}</p>
          <div className="flex justify-center">
            <PrivacyNotice />
          </div>
        </header>

        <div className="space-y-6">
          <CompressionOptions
            options={options}
            outputType={outputType}
            onOptionsChange={setOptions}
            onOutputTypeChange={handleOutputTypeChange}
          />

          <DropZone onFilesDrop={handleFilesDrop} />

          {showLargeBatchHint && (
            <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {copy.batch.largeBatchHint}
            </p>
          )}

          {showMobileLargeBatchHint && (
            <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {copy.batch.mobileLargeBatchHint}
            </p>
          )}

          <ProcessingSummary images={images} />

          <div className="hidden sm:block">
            <DownloadAll
              onDownloadAll={handleDownloadAll}
              count={completedImages}
              disabled={completedImages === 0}
            />
          </div>

          <ImageList 
            images={images} 
            onRemove={handleRemoveImage} 
          />

          {images.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              <Trash2 className="w-5 h-5" />
              {copy.actions.clearAll}
            </button>
          )}
        </div>

        <div className="mt-12 space-y-6">
          <HowToSection />
          <FaqSection />
        </div>
      </div>

      {completedImages > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 pt-3 shadow-lg backdrop-blur sm:hidden"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto w-full max-w-4xl">
            <DownloadAll
              onDownloadAll={handleDownloadAll}
              count={completedImages}
              disabled={false}
            />
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
