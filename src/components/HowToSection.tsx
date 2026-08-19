import { useLanguage } from '../context/language';

export function HowToSection() {
  const { copy } = useLanguage();
  return (
    <section id="how-to" className="rounded-xl bg-white p-6 shadow-sm" aria-labelledby="how-to-title">
      <h2 id="how-to-title" className="text-lg font-semibold text-gray-900">
        {copy.howTo.title}
      </h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">
        {copy.howTo.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
