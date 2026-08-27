import { useProjectContext } from "./store/ProjectContext.jsx";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";

function App() {
  const { projectsState } = useProjectContext();

  let content;

  if (projectsState.selectedProjectId === null) {
    content = <NewProject />;
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected />;
  } else {
    content = <SelectedProject />;
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar />
      {content}
    </main>
  );
}

export default App;
