import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { TaskByIdClient } from './client';

const TaskByIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <TaskByIdClient />
}

export default TaskByIdPage
