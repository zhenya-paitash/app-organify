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
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />

      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full  overflow-y-auto">
          <Sidebar />
        </div>

        <div className="w-full lg:pl-[264px]">
          <Navbar />
          <div className="mx-auto max-w-screen-2xl h-full">
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout
