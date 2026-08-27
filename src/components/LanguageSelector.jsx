import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useReminderContext } from "../reminders/ReminderProvider.jsx";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const {
    activeReminders,
    notificationOpen,
    openNotifications,
    closeNotifications,
  } = useReminderContext();

  function handleNotificationClick() {
    if (notificationOpen) {
      closeNotifications();
      return;
    }

    openNotifications();
  }

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="lembrol-select lembrol-language-select"
      >
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en-US">English (US)</option>
      </select>

      <button
        type="button"
        onClick={handleNotificationClick}
        className="lembrol-icon-button relative"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={notificationOpen}
      >
        🔔
        {activeReminders.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-violet-950 bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-lg">
            {activeReminders.length > 9 ? "9+" : activeReminders.length}
          </span>
        )}
      </button>
    </div>
  );
}
