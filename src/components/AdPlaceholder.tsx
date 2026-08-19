import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/language';

const adsenseClient = 'ca-pub-7021994228287004';

type AdsByGoogleCommand = Record<string, never>;

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleCommand[];
  }
}

interface AdPlaceholderProps {
  slot: string;
}

export function AdPlaceholder({ slot }: AdPlaceholderProps) {
  const { copy } = useLanguage();
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;

    try {
      const adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle = adsbygoogle;
      adsbygoogle.push({});
    } catch {
      pushedRef.current = false;
    }
  }, [slot]);

  return (
    <section
      aria-label={copy.advertisement.label}
      className="w-full border-y border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 text-center"
    >
      <span className="mb-2 block text-xs text-gray-500">{copy.advertisement.label}</span>
      <ins
        className="adsbygoogle block min-h-[96px] w-full sm:min-h-[90px]"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
