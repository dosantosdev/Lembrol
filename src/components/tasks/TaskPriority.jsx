import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function TaskPriority({ priority }) {
  const { t } = useLanguage();

  const priorityConfig = {
    high: {
      label: t("tasks", "priorityHigh"),
      className: "lembrol-priority--high",
    },
    medium: {
      label: t("tasks", "priorityMedium"),
      className: "lembrol-priority--medium",
    },
    low: {
      label: t("tasks", "priorityLow"),
      className: "lembrol-priority--low",
    },
  };

  const currentPriority =
    priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`lembrol-priority ${currentPriority.className}`}>
      <span className="lembrol-priority__dot" />
      {currentPriority.label}
    </span>
  );
}
