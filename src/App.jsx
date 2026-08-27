import { useProjectContext } from "./store/ProjectContext.jsx";
import NewProject from "./components/projects/NewProject.jsx";
import NoProjectSelected from "./components/projects/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/projects/ProjectsSidebar.jsx";
import SelectedProject from "./components/projects/SelectedProject.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import ReminderNotification from "./components/reminders/ReminderNotification.jsx";
import SettingsPanel from "./components/settings/SettingsPanel.jsx";
import LembrolBrand from "./components/LembrolBrand.jsx";

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
    <main className="min-h-screen p-3 md:p-5 lg:p-6">
      <div className="lembrol-shell min-h-[calc(100vh-1.5rem)] overflow-hidden">
        <ProjectsSidebar />

        <section className="relative min-w-0 flex-1">
          <header className="lembrol-topbar">
            <div className="lg:hidden">
              <LembrolBrand compact />
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />

              <div className="lembrol-notification-wrapper">
                <ReminderNotification />
              </div>

              <SettingsPanel />
            </div>
          </header>

          <div className="lembrol-content">{content}</div>
        </section>
      </div>
    </main>
  );
}

export default App;
