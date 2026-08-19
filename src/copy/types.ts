export type Language = 'en' | 'zh';

export interface FormatMeta {
  name: string;
  desc: string;
  badge?: string;
}

export interface Copy {
  brand: string;
  tagline: string;
  seo: {
    title: string;
    description: string;
    ogLocale: 'en_US' | 'zh_CN';
  };
  privacyOneLiner: string;
  format: {
    title: string;
    hint: string;
    quality: string;
    more: string;
    hideMore: string;
    webp: FormatMeta;
    jpeg: FormatMeta;
    png: FormatMeta;
    avif: FormatMeta;
    jxl: FormatMeta;
  };
  resize: {
    title: string;
    hint: string;
    original: string;
    longEdge1920: string;
    longEdge1280: string;
    longEdge800: string;
    custom: string;
    width: string;
    height: string;
    maintainAspectRatio: string;
    aspectRatioHint: string;
  };
  upload: {
    title: string;
    action: string;
    hint: string;
    formats: string;
  };
  list: {
    download: string;
    remove: string;
    pending: string;
    queued: string;
    processing: string;
    complete: string;
    errorFallback: string;
    smaller: string;
    previewNotSupported: string;
  };
  actions: {
    downloadAll: (count: number) => string;
    clearAll: string;
  };
  batch: {
    title: string;
    processing: string;
    waiting: string;
    allComplete: string;
    completeWithErrors: (count: number) => string;
    completed: (complete: number, total: number) => string;
    processed: (finished: number, total: number) => string;
    processingCount: (count: number) => string;
    waitingCount: (count: number) => string;
    failedCount: (count: number) => string;
    failedImages: string;
    originalSize: string;
    processedSize: string;
    saved: string;
    increased: string;
    largeBatchHint: string;
    mobileLargeBatchHint: string;
  };
  howTo: {
    title: string;
    steps: readonly string[];
  };
  about: {
    title: string;
    body: string;
  };
  faq: {
    title: string;
    items: readonly {
      q: string;
      a: string;
    }[];
  };
  advertisement: {
    label: string;
  };
  privacy: {
    title: string;
    paragraphs: readonly string[];
  };
  footer: {
    navLabel: string;
    copyright: string;
    privacyLink: string;
    faqLink: string;
    contactLink: string;
    contactTitle: string;
    contactLabel: string;
    contactEmail: string;
    copyEmail: string;
    copied: string;
    thanksTitle: string;
    thanks: string;
  };
}
