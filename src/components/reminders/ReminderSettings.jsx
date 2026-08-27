import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useSettings } from "../../store/SettingsContext.jsx";

export default function ReminderSettings() {
  const { t } = useLanguage();
  const { settings, updateReminderSettings } = useSettings();

  function handleChange(setting) {
    updateReminderSettings({
      [setting]: !settings.reminders[setting],
    });
  }

  return (
    <section className="w-72 rounded-lg bg-stone-100 p-4 shadow-md">
      <h2 className="font-bold text-stone-700">{t("settings", "title")}</h2>

      <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.reminders.notification}
            onChange={() => handleChange("notification")}
            className="h-4 w-4"
          />

          <span>{t("settings", "notification")}</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.reminders.sound}
            onChange={() => handleChange("sound")}
            className="h-4 w-4"
          />

          <span>{t("settings", "sound")}</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={settings.reminders.visual}
            onChange={() => handleChange("visual")}
            className="h-4 w-4"
          />

          <span>{t("settings", "visual")}</span>
        </label>
      </div>
    </section>
  );
}
