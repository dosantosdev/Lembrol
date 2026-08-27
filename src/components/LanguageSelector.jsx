import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  function handleChange(event) {
    setLanguage(event.target.value);
  }

  return (
    <select
      value={language}
      onChange={handleChange}
      className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 focus:outline-none"
    >
      <option value="pt-BR">Português (Brasil)</option>
      <option value="en-US">English (US)</option>
    </select>
  );
}
