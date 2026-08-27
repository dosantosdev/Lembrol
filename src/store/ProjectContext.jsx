import { createContext, useContext, useReducer } from "react";
import projectReducer, { initialState } from "./projectReducer.js";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projectsState, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ projectsState, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  return useContext(ProjectContext);
}
