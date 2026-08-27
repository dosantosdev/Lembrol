import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import Button from "../ui/Button.jsx";

export default function NoProjectSelected() {
  const { dispatch } = useProjectContext();
  const { t } = useLanguage();

  function handleStartAddProject() {
    dispatch({
      type: "START_ADD_PROJECT",
    });
  }

  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold text-stone-700">
        {t("projects", "noSelected")}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-stone-500">
        {t("projects", "noSelectedDescription")}
      </p>

      <div className="mt-6">
        <Button onClick={handleStartAddProject}>{t("projects", "add")}</Button>
      </div>
    </div>
  );
}
