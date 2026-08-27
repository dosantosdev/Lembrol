import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ProjectProgress({ tasks }) {
  const { t } = useLanguage();

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="mt-6 rounded-md bg-stone-100 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-700">
          {t("projects", "progress")}
        </h2>

        <span className="text-sm font-medium text-stone-500">{progress}%</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-300">
        <div
          className="h-full rounded-full bg-stone-700 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex gap-4 text-sm text-stone-500">
        <span>
          {totalTasks} {t("projects", "totalTasks")}
        </span>

        <span>
          {completedTasks} {t("projects", "completedTasks")}
        </span>
      </div>
    </div>
  );
}
