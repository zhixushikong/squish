import { useState, useCallback, useEffect, useRef } from 'react';
import type { ImageFile, OutputType, CompressionOptions } from '../types';
import { decode, encode, getFileType } from '../utils/imageProcessing';
import { calculateDimensions, resizeImage } from '../utils/resize';

interface ResizeRequest {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

function getMaxParallelProcessing(): number {
  if (typeof window === 'undefined') return 3;

  const narrowViewport = window.innerWidth <= 767;
  const touchViewport =
    navigator.maxTouchPoints > 0 && window.innerWidth <= 1024;

  return narrowViewport || touchViewport ? 1 : 3;
}

function getResizeRequest(
  imageData: ImageData,
  options: CompressionOptions
): ResizeRequest | undefined {
  if (options.resizeMode === 'original') {
    return undefined;
  }

  if (options.resizeMode.startsWith('long-edge-')) {
    const maxEdge = Number(options.resizeMode.replace('long-edge-', ''));
    const longestOriginalEdge = Math.max(imageData.width, imageData.height);

    if (!Number.isFinite(maxEdge) || longestOriginalEdge <= maxEdge) {
      return undefined;
    }

    return imageData.width >= imageData.height
      ? { width: maxEdge, maintainAspectRatio: true }
      : { height: maxEdge, maintainAspectRatio: true };
  }

  const requestedWidth = Number.isFinite(options.resizeWidth)
    ? Math.max(1, Math.floor(options.resizeWidth))
    : 0;
  const requestedHeight = Number.isFinite(options.resizeHeight)
    ? Math.max(1, Math.floor(options.resizeHeight))
    : 0;

  if (!requestedWidth && !requestedHeight) {
    return undefined;
  }

  const boundedWidth = requestedWidth
    ? Math.min(requestedWidth, imageData.width)
    : imageData.width;
  const boundedHeight = requestedHeight
    ? Math.min(requestedHeight, imageData.height)
    : imageData.height;
  const dimensions = calculateDimensions(imageData.width, imageData.height, {
    width: boundedWidth,
    height: boundedHeight,
    maintainAspectRatio: options.maintainAspectRatio,
  });

  if (dimensions.width === imageData.width && dimensions.height === imageData.height) {
    return undefined;
  }

  return {
    width: boundedWidth,
    height: boundedHeight,
    maintainAspectRatio: options.maintainAspectRatio,
  };
}

export function useImageQueue(
  options: CompressionOptions,
  outputType: OutputType,
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
) {
  const [queue, setQueue] = useState<string[]>([]);
  const [maxParallelProcessing, setMaxParallelProcessing] = useState(
    getMaxParallelProcessing
  );
  const processingCount = useRef(0);
  const processingImages = useRef(new Set<string>());
  const scheduledImages = useRef(new Set<string>());
  const pendingReprocessImages = useRef(new Set<string>());
  const processNextInQueueRef = useRef<() => void>(() => {});

  const enqueueImage = useCallback((imageId: string) => {
    if (
      processingImages.current.has(imageId) ||
      scheduledImages.current.has(imageId)
    ) {
      pendingReprocessImages.current.add(imageId);
      return;
    }

    setQueue((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]));
  }, []);

  const processImage = useCallback(async (image: ImageFile) => {
    if (processingImages.current.has(image.id)) {
      return; // Skip if already processing this image
    }
    processingImages.current.add(image.id);
    processingCount.current++;

    try {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'processing' as const,
                preview: undefined,
                blob: undefined,
                compressedSize: undefined,
                outputType: undefined,
                error: undefined,
              }
            : img
        )
      );

      const fileBuffer = await image.file.arrayBuffer();
      const sourceType = getFileType(image.file);
      
      if (!fileBuffer.byteLength) {
        throw new Error('Empty file');
      }

      // Decode the image
      const imageData = await decode(sourceType, fileBuffer);
      
      if (!imageData || !imageData.width || !imageData.height) {
        throw new Error('Invalid image data');
      }

      // Resize only after decoding and only when the requested dimensions are smaller.
      const resizeRequest = getResizeRequest(imageData, options);
      const processedImageData = resizeRequest
        ? resizeImage(imageData, resizeRequest)
        : imageData;

      // Encode to the target format
      const compressedBuffer = await encode(outputType, processedImageData, options);
      
      if (!compressedBuffer.byteLength) {
        throw new Error('Failed to compress image');
      }

      const blob = new Blob([compressedBuffer], { type: `image/${outputType}` });
      const preview = URL.createObjectURL(blob);

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'complete' as const,
                preview,
                blob,
                compressedSize: compressedBuffer.byteLength,
                outputType,
              }
            : img
        )
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'error' as const,
                error: error instanceof Error 
                  ? error.message 
                  : 'Failed to process image',
              }
            : img
        )
      );
    } finally {
      processingImages.current.delete(image.id);
      processingCount.current--;

      if (pendingReprocessImages.current.delete(image.id)) {
        enqueueImage(image.id);
      }

      // Try to process next images if any
      setTimeout(() => {
        processNextInQueueRef.current();
      }, 0);
    }
  }, [enqueueImage, options, outputType, setImages]);

  const processNextInQueue = useCallback(() => {
    console.log('Processing next in queue:', {
      queueLength: queue.length,
      processingCount: processingCount.current,
      processingImages: [...processingImages.current]
    });

    if (queue.length === 0) return;

    // Get all images we can process in this batch
    setImages(prev => {
      const availableSlots = Math.max(
        0,
        maxParallelProcessing -
          processingCount.current -
          scheduledImages.current.size
      );
      if (availableSlots === 0) return prev;

      const imagesToProcess = prev.filter(img => 
        queue.includes(img.id) && 
        !processingImages.current.has(img.id) &&
        !scheduledImages.current.has(img.id)
      ).slice(0, availableSlots);

      console.log('Found images to process:', imagesToProcess.length);

      if (imagesToProcess.length === 0) return prev;

      // Start processing these images
      imagesToProcess.forEach((image, index) => {
        scheduledImages.current.add(image.id);
        setTimeout(() => {
          scheduledImages.current.delete(image.id);
          processImage(image);
        }, index * 100);
      });

      // Remove these from queue
      setQueue(current => current.filter(id => 
        !imagesToProcess.some(img => img.id === id)
      ));

      // Update status to queued
      return prev.map(img => 
        imagesToProcess.some(processImg => processImg.id === img.id)
          ? {
              ...img,
              status: img.status === 'processing' ? 'processing' as const : 'queued' as const,
            }
          : img
      );
    });
  }, [maxParallelProcessing, queue, processImage, setImages]);

  useEffect(() => {
    const handleViewportChange = () => {
      setMaxParallelProcessing(getMaxParallelProcessing());
    };

    window.addEventListener('resize', handleViewportChange);
    return () => window.removeEventListener('resize', handleViewportChange);
  }, []);

  useEffect(() => {
    processNextInQueueRef.current = processNextInQueue;
  }, [processNextInQueue]);

  // Start processing when queue changes
  useEffect(() => {
    console.log('Queue changed:', queue.length);
    if (queue.length > 0) {
      processNextInQueue();
    }
  }, [queue, processNextInQueue]);

  const addToQueue = useCallback((imageId: string) => {
    console.log('Adding to queue:', imageId);
    enqueueImage(imageId);
  }, [enqueueImage]);

  const reprocessImages = useCallback((imageIds: string[]) => {
    imageIds.forEach((imageId) => {
      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== imageId) return img;

          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }

          return {
            ...img,
            status: 'processing' as const,
            preview: undefined,
            blob: undefined,
            compressedSize: undefined,
            outputType: undefined,
            error: undefined,
          };
        })
      );
      enqueueImage(imageId);
    });
  }, [enqueueImage, setImages]);

  return { addToQueue, reprocessImages };
}
