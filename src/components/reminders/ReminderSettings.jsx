import { useEffect } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useReminderContext } from "../../reminders/ReminderProvider.jsx";

const SETTINGS_STORAGE_KEY = "lembrol-reminder-settings";

export default function ReminderSettings() {
  const { t } = useLanguage();
  const { settings, setSettings } = useReminderContext();

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function handleChange(setting) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [setting]: !previousSettings[setting],
    }));
  }

  return (
    <section className="w-72 rounded-lg bg-stone-100 p-4 shadow-md">
      <h2 className="font-bold text-stone-700">{t("settings", "title")}</h2>

      <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.notification}
            onChange={() => handleChange("notification")}
            className="h-4 w-4"
          />

          <span>{t("settings", "notification")}</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={() => handleChange("sound")}
            className="h-4 w-4"
          />

          <span>{t("settings", "sound")}</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.visual}
            onChange={() => handleChange("visual")}
            className="h-4 w-4"
          />

          <span>{t("settings", "visual")}</span>
        </label>
      </div>
    </section>
  );
}
