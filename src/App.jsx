import { useReducer } from "react";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";
import projectReducer, { initialState } from "./store/projectReducer.js";

function App() {
  const [projectsState, dispatch] = useReducer(projectReducer, initialState);

  function handleAddProject(projectData) {
    const projectId = Math.random();

    dispatch({
      type: "ADD_PROJECT",
      payload: {
        ...projectData,
        id: projectId,
      },
    });
  }

  function handleStartAddProject() {
    dispatch({
      type: "START_ADD_PROJECT",
    });
  }

  function handleCancelAddProject() {
    dispatch({
      type: "CANCEL_ADD_PROJECT",
    });
  }

  function handleSelectProject(id) {
    dispatch({
      type: "SELECT_PROJECT",
      payload: id,
    });
  }

  function handleDeleteProject() {
    dispatch({
      type: "DELETE_PROJECT",
    });
  }

  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId,
  );

  let content = (
    <SelectedProject project={selectedProject} onDelete={handleDeleteProject} />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar
        onStartAddProject={handleStartAddProject}
        projects={projectsState.projects}
        onSelectProject={handleSelectProject}
        selectedProjectId={projectsState.selectedProjectId}
      />

      {content}
    </main>
  );
}

export default App;
