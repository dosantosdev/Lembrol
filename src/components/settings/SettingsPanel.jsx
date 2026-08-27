import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import ReminderSettings from "../reminders/ReminderSettings.jsx";

export default function SettingsPanel() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((previous) => !previous);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="px-3 py-2 rounded-md bg-stone-200 text-stone-700 hover:bg-stone-300"
        title={t("settings", "open")}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-40">
          <ReminderSettings />
        </div>
      )}
    </div>
  );
}
