export const initialState = {
  selectedProjectId: undefined,
  projects: [],
  tasks: [],
};

export default function projectReducer(state, action) {
  switch (action.type) {
    case "ADD_PROJECT":
      return {
        ...state,
        selectedProjectId: undefined,
        projects: [...state.projects, action.payload],
      };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? {
                ...project,
                ...action.payload,
              }
            : project,
        ),
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        selectedProjectId: undefined,
        projects: state.projects.filter(
          (project) => project.id !== state.selectedProjectId,
        ),
        tasks: state.tasks.filter(
          (task) => task.projectId !== state.selectedProjectId,
        ),
      };

    case "SELECT_PROJECT":
      return {
        ...state,
        selectedProjectId: action.payload,
      };

    case "START_ADD_PROJECT":
      return {
        ...state,
        selectedProjectId: null,
      };

    case "CANCEL_ADD_PROJECT":
      return {
        ...state,
        selectedProjectId: undefined,
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                ...action.payload,
              }
            : task,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : null,
              }
            : task,
        ),
      };

    default:
      return state;
  }
}
