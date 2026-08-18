import { copy } from '../copy/zh';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <section id="privacy" aria-labelledby="privacy-title">
          <h2 id="privacy-title" className="text-base font-semibold text-gray-900">
            {copy.privacy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{copy.privacy.body}</p>
        </section>

        <section aria-labelledby="thanks-title">
          <h2 id="thanks-title" className="text-base font-semibold text-gray-900">
            {copy.footer.thanksTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{copy.footer.thanks}</p>
        </section>

        <nav className="flex flex-wrap gap-4 text-sm text-gray-500" aria-label="页脚导航">
          <a href="#privacy" className="hover:text-gray-800">
            {copy.footer.privacyLink}
          </a>
          <a href="#faq" className="hover:text-gray-800">
            {copy.footer.faqLink}
          </a>
        </nav>

        <p className="text-xs text-gray-400">{copy.footer.copyright}</p>
      </div>
    </footer>
  );
}
