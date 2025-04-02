import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TaskPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  )
}

export default TaskPage
