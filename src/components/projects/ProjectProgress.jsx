import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ProjectProgress({ tasks }) {
  const { t } = useLanguage();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="lembrol-progress-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="lembrol-section-kicker">{t("projects", "progress")}</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">
            {progress}%
          </h2>
        </div>

        <div className="lembrol-progress-orb">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-amber-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {totalTasks === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{t("projects", "noTasks")}</p>
      ) : (
        <div className="mt-3 flex gap-4 text-sm text-slate-400">
          <span>
            {totalTasks} {t("projects", "totalTasks")}
          </span>

          <span>
            {completedTasks} {t("projects", "completedTasks")}
          </span>
        </div>
      )}
    </div>
  );
}
