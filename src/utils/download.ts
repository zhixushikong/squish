import type { ImageFile } from '../types';
import { createZipBlob, type ZipFile } from './zip';

function getOutputFileName(image: ImageFile): string | undefined {
  if (!image.outputType) return undefined;

  const originalName = image.file.name;
  const extensionIndex = originalName.lastIndexOf('.');
  const baseName = extensionIndex > 0
    ? originalName.slice(0, extensionIndex)
    : originalName;

  return `${baseName}.${image.outputType}`;
}

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadImage(image: ImageFile) {
  if (!image.blob) return;

  const fileName = getOutputFileName(image);
  if (!fileName) return;

  triggerDownload(image.blob, fileName);
}

function getUniqueFileName(fileName: string, usedNames: Set<string>): string {
  const extensionIndex = fileName.lastIndexOf('.');
  const baseName = extensionIndex > 0
    ? fileName.slice(0, extensionIndex)
    : fileName;
  const extension = extensionIndex > 0
    ? fileName.slice(extensionIndex)
    : '';

  let uniqueName = fileName;
  let suffix = 1;

  while (usedNames.has(uniqueName.toLocaleLowerCase())) {
    uniqueName = `${baseName} (${suffix})${extension}`;
    suffix++;
  }

  usedNames.add(uniqueName.toLocaleLowerCase());
  return uniqueName;
}

export async function downloadAllImages(images: ImageFile[]): Promise<void> {
  const completedImages = images.filter(
    (image): image is ImageFile & { blob: Blob; outputType: NonNullable<ImageFile['outputType']> } =>
      image.status === 'complete' &&
      image.blob !== undefined &&
      image.outputType !== undefined
  );

  if (completedImages.length === 0) return;

  const usedNames = new Set<string>();
  const files: ZipFile[] = completedImages.map((image) => {
    const fileName = getOutputFileName(image);

    if (!fileName) {
      throw new Error('Missing output file name');
    }

    return {
      name: getUniqueFileName(fileName, usedNames),
      data: image.blob,
    };
  });

  const zipBlob = await createZipBlob(files);
  triggerDownload(zipBlob, 'lightpress-images.zip');
}
