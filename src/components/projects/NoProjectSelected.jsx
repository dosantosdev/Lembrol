import noProjectImage from "../../assets/no-projects.png";
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
    <div className="mt-24 text-center w-2/3">
      <img
        src={noProjectImage}
        alt={t("common", "imageAlt")}
        className="w-16 h-16 object-contain mx-auto"
      />

      <h2 className="text-xl font-bold text-stone-500 my-4">
        {t("projects", "noSelected")}
      </h2>

      <p className="text-stone-400 mb-4">
        {t("projects", "noSelectedDescription")}
      </p>

      <p className="mt-8">
        <Button onClick={handleStartAddProject}>
          {t("projects", "create")}
        </Button>
      </p>
    </div>
  );
}
