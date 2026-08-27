import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useReminderContext } from "../../reminders/ReminderProvider.jsx";
import { useSettings } from "../../store/SettingsContext.jsx";

export default function ReminderNotification() {
  const {
    activeReminders,
    notificationOpen,
    notificationMode,
    dismissReminder,
  } = useReminderContext();

  const { settings } = useSettings();
  const { t } = useLanguage();

  if (!notificationOpen) {
    return null;
  }

  if (!settings.reminders.visual) {
    return null;
  }

  const notificationClassName =
    notificationMode === "bell"
      ? "lembrol-notification lembrol-notification--bell"
      : "lembrol-notification lembrol-notification--alert";

  return (
    <div className={notificationClassName}>
      <div className="lembrol-notification__orb">
        <span />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-white">
            {activeReminders.length > 0
              ? t("reminders", "title")
              : t("reminders", "emptyTitle")}
          </h2>

          <span className="text-[10px] font-bold tracking-[0.2em] text-violet-200/60">
            LEMBROL
          </span>
        </div>

        {activeReminders.length > 0 ? (
          <>
            <p className="mt-1 text-sm text-white/75">
              {t("reminders", "message")}
            </p>

            <ul className="mt-3 space-y-2">
              {activeReminders.map((task) => (
                <li key={task.id} className="lembrol-notification__task">
                  <span className="truncate font-medium">{task.text}</span>

                  <button
                    type="button"
                    className="shrink-0 text-xs text-violet-200 underline underline-offset-2 hover:text-white"
                    onClick={() => dismissReminder(task.id)}
                  >
                    {t("common", "dismiss")}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-1 text-sm text-white/75">
            {t("reminders", "empty")}
          </p>
        )}
      </div>
    </div>
  );
}
