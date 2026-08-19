import { useLanguage } from '../context/language';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
      role="group"
      aria-label="Language / 语言"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`min-h-[40px] rounded-md px-3 text-sm font-medium transition-colors ${
          language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('zh')}
        aria-pressed={language === 'zh'}
        className={`min-h-[40px] rounded-md px-3 text-sm font-medium transition-colors ${
          language === 'zh' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        中文
      </button>
    </div>
  );
}
