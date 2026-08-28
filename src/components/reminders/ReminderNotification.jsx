import { useState } from "react";

import { useLanguage } from "../../i18n/LanguageContext.jsx";

import { useReminderContext } from "../../reminders/ReminderProvider.jsx";

import { useSettings } from "../../store/SettingsContext.jsx";

export default function ReminderNotification() {
  const {
    activeReminders,
    notificationOpen,
    notificationMode,
    dismissReminder,
    stopReminder,
    snoozeReminder,
    snoozeOptions,
  } = useReminderContext();

  const { settings } = useSettings();
  const { t } = useLanguage();

  const [snoozeOpen, setSnoozeOpen] = useState(false);

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
                  <span className="min-w-0 truncate font-medium">
                    {task.text}
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        className="text-xs text-violet-200 underline underline-offset-2 hover:text-white"
                        onClick={() => setSnoozeOpen((previous) => !previous)}
                      >
                        Adiar
                      </button>

                      {snoozeOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-lg border border-white/10 bg-stone-950/95 p-1 shadow-xl backdrop-blur">
                          {snoozeOptions.map((option) => (
                            <button
                              key={option.minutes}
                              type="button"
                              className="block w-full rounded-md px-3 py-2 text-left text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                              onClick={() => {
                                snoozeReminder(task.id, option.minutes);

                                setSnoozeOpen(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="text-xs text-violet-200 underline underline-offset-2 hover:text-white"
                      onClick={() => stopReminder(task.id)}
                    >
                      Parar
                    </button>

                    <button
                      type="button"
                      className="text-xs text-violet-200 underline underline-offset-2 hover:text-white"
                      onClick={() => dismissReminder(task.id)}
                    >
                      {t("common", "dismiss")}
                    </button>
                  </div>
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
