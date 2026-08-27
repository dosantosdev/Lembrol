import Button from "../ui/Button.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import LembrolBrand from "../LembrolBrand.jsx";

export default function ProjectsSidebar() {
  const { projectsState, dispatch } = useProjectContext();
  const { t } = useLanguage();

  function handleStartAddProject() {
    dispatch({
      type: "START_ADD_PROJECT",
    });
  }

  function handleSelectProject(id) {
    dispatch({
      type: "SELECT_PROJECT",
      payload: id,
    });
  }

  return (
    <aside className="lembrol-sidebar">
      <div className="hidden lg:block">
        <LembrolBrand />
      </div>

      <div className="mt-6 lg:mt-10">
        <Button onClick={handleStartAddProject}>
          <span aria-hidden="true">+</span>
          {t("projects", "add")}
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/45">
          {t("projects", "title")}
        </h2>

        {projectsState.projects.length === 0 ? (
          <p className="text-sm leading-6 text-violet-100/45">
            {t("projects", "noProjects")}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {projectsState.projects.map((project) => {
              const isSelected =
                project.id === projectsState.selectedProjectId;

              return (
                <li key={project.id}>
                  <button
                    type="button"
                    className={`lembrol-project-link ${
                      isSelected ? "lembrol-project-link--active" : ""
                    }`}
                    onClick={() => handleSelectProject(project.id)}
                  >
                    <span className="truncate">{project.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
