import { copy } from '../copy/zh';

export function FaqSection() {
  return (
    <section id="faq" className="rounded-xl bg-white p-6 shadow-sm" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-lg font-semibold text-gray-900">
        {copy.faq.title}
      </h2>
      <dl className="mt-4 space-y-5">
        {copy.faq.items.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-medium text-gray-900">{item.q}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-600">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
