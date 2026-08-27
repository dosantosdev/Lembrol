import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import { generateId } from "../../utils/id.js";
import NewTask from "./NewTask.jsx";

export default function Tasks({ projectId }) {
  const { projectsState, dispatch } = useProjectContext();
  const { t, language } = useLanguage();

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectId,
  );

  function handleAddTask(taskData) {
    dispatch({
      type: "ADD_TASK",
      payload: {
        ...taskData,
        id: generateId(),
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

  function handleToggleTask(id) {
    dispatch({
      type: "TOGGLE_TASK",
      payload: id,
    });
  }

  function formatTaskDate(date) {
    if (!date) {
      return null;
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <li
              key={task.id}
              className="flex justify-between items-start my-4 gap-4"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="mt-1"
                />

                <div>
                  <span
                    className={
                      task.completed
                        ? "line-through text-stone-400"
                        : "text-stone-800"
                    }
                  >
                    {task.text}
                  </span>

                  {task.completed && (
                    <div className="text-sm text-stone-400 mt-1">
                      {t("tasks", "completed")}
                    </div>
                  )}

                  {(task.dueDate || task.dueTime) && (
                    <div className="text-sm text-stone-400 mt-1">
                      {task.dueDate && formatTaskDate(task.dueDate)}

                      {task.dueDate && task.dueTime && " • "}

                      {task.dueTime}
                    </div>
                  )}
                </div>
              </div>

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
