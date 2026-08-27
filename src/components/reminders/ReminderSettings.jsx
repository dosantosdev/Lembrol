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
    <section className="lembrol-settings-panel">
      <div className="lembrol-settings-heading">
        <span className="lembrol-settings-symbol">✦</span>
        <h2>{t("settings", "title")}</h2>
      </div>

      <div className="mt-4 space-y-3">
        {[
          ["notification", t("settings", "notification")],
          ["sound", t("settings", "sound")],
          ["visual", t("settings", "visual")],
        ].map(([setting, label]) => (
          <label key={setting} className="lembrol-setting-row">
            <input
              type="checkbox"
              checked={settings.reminders[setting]}
              onChange={() => handleChange(setting)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
