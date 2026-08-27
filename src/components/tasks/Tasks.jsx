import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import NewTask from "./NewTask.jsx";

export default function Tasks({ projectId }) {
  const { projectsState, dispatch } = useProjectContext();
  const { t } = useLanguage();

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectId,
  );

  function handleAddTask(text) {
    const taskId = Math.random();

    dispatch({
      type: "ADD_TASK",
      payload: {
        text,
        id: taskId,
        projectId,
      },
    });
  }

  function handleDeleteTask(id) {
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">
        {t("tasks", "title")}
      </h2>

      <NewTask onAdd={handleAddTask} />

      {projectTasks.length === 0 && (
        <p className="text-stone-800 my-4">{t("tasks", "empty")}</p>
      )}

      {projectTasks.length > 0 && (
        <ul className="p-4 mt-8 rounded-md bg-stone-100">
          {projectTasks.map((task) => (
            <li key={task.id} className="flex justify-between my-4">
              <span>{task.text}</span>

              <button
                className="text-stone-700 hover:text-red-500"
                onClick={() => handleDeleteTask(task.id)}
              >
                {t("common", "clear")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
