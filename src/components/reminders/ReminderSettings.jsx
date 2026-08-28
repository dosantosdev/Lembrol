import { useLanguage } from "../../i18n/LanguageContext.jsx";
import {
  testReminderSound,
  stopReminderSound,
} from "../../reminders/soundService.js";
import { useSettings } from "../../store/SettingsContext.jsx";

export default function ReminderSettings() {
  const { t } = useLanguage();

  const { settings, updateReminderSettings } = useSettings();

  const reminderSettings = settings.reminders;

  function handleChange(setting) {
    updateReminderSettings({
      [setting]: !reminderSettings[setting],
    });
  }

  async function handleSelectCustomSound() {
    if (!window.electronAPI?.selectCustomSound) {
      console.error("A seleção de áudio do Electron não está disponível.");

      return;
    }

    const selectedSound = await window.electronAPI.selectCustomSound();

    if (!selectedSound) {
      return;
    }

    updateReminderSettings({
      soundType: "custom",
      customSound: selectedSound.path,
      customSoundName: selectedSound.name,
    });
  }

  async function handleTestSound() {
    await testReminderSound(
      reminderSettings.soundType || "lembrol",
      reminderSettings.customSound,
    );
  }

  function handleStopSound() {
    stopReminderSound();
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
              checked={reminderSettings[setting]}
              onChange={() => handleChange(setting)}
            />

            <span>{label}</span>
          </label>
        ))}
      </div>

      {reminderSettings.sound && (
        <div className="mt-5 space-y-3">
          <div>
            <label
              htmlFor="lembrol-sound-type"
              className="mb-2 block text-xs font-semibold text-violet-200/70"
            >
              {t("settings", "soundType")}
            </label>

            <select
              id="lembrol-sound-type"
              className="lembrol-input w-full"
              value={reminderSettings.soundType || "lembrol"}
              onChange={(event) =>
                updateReminderSettings({
                  soundType: event.target.value,
                })
              }
            >
              <option value="lembrol">{t("settings", "soundLembrol")}</option>

              <option value="system">{t("settings", "soundWindows")}</option>

              <option value="alarm">{t("settings", "soundAlarm")}</option>

              <option value="custom">{t("settings", "soundCustom")}</option>
            </select>
          </div>

          {reminderSettings.soundType === "custom" && (
            <div className="space-y-2">
              <button
                type="button"
                className="lembrol-secondary-button w-full"
                onClick={handleSelectCustomSound}
              >
                {reminderSettings.customSound
                  ? t("settings", "changeAudio")
                  : t("settings", "chooseAudio")}
              </button>

              {reminderSettings.customSound && (
                <p className="truncate text-xs text-violet-200/50">
                  {reminderSettings.customSoundName ||
                    reminderSettings.customSound}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              className="lembrol-secondary-button flex-1"
              onClick={handleTestSound}
            >
              {t("settings", "testSound")}
            </button>

            <button
              type="button"
              className="lembrol-danger-button"
              onClick={handleStopSound}
            >
              {t("settings", "stopSound")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
