import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import logger from './logger';

/**
 * Data types for CSV files
 */
export interface UserCSV {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface WorkspaceCSV {
  name: string;
  imageUrl?: string;
}

export interface ProjectCSV {
  name: string;
  workspace: string;
  imageUrl?: string;
}

export interface TaskCSV {
  name: string;
  project: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  dueDate: string;
  description?: string;
  executor: string;
}

export interface MemberCSV {
  email: string;
  workspace: string;
  role: 'ADMIN' | 'MEMBER';
}

/**
 * Class for loading and processing CSV files
 */
export class CsvLoader {
  /**
   * Load and parse CSV file
   * @param filePath Path to CSV file
   * @returns Array of objects with parsed CSV data
   */
  static loadCsv<T>(filePath: string): T[] {
  try {
    if (!existsSync(filePath)) {
        logger.error(`File not found: ${filePath}`);
      return [];
    }

    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
        logger.error(`File ${filePath} is empty`);
      return [];
    }

    const headers = lines[0].split(',').map(header => header.trim());

      return lines.slice(1).map(line => {
        // Use a more reliable CSV parsing approach
        const values: string[] = [];
        let inQuote = false;
        let currentValue = '';

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }

        // Don't forget the last value
        values.push(currentValue.trim());

      const record: Record<string, string> = {};

      headers.forEach((header, index) => {
          // Make sure we don't go out of bounds
          record[header] = index < values.length ? values[index] : '';
      });

      return record as unknown as T;
    });
  } catch (error) {
      logger.error(`Error loading data from ${filePath}: ${error}`);
    return [];
  }
}

/**
   * Load all CSV files from data directory
   * @returns Object containing all loaded data
 */
  static loadAllCsvData() {
    const dataDir = join(process.cwd(), 'seed', 'data');

  return {
      users: this.loadCsv<UserCSV>(join(dataDir, 'users.csv')),
      workspaces: this.loadCsv<WorkspaceCSV>(join(dataDir, 'workspaces.csv')),
      members: this.loadCsv<MemberCSV>(join(dataDir, 'members.csv')),
      projects: this.loadCsv<ProjectCSV>(join(dataDir, 'projects.csv')),
      tasks: this.loadCsv<TaskCSV>(join(dataDir, 'tasks.csv'))
  };
  }
} 