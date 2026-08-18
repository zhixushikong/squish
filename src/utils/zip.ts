const UTF8_FLAG = 0x0800;
const ZIP_STORE = 0;
const UINT32_MAX = 0xffffffff;
const UINT16_MAX = 0xffff;

export interface ZipFile {
  name: string;
  data: Blob;
}

const crc32Table = createCrc32Table();

function createCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);

  for (let index = 0; index < table.length; index++) {
    let value = index;

    for (let bit = 0; bit < 8; bit++) {
      value = value & 1
        ? 0xedb88320 ^ (value >>> 1)
        : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
}

function crc32(data: Uint8Array): number {
  let value = UINT32_MAX;

  for (const byte of data) {
    value = crc32Table[(value ^ byte) & 0xff] ^ (value >>> 8);
  }

  return (value ^ UINT32_MAX) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

function createLocalFileHeader(
  name: Uint8Array,
  data: Uint8Array,
  checksum: number
): Uint8Array {
  const header = new Uint8Array(30 + name.length);
  const view = new DataView(header.buffer);

  writeUint32(view, 0, 0x04034b50);
  writeUint16(view, 4, 20);
  writeUint16(view, 6, UTF8_FLAG);
  writeUint16(view, 8, ZIP_STORE);
  writeUint16(view, 10, 0);
  writeUint16(view, 12, 0);
  writeUint32(view, 14, checksum);
  writeUint32(view, 18, data.length);
  writeUint32(view, 22, data.length);
  writeUint16(view, 26, name.length);
  writeUint16(view, 28, 0);
  header.set(name, 30);

  return header;
}

function createCentralDirectoryHeader(
  name: Uint8Array,
  data: Uint8Array,
  checksum: number,
  localHeaderOffset: number
): Uint8Array {
  const header = new Uint8Array(46 + name.length);
  const view = new DataView(header.buffer);

  writeUint32(view, 0, 0x02014b50);
  writeUint16(view, 4, 20);
  writeUint16(view, 6, 20);
  writeUint16(view, 8, UTF8_FLAG);
  writeUint16(view, 10, ZIP_STORE);
  writeUint16(view, 12, 0);
  writeUint16(view, 14, 0);
  writeUint32(view, 16, checksum);
  writeUint32(view, 20, data.length);
  writeUint32(view, 24, data.length);
  writeUint16(view, 28, name.length);
  writeUint16(view, 30, 0);
  writeUint16(view, 32, 0);
  writeUint16(view, 34, 0);
  writeUint16(view, 36, 0);
  writeUint32(view, 38, 0);
  writeUint32(view, 42, localHeaderOffset);
  header.set(name, 46);

  return header;
}

function createEndOfCentralDirectory(
  entryCount: number,
  centralDirectorySize: number,
  centralDirectoryOffset: number
): Uint8Array {
  const footer = new Uint8Array(22);
  const view = new DataView(footer.buffer);

  writeUint32(view, 0, 0x06054b50);
  writeUint16(view, 4, 0);
  writeUint16(view, 6, 0);
  writeUint16(view, 8, entryCount);
  writeUint16(view, 10, entryCount);
  writeUint32(view, 12, centralDirectorySize);
  writeUint32(view, 16, centralDirectoryOffset);
  writeUint16(view, 20, 0);

  return footer;
}

function assertZip32Value(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0 || value > UINT32_MAX) {
    throw new Error(`ZIP ${label} is too large`);
  }
}

export async function createZipBlob(files: readonly ZipFile[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Cannot create an empty ZIP');
  }

  if (files.length > UINT16_MAX) {
    throw new Error('Too many files for ZIP');
  }

  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);

    if (name.length > UINT16_MAX) {
      throw new Error('ZIP file name is too long');
    }

    const data = new Uint8Array(await file.data.arrayBuffer());
    assertZip32Value(data.length, 'file size');

    const checksum = crc32(data);
    const localHeader = createLocalFileHeader(name, data, checksum);
    const centralHeader = createCentralDirectoryHeader(
      name,
      data,
      checksum,
      offset
    );

    localParts.push(localHeader, data);
    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
    assertZip32Value(offset, 'offset');
  }

  const centralDirectoryOffset = offset;
  const centralDirectorySize = centralParts.reduce(
    (size, part) => size + part.length,
    0
  );
  assertZip32Value(centralDirectorySize, 'central directory size');

  const footer = createEndOfCentralDirectory(
    files.length,
    centralDirectorySize,
    centralDirectoryOffset
  );

  return new Blob([...localParts, ...centralParts, footer], {
    type: 'application/zip',
  });
}
