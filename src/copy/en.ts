import type { Copy } from './types';

export const enCopy = {
  brand: 'PixSmush',
  tagline: 'Free Online Image Compressor & Converter',
  seo: {
    title: 'PixSmush - Free Online Image Compressor & Converter',
    description:
      'PixSmush is a free online image compressor and converter with browser-side processing for JPEG, PNG, WebP, AVIF, and JPEG XL.',
    ogLocale: 'en_US',
  },
  privacyOneLiner: 'Your images are processed locally in your browser and never uploaded to a server.',
  format: {
    title: 'Choose output format',
    hint: 'Files will be compressed or converted to this format after upload.',
    quality: 'Quality',
    more: 'More formats',
    hideMore: 'Hide extra formats',
    webp: {
      name: 'WebP',
      badge: 'Recommended',
      desc: 'Smaller files for web use and most browsers',
    },
    jpeg: {
      name: 'JPEG',
      badge: 'Best compatibility',
      desc: 'Opens on nearly every device and app',
    },
    png: {
      name: 'PNG',
      badge: 'Transparent background',
      desc: 'Lossless, great for icons, screenshots, and transparency',
    },
    avif: {
      name: 'AVIF',
      desc: 'Often smaller, but not yet supported everywhere',
    },
    jxl: {
      name: 'JPEG XL',
      desc: 'A newer format with limited compatibility',
    },
  },
  resize: {
    title: 'Resize',
    hint: 'Original size is used by default, and images will not be upscaled.',
    original: 'Original size',
    longEdge1920: 'Longest edge 1920 px',
    longEdge1280: 'Longest edge 1280 px',
    longEdge800: 'Longest edge 800 px',
    custom: 'Custom',
    width: 'Width',
    height: 'Height',
    maintainAspectRatio: 'Lock aspect ratio',
    aspectRatioHint: 'Images will be scaled using the original ratio',
  },
  upload: {
    title: 'Add images to compress',
    action: 'Choose images',
    hint: 'Click to choose files or drag images here. You can select multiple at once.',
    formats: 'Supports JPEG, PNG, WebP, AVIF, and JPEG XL',
  },
  list: {
    download: 'Download',
    remove: 'Remove',
    pending: 'Waiting',
    queued: 'Queued',
    processing: 'Processing…',
    complete: 'Done',
    errorFallback: 'Processing failed',
    smaller: 'smaller',
    previewNotSupported: 'Preview not supported',
  },
  actions: {
    downloadAll: (count: number) => `Download ZIP (${count} files)`,
    clearAll: 'Clear list',
  },
  batch: {
    title: 'Batch progress',
    processing: 'Processing',
    waiting: 'Waiting',
    allComplete: 'All files processed',
    completeWithErrors: (count: number) => `Completed with ${count} failures`,
    completed: (complete: number, total: number) => `${complete} of ${total} complete`,
    processed: (finished: number, total: number) => `Processed ${finished} of ${total}`,
    processingCount: (count: number) => `${count} files processing`,
    waitingCount: (count: number) => `${count} files waiting`,
    failedCount: (count: number) => `${count} failed files`,
    failedImages: 'Failed files',
    originalSize: 'Original size',
    processedSize: 'Processed size',
    saved: 'Saved',
    increased: 'Increased',
    largeBatchHint: 'Processing many images at once may use a lot of memory, so splitting them up can help.',
    mobileLargeBatchHint: 'Processing many images on a phone may use a lot of memory, so splitting them up can help.',
  },
  howTo: {
    title: 'How it works',
    steps: [
      'Choose an output format first. WebP is a good default; JPEG gives the best compatibility; PNG keeps transparency.',
      'Click “Choose images” or drag files into the upload area. Multiple files are supported.',
      'When processing finishes, download files one by one or grab everything at once.',
    ],
  },
  about: {
    title: 'About PixSmush',
    body: 'PixSmush is a browser-based image compression and conversion tool built to help people reduce image file sizes quickly while keeping their files on their own device.',
  },
  faq: {
    title: 'FAQ',
    items: [
      {
        q: 'Are my images uploaded to a server?',
        a: 'No. Compression and conversion happen entirely in your browser, and nothing is sent to a server.',
      },
      {
        q: 'Which formats are supported?',
        a: 'JPEG, PNG, WebP, AVIF, and JPEG XL are supported. WebP is the default output format.',
      },
      {
        q: 'Can I compress lots of files at once?',
        a: 'Yes. Select or drop multiple files and they will be queued automatically.',
      },
      {
        q: 'Why did a file get larger?',
        a: 'Turning a tiny image into lossless PNG, or re-encoding an already compressed file at high quality, can make it larger. Try WebP or a lower quality setting.',
      },
      {
        q: 'Can I use HEIC photos from my phone?',
        a: 'Not yet. Please export them as JPEG or PNG before uploading.',
      },
      {
        q: 'Are my images used for analytics or ads?',
        a: 'No. Selected image files are not uploaded to PixSmush servers and are not used for analytics or advertising. The site may measure aggregated usage data with Google Analytics 4, and advertising services may use standard advertising technologies in the future where applicable.',
      },
    ],
  },
  advertisement: {
    label: 'Advertisement',
  },
  privacy: {
    title: 'Privacy',
    paragraphs: [
      'Images are processed locally in your browser. They are not uploaded to PixSmush servers, stored in the cloud, or sent to us for processing. Once you close the page, only the files you downloaded remain on your device.',
      'The site uses Google Analytics 4 to understand aggregated usage and improve the service. Analytics data does not include the selected image files.',
      'The site may use advertising services in the future. Where applicable, advertising services may use cookies, device information, or advertising identifiers according to their own policies and applicable choices.',
      'Contact: zhixushikong@gmail.com',
    ],
  },
  footer: {
    navLabel: 'Footer navigation',
    copyright: 'PixSmush',
    privacyLink: 'Privacy',
    faqLink: 'FAQ',
    contactLink: 'Contact',
    contactTitle: 'Contact',
    contactLabel: 'Email',
    contactEmail: 'zhixushikong@gmail.com',
    copyEmail: 'Copy email',
    copied: 'Copied',
    thanksTitle: 'Open source credits',
    thanks:
      'The interface and processing flow are adapted from Addy Osmani’s open source Squish project, and the image codecs use jSquash from Squoosh. The original project is MIT licensed. This site uses the implementation only and is not affiliated with the original authors or site.',
  },
} as const satisfies Copy;
