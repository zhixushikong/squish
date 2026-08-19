import { useState, type Dispatch, type SetStateAction } from 'react';
import type { OutputType, CompressionOptions, ResizeMode } from '../types';
import type { Copy } from '../copy';
import { useLanguage } from '../context/language';

interface CompressionOptionsProps {
  options: CompressionOptions;
  outputType: OutputType;
  onOptionsChange: Dispatch<SetStateAction<CompressionOptions>>;
  onOutputTypeChange: (type: OutputType) => void;
}

const commonFormats = ['webp', 'jpeg', 'png'] as const;
const extraFormats = ['avif', 'jxl'] as const;

function FormatButton({
  format,
  meta,
  selected,
  onSelect,
}: {
  format: OutputType;
  meta: Copy['format'][OutputType];
  selected: boolean;
  onSelect: (type: OutputType) => void;
}) {
  const badge = 'badge' in meta ? meta.badge : undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(format)}
      aria-pressed={selected}
      className={`min-h-[44px] w-full min-w-0 rounded-xl border p-3 text-left transition-colors ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{meta.name}</span>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              format === 'webp'
                ? 'bg-blue-100 text-blue-700'
                : format === 'jpeg'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {badge}
          </span>
        )}
      </span>
      <span className="mt-1 block text-xs leading-5 text-gray-500">{meta.desc}</span>
    </button>
  );
}

export function CompressionOptions({
  options,
  outputType,
  onOptionsChange,
  onOutputTypeChange,
}: CompressionOptionsProps) {
  const { copy } = useLanguage();
  const resizeModes: ReadonlyArray<{ value: ResizeMode; label: string }> = [
    { value: 'original', label: copy.resize.original },
    { value: 'long-edge-1920', label: copy.resize.longEdge1920 },
    { value: 'long-edge-1280', label: copy.resize.longEdge1280 },
    { value: 'long-edge-800', label: copy.resize.longEdge800 },
    { value: 'custom', label: copy.resize.custom },
  ];

  const [showMore, setShowMore] = useState(
    extraFormats.includes(outputType as (typeof extraFormats)[number])
  );

  function formatMeta(format: OutputType) {
    return copy.format[format];
  }

  const updateOptions = (changes: Partial<CompressionOptions>) => {
    onOptionsChange((previous) => ({ ...previous, ...changes }));
  };

  const handleCustomWidthChange = (width: number) => {
    if (!options.maintainAspectRatio || !options.resizeWidth || !options.resizeHeight) {
      updateOptions({ resizeWidth: width });
      return;
    }

    updateOptions({
      resizeWidth: width,
      resizeHeight: Math.max(1, Math.round((width / options.resizeWidth) * options.resizeHeight)),
    });
  };

  const handleCustomHeightChange = (height: number) => {
    if (!options.maintainAspectRatio || !options.resizeWidth || !options.resizeHeight) {
      updateOptions({ resizeHeight: height });
      return;
    }

    updateOptions({
      resizeWidth: Math.max(1, Math.round((height / options.resizeHeight) * options.resizeWidth)),
      resizeHeight: height,
    });
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-sm font-medium text-gray-900">{copy.format.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{copy.format.hint}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {commonFormats.map((format) => (
          <FormatButton
            key={format}
            format={format}
            meta={formatMeta(format)}
            selected={outputType === format}
            onSelect={onOutputTypeChange}
          />
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowMore((value) => !value)}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          aria-expanded={showMore}
        >
          {showMore ? copy.format.hideMore : copy.format.more}
        </button>

        {showMore && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {extraFormats.map((format) => (
              <FormatButton
                key={format}
                format={format}
                meta={formatMeta(format)}
                selected={outputType === format}
                onSelect={onOutputTypeChange}
              />
            ))}
          </div>
        )}
      </div>

      {outputType !== 'png' && (
        <div>
          <label htmlFor="quality-range" className="mb-2 block text-sm font-medium text-gray-700">
            {copy.format.quality}：{options.quality}%
          </label>
          <input
            id="quality-range"
            type="range"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              updateOptions({ quality: Number(e.target.value) })
            }
            className="h-11 w-full"
          />
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <div>
          <h2 className="text-sm font-medium text-gray-900">{copy.resize.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{copy.resize.hint}</p>
        </div>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          <span className="sr-only">{copy.resize.title}</span>
          <select
            value={options.resizeMode}
            onChange={(e) => updateOptions({ resizeMode: e.target.value as ResizeMode })}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {resizeModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        {options.resizeMode === 'custom' && (
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm text-gray-700">
                {copy.resize.width}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={options.resizeWidth}
                  onChange={(e) => handleCustomWidthChange(Math.max(1, Number(e.target.value)))}
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
              <label className="text-sm text-gray-700">
                {copy.resize.height}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={options.resizeHeight}
                  onChange={(e) => handleCustomHeightChange(Math.max(1, Number(e.target.value)))}
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <label className="mt-3 flex min-h-[44px] items-center gap-2 py-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={options.maintainAspectRatio}
                onChange={(e) => updateOptions({ maintainAspectRatio: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span>{copy.resize.maintainAspectRatio}</span>
            </label>
            {options.maintainAspectRatio && (
              <p className="mt-1 text-xs text-gray-500">{copy.resize.aspectRatioHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
