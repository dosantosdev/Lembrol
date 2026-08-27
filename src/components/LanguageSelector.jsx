import { useLanguage } from "../i18n/LanguageContext.jsx";
import { requestNotificationPermission } from "../reminders/notificationService.js";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  async function handleNotificationPermission() {
    await requestNotificationPermission();
  }

  function handleChange(event) {
    setLanguage(event.target.value);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={handleChange}
        className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 focus:outline-none"
      >
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en-US">English (US)</option>
      </select>

      <button
        type="button"
        onClick={handleNotificationPermission}
        className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 hover:bg-stone-300"
        title="Notifications"
      >
        🔔
      </button>
    </div>
  );
}
