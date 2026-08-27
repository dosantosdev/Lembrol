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
        projects: [...state.projects, action.payload],
        selectedProjectId: undefined,
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

    case "SELECT_PROJECT":
      return {
        ...state,
        selectedProjectId: action.payload,
      };

    case "DELETE_PROJECT": {
      const projectId = state.selectedProjectId;

      return {
        ...state,
        selectedProjectId: undefined,
        projects: state.projects.filter((project) => project.id !== projectId),
        tasks: state.tasks.filter((task) => task.projectId !== projectId),
      };
    }

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    default:
      return state;
  }
}
