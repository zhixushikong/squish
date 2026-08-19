import { useLanguage } from '../context/language';

export function AdPlaceholder() {
  const { copy } = useLanguage();

  return (
    <section
      aria-label={copy.advertisement.label}
      className="flex min-h-[96px] w-full items-center justify-center border-y border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-center text-xs text-gray-500 sm:min-h-[90px]"
    >
      <span>{copy.advertisement.label}</span>
    </section>
  );
}
