import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import logger from './logger';

/**
 * Interface for resource IDs used in .env file
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

/**
 * Class for managing environment variables
 */
export class EnvManager {
  /**
   * Generate .env.local file with resource IDs
   * @param ids Resource IDs to include in the file
   */
  static generateEnvFile(ids: ResourceIds): void {
    try {
      logger.info('Creating .env.local file with resource IDs...');

      const envContent = `# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

# Appwrite Init
NEXT_APPWRITE_KEY=${ids.apiKey}
NEXT_PUBLIC_APPWRITE_PROJECT=${ids.projectId}

# Appwrite Database
NEXT_PUBLIC_APPWRITE_DATABASE_ID=${ids.databaseId}
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=${ids.workspacesId}
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=${ids.membersId}
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=${ids.projectsId}
NEXT_PUBLIC_APPWRITE_TASKS_ID=${ids.tasksId}
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=${ids.imagesBucketId}
`;

      const envLocalPath = join(process.cwd(), '.env.local');
      writeFileSync(envLocalPath, envContent);
      logger.success(`Environment file created: ${envLocalPath}`);
    } catch (error) {
      logger.error(`Error creating .env file: ${error}`);
    }
  }
} 