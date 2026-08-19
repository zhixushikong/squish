import type { Copy, Language } from './types';
import { enCopy } from './en';
import { zhCopy } from './zh';

export type { Copy, Language } from './types';

export const copies = {
  en: enCopy,
  zh: zhCopy,
} as const satisfies Record<Language, Copy>;

export function getCopy(language: Language): Copy {
  return copies[language];
}

export function getDefaultLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const language = navigator.language.toLowerCase();
  const languages = navigator.languages?.map((value) => value.toLowerCase()) ?? [];
  const preferred = [language, ...languages];

  return preferred.some((value) => value.startsWith('zh')) ? 'zh' : 'en';
}

const errorMessages: Record<Language, Record<string, string>> = {
  en: {
    'Empty file': 'The file is empty.',
    'Invalid image data': 'Unable to read this image.',
    'Failed to compress image': 'Compression failed.',
    'Failed to process image': 'Processing failed.',
    'Unsupported HEIC image': 'HEIC/HEIF images are not supported yet. Please use JPG, PNG, or WebP.',
    'Unsupported input format': 'This image format is not supported yet. Please use JPG, PNG, or WebP.',
  },
  zh: {
    'Empty file': '文件是空的',
    'Invalid image data': '无法读取这张图片',
    'Failed to compress image': '压缩失败',
    'Failed to process image': '处理失败',
    'Unsupported HEIC image': '当前暂不支持 HEIC/HEIF 图片，请选择 JPG、PNG 或 WebP 图片。',
    'Unsupported input format': '当前图片格式暂不支持，请选择 JPG、PNG 或 WebP 图片。',
  },
};

export function formatErrorMessage(error: string | undefined, language: Language): string {
  const fallback = getCopy(language).list.errorFallback;
  if (!error) return fallback;

  const exact = errorMessages[language];
  if (exact[error]) return exact[error];

  if (error.startsWith('Failed to decode')) {
    return language === 'zh' ? '无法解码该图片格式' : 'Unable to decode this image format.';
  }

  if (error.startsWith('Failed to encode')) {
    return language === 'zh' ? '无法转换到目标格式' : 'Unable to convert to the target format.';
  }

  if (error.startsWith('Unsupported')) {
    return language === 'zh' ? '暂不支持该格式' : 'This format is not supported yet.';
  }

  if (error.startsWith('Failed to initialize')) {
    return language === 'zh'
      ? '该格式组件加载失败，请刷新页面重试'
      : 'The format module failed to load. Please refresh and try again.';
  }

  return error;
}
