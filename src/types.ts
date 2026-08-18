export interface ImageFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'queued' | 'processing' | 'complete' | 'error';
  error?: string;
  originalSize: number;
  compressedSize?: number;
  outputType?: OutputType;
  blob?: Blob;
}

export type OutputType = 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp';

export interface FormatQualitySettings {
  avif: number;
  jpeg: number;
  jxl: number;
  webp: number;
}

export type ResizeMode =
  | 'original'
  | 'long-edge-1920'
  | 'long-edge-1280'
  | 'long-edge-800'
  | 'custom';

export interface CompressionOptions {
  quality: number;
  resizeMode: ResizeMode;
  resizeWidth: number;
  resizeHeight: number;
  maintainAspectRatio: boolean;
}
