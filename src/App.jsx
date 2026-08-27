import { useProjectContext } from "./store/ProjectContext.jsx";
import NewProject from "./components/projects/NewProject.jsx";
import NoProjectSelected from "./components/projects/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/projects/ProjectsSidebar.jsx";
import SelectedProject from "./components/projects/SelectedProject.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import ReminderNotification from "./components/reminders/ReminderNotification.jsx";
import SettingsPanel from "./components/settings/SettingsPanel.jsx";

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

      <div className="flex-1 relative">
        <div className="absolute top-0 right-8 flex items-center gap-2">
          <LanguageSelector />
          <SettingsPanel />
        </div>

        {content}
      </div>

      <ReminderNotification />
    </main>
  );
}

export default App;
