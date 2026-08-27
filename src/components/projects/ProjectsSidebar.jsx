import Button from "../ui/Button.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";

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
    <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
      <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-200">
        {t("projects", "title")}
      </h2>

      <div>
        <Button onClick={handleStartAddProject}>
          + {t("projects", "add")}
        </Button>
      </div>

      <ul className="mt-8">
        {projectsState.projects.map((project) => {
          let cssClasses =
            "w-full text-left px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800";

          if (project.id === projectsState.selectedProjectId) {
            cssClasses += " bg-stone-800 text-stone-200";
          } else {
            cssClasses += " text-stone-400";
          }

          return (
            <li key={project.id}>
              <button
                className={cssClasses}
                onClick={() => handleSelectProject(project.id)}
              >
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
