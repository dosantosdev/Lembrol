import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useReminderContext } from "../../reminders/ReminderProvider.jsx";
import { useSettings } from "../../store/SettingsContext.jsx";

export default function ReminderNotification() {
  const { activeReminders, dismissReminder } = useReminderContext();

  const { settings } = useSettings();
  const { t } = useLanguage();

  if (!settings.reminders.visual || activeReminders.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50 w-80 rounded-xl bg-red-700 p-4 text-white shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
          <span className="absolute h-7 w-7 rounded-full bg-red-400 opacity-40 animate-ping" />

          <span className="absolute h-5 w-5 rounded-full bg-red-300 opacity-70 animate-pulse" />

          <span className="relative h-4 w-4 rounded-full bg-red-200 shadow-lg" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">{t("reminders", "title")}</h2>

            <span className="text-xs font-semibold uppercase tracking-wide text-red-200">
              Lembrol
            </span>
          </div>

          <p className="mt-1 text-sm">{t("reminders", "message")}</p>

          <ul className="mt-3 space-y-3">
            {activeReminders.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-md bg-red-800/50 p-2"
              >
                <span className="font-medium">{task.text}</span>

                <button
                  type="button"
                  className="shrink-0 text-sm underline hover:text-stone-200"
                  onClick={() => dismissReminder(task.id)}
                >
                  {t("common", "dismiss")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
