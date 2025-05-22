import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import CreateProjectModal from "@/features/projects/components/create-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import EditTaskModal from "@/features/tasks/components/edit-task-modal";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen overflow-hidden bg-primary/10">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />

      <div className="absolute inset-0 bg-noise-light bg-repeat bg-auto filter invert opacity-20 dark:opacity-10 dark:filter-none pointer-events-none z-0" />

      <div className="flex w-full h-full relative z-10">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>

        <div className="w-full h-full lg:pl-[264px] overflow-hidden">
          <div className="h-full lg:p-2 overflow-hidden">
            <div className="h-full lg:rounded-xl lg:shadow overflow-auto bg-background">
              <Navbar />
              <div className="mx-auto max-w-screen-2xl">
                <main className="py-8 px-6 flex flex-col">{children}</main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout
