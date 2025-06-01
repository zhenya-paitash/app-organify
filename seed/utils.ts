import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import logger from './logger';
import { ENV_CONFIG } from './config';

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
 * Utility class with helper methods
 */
export class Utils {
  /**
   * Validate password against Appwrite requirements
   * @param password Password to validate
   * @returns Validation result with success flag and message
   */
  static validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Za-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true, message: 'Password meets requirements' };
  }

  /**
   * Generate random invite code
   * @param length Length of the code (default: 10)
   * @returns Random alphanumeric string
   */
  static generateInviteCode(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate .env.local file with resource IDs
   * @param ids Resource IDs to include in the file
   */
  static generateEnvFile(ids: ResourceIds): void {
    try {
      logger.info('Creating .env.local file with resource IDs...');

      const envContent = ENV_CONFIG.TEMPLATE
        .replace('{{APP_URL}}', ENV_CONFIG.APP_URL)
        .replace('{{APPWRITE_ENDPOINT}}', ENV_CONFIG.APPWRITE_ENDPOINT)
        .replace('{{API_KEY}}', ids.apiKey)
        .replace('{{PROJECT_ID}}', ids.projectId)
        .replace('{{DATABASE_ID}}', ids.databaseId)
        .replace('{{WORKSPACES_ID}}', ids.workspacesId)
        .replace('{{MEMBERS_ID}}', ids.membersId)
        .replace('{{PROJECTS_ID}}', ids.projectsId)
        .replace('{{TASKS_ID}}', ids.tasksId)
        .replace('{{IMAGES_BUCKET_ID}}', ids.imagesBucketId);

      const envLocalPath = join(process.cwd(), '.env.local');
      writeFileSync(envLocalPath, envContent);
      logger.success(`Environment file created: ${envLocalPath}`);
    } catch (error) {
      logger.error(`Error creating .env file: ${error}`);
    }
  }
} 