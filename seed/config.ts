export const DATABASE_NAME = 'app-organify-database';
export const STORAGE_NAME = 'app-organify-images';

// Имена коллекций
export const COLLECTIONS = {
  WORKSPACES: 'workspaces',
  MEMBERS: 'members',
  PROJECTS: 'projects',
  TASKS: 'tasks'
} as const;

// Роли участников
export const MEMBER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
} as const;

// Статусы задач
export const TASK_STATUS = {
  BACKLOG: 'BACKLOG',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DONE: 'DONE'
} as const;

// Конфигурация .env файла
export const ENV_CONFIG = {
  APP_URL: 'http://localhost:3000',
  APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
  TEMPLATE: `# App Settings
NEXT_PUBLIC_APP_URL={{APP_URL}}
NEXT_PUBLIC_APPWRITE_ENDPOINT={{APPWRITE_ENDPOINT}}

# Appwrite Init
NEXT_APPWRITE_KEY={{API_KEY}}
NEXT_PUBLIC_APPWRITE_PROJECT={{PROJECT_ID}}

# Appwrite Database
NEXT_PUBLIC_APPWRITE_DATABASE_ID={{DATABASE_ID}}
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID={{WORKSPACES_ID}}
NEXT_PUBLIC_APPWRITE_MEMBERS_ID={{MEMBERS_ID}}
NEXT_PUBLIC_APPWRITE_PROJECTS_ID={{PROJECTS_ID}}
NEXT_PUBLIC_APPWRITE_TASKS_ID={{TASKS_ID}}
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID={{IMAGES_BUCKET_ID}}
`
} as const; 