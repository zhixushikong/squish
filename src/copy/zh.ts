import type { Copy } from './types';

export const zhCopy = {
  brand: 'PixSmush',
  tagline: '免费在线图片压缩与格式转换工具',
  seo: {
    title: 'PixSmush - 免费在线图片压缩与格式转换工具',
    description: 'PixSmush 是免费在线图片压缩与格式转换工具，支持 JPEG、PNG、WebP、AVIF 和 JPEG XL，图片在浏览器本地处理。',
    ogLocale: 'zh_CN',
  },
  privacyOneLiner: '图片全部在你的浏览器本地处理，不会上传到服务器。',
  format: {
    title: '选择输出格式',
    hint: '上传后会按此格式压缩或转换。',
    quality: '画质',
    more: '更多格式',
    hideMore: '收起更多格式',
    webp: {
      name: 'WebP',
      badge: '推荐',
      desc: '体积更小，适合网页和大多数浏览器',
    },
    jpeg: {
      name: 'JPEG',
      badge: '兼容性最好',
      desc: '几乎所有设备和软件都能打开',
    },
    png: {
      name: 'PNG',
      badge: '透明背景',
      desc: '无损，适合图标、截图和透明图',
    },
    avif: {
      name: 'AVIF',
      desc: '通常更小，部分软件尚未支持',
    },
    jxl: {
      name: 'JPEG XL',
      desc: '较新的格式，兼容性有限',
    },
  },
  resize: {
    title: '调整尺寸',
    hint: '默认使用原始尺寸，图片不会被放大。',
    original: '原始尺寸',
    longEdge1920: '最长边 1920 像素',
    longEdge1280: '最长边 1280 像素',
    longEdge800: '最长边 800 像素',
    custom: '自定义',
    width: '宽度',
    height: '高度',
    maintainAspectRatio: '锁定比例',
    aspectRatioHint: '处理时会按原图比例缩放',
  },
  upload: {
    title: '添加要压缩的图片',
    action: '选择图片',
    hint: '点击按钮选择，或把图片拖到这里。一次可以选多张。',
    formats: '支持 JPEG、PNG、WebP，以及 AVIF、JPEG XL',
  },
  list: {
    download: '下载',
    remove: '移除',
    pending: '等待处理',
    queued: '排队中',
    processing: '处理中…',
    complete: '完成',
    errorFallback: '处理失败',
    smaller: '缩小',
    previewNotSupported: '当前浏览器暂不支持预览',
  },
  actions: {
    downloadAll: (count: number) => `下载全部（ZIP，${count} 张）`,
    clearAll: '清空列表',
  },
  batch: {
    title: '批量处理进度',
    processing: '正在处理',
    waiting: '等待处理',
    allComplete: '全部处理完成',
    completeWithErrors: (count: number) => `处理完成，有 ${count} 张失败`,
    completed: (complete: number, total: number) => `已完成 ${complete} / ${total} 张`,
    processed: (finished: number, total: number) => `已处理 ${finished} / ${total} 张`,
    processingCount: (count: number) => `处理中 ${count} 张`,
    waitingCount: (count: number) => `等待 ${count} 张`,
    failedCount: (count: number) => `失败 ${count} 张`,
    failedImages: '失败图片',
    originalSize: '原始大小',
    processedSize: '处理后',
    saved: '已节省',
    increased: '体积增加',
    largeBatchHint: '一次处理较多图片可能会占用较多内存，建议分批处理。',
    mobileLargeBatchHint: '手机同时处理较多图片可能占用较多内存，建议分批处理。',
  },
  howTo: {
    title: '如何使用',
    steps: [
      '先选择输出格式。日常推荐 WebP；需要最大兼容时选 JPEG；需要透明背景时选 PNG。',
      '点击「选择图片」，或把图片拖到上传区域。一次可以处理多张。',
      '等待处理完成，即可单张下载，或一次性下载全部。',
    ],
  },
  about: {
    title: '关于 PixSmush',
    body: 'PixSmush 是一个在浏览器中运行的图片压缩与格式转换工具，帮助用户快速减小图片体积，同时让图片文件保留在自己的设备上处理。',
  },
  faq: {
    title: '常见问题',
    items: [
      {
        q: '图片会上传到服务器吗？',
        a: '不会。压缩和格式转换都在你自己的浏览器里完成，图片不会发送到任何服务器。',
      },
      {
        q: '支持哪些格式？',
        a: '可以处理 JPEG、PNG、WebP、AVIF 和 JPEG XL。默认输出为 WebP。',
      },
      {
        q: '可以一次压缩很多张吗？',
        a: '可以。选择或拖入多张图片后，会自动排队处理。',
      },
      {
        q: '为什么有的图片变大了？',
        a: '把很小的图转到无损 PNG，或把已经压过的图再转到高质量格式时，文件有可能变大。可以换 WebP 或降低画质再试。',
      },
      {
        q: '手机拍照的 HEIC 能用吗？',
        a: '目前不支持 HEIC。请先在系统里导出为 JPEG 或 PNG 再上传。',
      },
      {
        q: '我的图片会用于分析或广告吗？',
        a: '不会。用户选择的图片文件不会上传到 PixSmush 服务器，也不会用于分析或广告。网站可能使用 Google Analytics 4 统计汇总访问数据，未来广告服务可能使用常规广告技术。',
      },
    ],
  },
  advertisement: {
    label: '广告',
  },
  privacy: {
    title: '隐私说明',
    paragraphs: [
      '图片在浏览器本地处理，不会上传到 PixSmush 服务器，不会存到云端，也不会发送给我们处理。关闭页面后，处理结果只保留在你本机下载的文件里。',
      '网站使用 Google Analytics 4 了解汇总访问情况，用于了解使用情况和改进服务。分析数据不包含用户选择的图片文件。',
      '网站未来可能使用广告服务。在适用情况下，广告服务可能使用 Cookie、设备信息或广告标识，具体以相关服务的政策和用户可用的选择为准。',
      '联系邮箱：zhixushikong@gmail.com',
    ],
  },
  footer: {
    navLabel: '页脚导航',
    copyright: 'PixSmush',
    privacyLink: '隐私说明',
    faqLink: '常见问题',
    contactLink: '联系',
    contactTitle: '联系方式',
    contactLabel: '邮箱',
    contactEmail: 'zhixushikong@gmail.com',
    copyEmail: '复制邮箱',
    copied: '已复制',
    thanksTitle: '开源致谢',
    thanks:
      '界面与处理流程基于 Addy Osmani 的开源项目 Squish 改造，图片编解码使用 jSquash（源自 Squoosh）。原项目采用 MIT 许可。本站仅使用其技术实现，不代表原作者或原网站。',
  },
} as const satisfies Copy;
