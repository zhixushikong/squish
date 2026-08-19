import { useEffect, useState } from 'react';
import { useLanguage } from '../context/language';

export function SiteFooter() {
  const { copy } = useLanguage();
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (!copyFeedback) return;

    const timeoutId = window.setTimeout(() => {
      setCopyFeedback(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [copyFeedback]);

  const handleCopyEmail = async () => {
    const email = copy.footer.contactEmail;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyFeedback(true);
    } catch {
      setCopyFeedback(false);
    }
  };

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <section id="privacy" aria-labelledby="privacy-title">
          <h2 id="privacy-title" className="text-base font-semibold text-gray-900">
            {copy.privacy.title}
          </h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-gray-600">
            {copy.privacy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="thanks-title">
          <h2 id="thanks-title" className="text-base font-semibold text-gray-900">
            {copy.footer.thanksTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{copy.footer.thanks}</p>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="space-y-3">
          <h2 id="contact-title" className="text-base font-semibold text-gray-900">
            {copy.footer.contactTitle}
          </h2>
          <p className="text-sm leading-6 text-gray-600">
            {copy.footer.contactLabel}: <span className="font-medium text-gray-900">{copy.footer.contactEmail}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-[40px] rounded-lg border border-gray-200 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              {copy.footer.copyEmail}
            </button>
            <span
              className="text-xs text-gray-500"
              aria-live="polite"
            >
              {copyFeedback ? copy.footer.copied : ''}
            </span>
            <a
              href={`mailto:${copy.footer.contactEmail}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {copy.footer.contactLink}
            </a>
          </div>
        </section>

        <nav className="flex flex-wrap gap-4 text-sm text-gray-500" aria-label={copy.footer.navLabel}>
          <a href="#privacy" className="hover:text-gray-800">
            {copy.footer.privacyLink}
          </a>
          <a href="#faq" className="hover:text-gray-800">
            {copy.footer.faqLink}
          </a>
          <a href="#contact" className="hover:text-gray-800">
            {copy.footer.contactLink}
          </a>
        </nav>

        <p className="text-xs text-gray-500">{copy.footer.copyright}</p>
      </div>
    </footer>
  );
}
