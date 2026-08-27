import { createContext, useContext, useEffect, useReducer } from "react";
import projectReducer, { initialState } from "./projectReducer.js";
import { loadData, saveData } from "../utils/storage.js";

const ProjectContext = createContext();

function getInitialState() {
  const storedData = loadData();

  if (!storedData) {
    return initialState;
  }

  return {
    ...initialState,
    ...storedData,
  };
}

export function ProjectProvider({ children }) {
  const [projectsState, dispatch] = useReducer(
    projectReducer,
    undefined,
    getInitialState,
  );

  useEffect(() => {
    saveData(projectsState);
  }, [projectsState]);

  return (
    <ProjectContext.Provider value={{ projectsState, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  return useContext(ProjectContext);
}
