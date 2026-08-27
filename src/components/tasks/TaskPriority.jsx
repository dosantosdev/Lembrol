import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function TaskPriority({ priority }) {
  const { t } = useLanguage();

  const priorityConfig = {
    high: {
      label: t("tasks", "priorityHigh"),
      color: "bg-red-500",
    },
    medium: {
      label: t("tasks", "priorityMedium"),
      color: "bg-yellow-400",
    },
    low: {
      label: t("tasks", "priorityLow"),
      color: "bg-green-500",
    },
  };

  const currentPriority = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
      <span className={`h-2.5 w-2.5 rounded-full ${currentPriority.color}`} />

      {currentPriority.label}
    </span>
  );
}
