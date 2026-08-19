import { useLanguage } from '../context/language';

export function AboutSection() {
  const { copy } = useLanguage();

  return (
    <section id="about" className="rounded-xl bg-white p-6 shadow-sm" aria-labelledby="about-title">
      <h2 id="about-title" className="text-lg font-semibold text-gray-900">
        {copy.about.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-600">{copy.about.body}</p>
    </section>
  );
}
