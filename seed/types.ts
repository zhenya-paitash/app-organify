/**
 * Environment variables for Appwrite
 */
export interface AppwriteEnv {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
  NEXT_PUBLIC_APPWRITE_PROJECT: string;
  NEXT_APPWRITE_KEY: string;
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: string;
  NEXT_PUBLIC_APPWRITE_WORKSPACES_ID: string;
  NEXT_PUBLIC_APPWRITE_MEMBERS_ID: string;
  NEXT_PUBLIC_APPWRITE_PROJECTS_ID: string;
  NEXT_PUBLIC_APPWRITE_TASKS_ID: string;
  NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID: string;
}

/**
 * User data interface
 */
export interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

/**
 * Workspace data interface
 */
export interface Workspace {
  name: string;
  imageUrl?: string;
}

/**
 * Project data interface
 */
export interface Project {
  name: string;
  workspace: string;
  imageUrl?: string;
}

/**
 * Task data interface
 */
export interface Task {
  name: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  dueDate: string;
  project: string;
  executor: string;
  description?: string;
}

/**
 * Member data interface
 */
export interface Member {
  email: string;
  workspace: string;
  role: 'ADMIN' | 'MEMBER';
}

/**
 * Resource IDs for Appwrite collections and buckets
 */
export interface ResourceIds {
  projectId: string;
  apiKey: string;
  databaseId: string;
  workspacesId: string;
  membersId: string;
  projectsId: string;
  tasksId: string;
  imagesBucketId: string;
}

export interface SeedConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  workspacesId: string;
  membersId: string;
  projectsId: string;
  tasksId: string;
  imagesBucketId: string;
  apiKey: string;
} 