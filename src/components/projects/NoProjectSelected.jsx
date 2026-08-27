import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import Button from "../ui/Button.jsx";
import LembrolBrand from "../LembrolBrand.jsx";

export default function NoProjectSelected() {
  const { dispatch } = useProjectContext();
  const { t } = useLanguage();

  function handleStartAddProject() {
    dispatch({
      type: "START_ADD_PROJECT",
    });
  }

  return (
    <div className="lembrol-empty-state">
      <LembrolBrand />

      <h2 className="mt-8 text-2xl font-bold text-slate-100">
        {t("projects", "noSelected")}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {t("projects", "noSelectedDescription")}
      </p>

      <div className="mt-6">
        <Button onClick={handleStartAddProject}>
          {t("projects", "add")}
        </Button>
      </div>
    </div>
  );
}
