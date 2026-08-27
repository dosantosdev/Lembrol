import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import ReminderSettings from "../reminders/ReminderSettings.jsx";

export default function SettingsPanel() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="lembrol-icon-button"
        title={t("settings", "open")}
        aria-label={t("settings", "open")}
      >
        ⚙
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-40">
          <ReminderSettings />
        </div>
      )}
    </div>
  );
}
