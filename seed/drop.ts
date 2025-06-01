import { Client, Databases, Storage, Users, Query } from 'node-appwrite';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import logger from './logger';
import { DATABASE_NAME, STORAGE_NAME } from './config';

/**
 * Class for dropping all Appwrite resources
 */
class AppwriteDropper {
  private client: Client;
  private databases: Databases | null = null;
  private storage: Storage | null = null;
  private users: Users | null = null;
  private rl: readline.Interface;

  constructor() {
    this.client = new Client();
    this.rl = readline.createInterface({ input, output });
  }

  /**
   * Initialize Appwrite client
   */
  async initialize(): Promise<void> {
    // Use Appwrite cloud endpoint
    const endpoint = 'https://cloud.appwrite.io/v1';
    logger.info(`Using endpoint: ${endpoint}`);
    this.client.setEndpoint(endpoint);

    // Request Project ID
    const projectId = await this.rl.question('Enter Appwrite Project ID: ');
    if (!projectId) {
      throw new Error('Project ID is required to continue');
    }
    this.client.setProject(projectId);

    // Request API Key
    const apiKey = await this.rl.question('Enter Appwrite API Key: ');
    if (!apiKey) {
      throw new Error('API Key is required to continue');
    }
    this.client.setKey(apiKey);

    // Initialize services
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.users = new Users(this.client);

    logger.success('Appwrite client initialized successfully');
  }

  /**
   * Delete all collections in the database
   */
  async deleteAllCollections(databaseId: string): Promise<void> {
    if (!this.databases) {
      throw new Error('Databases service not initialized');
    }

    try {
      logger.info(`Deleting all collections in database ${databaseId}...`);

      // List all collections
      const collections = await this.databases.listCollections(databaseId);

      if (collections.total === 0) {
        logger.info('No collections found to delete');
        return;
      }

      logger.info(`Found ${collections.total} collections to delete`);

      // Delete each collection
      for (const collection of collections.collections) {
        try {
          await this.databases.deleteCollection(databaseId, collection.$id);
          logger.success(`Deleted collection: ${collection.name} (${collection.$id})`);
        } catch (error) {
          logger.error(`Failed to delete collection ${collection.name}: ${error}`);
        }
      }

      logger.success('All collections deleted successfully');
    } catch (error) {
      logger.error(`Error deleting collections: ${error}`);
    }
  }

  /**
   * Delete the database
   */
  async deleteDatabase(name: string = DATABASE_NAME): Promise<void> {
    if (!this.databases) {
      throw new Error('Databases service not initialized');
    }

    try {
      logger.info(`Looking for database: ${name}...`);

      // List all databases
      const databases = await this.databases.list();

      // Find the database by name
      const database = databases.databases.find(db => db.name === name);

      if (!database) {
        logger.info(`Database "${name}" not found`);
        return;
      }

      // Delete all collections first
      await this.deleteAllCollections(database.$id);

      // Delete the database
      await this.databases.delete(database.$id);
      logger.success(`Database deleted: ${name} (${database.$id})`);

    } catch (error) {
      logger.error(`Error deleting database: ${error}`);
    }
  }

  /**
   * Delete all files in a bucket
   */
  async deleteAllFiles(bucketId: string): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage service not initialized');
    }

    try {
      logger.info(`Deleting all files in bucket ${bucketId}...`);

      // List all files
      const files = await this.storage.listFiles(bucketId);

      if (files.total === 0) {
        logger.info('No files found to delete');
        return;
      }

      logger.info(`Found ${files.total} files to delete`);

      // Delete each file
      for (const file of files.files) {
        try {
          await this.storage.deleteFile(bucketId, file.$id);
          logger.success(`Deleted file: ${file.name} (${file.$id})`);
        } catch (error) {
          logger.error(`Failed to delete file ${file.name}: ${error}`);
        }
      }

      logger.success('All files deleted successfully');
    } catch (error) {
      logger.error(`Error deleting files: ${error}`);
    }
  }

  /**
   * Delete the storage bucket
   */
  async deleteBucket(name: string = STORAGE_NAME): Promise<void> {
    if (!this.storage) {
      throw new Error('Storage service not initialized');
    }

    try {
      logger.info(`Looking for bucket: ${name}...`);

      // List all buckets
      const buckets = await this.storage.listBuckets();

      // Find the bucket by name
      const bucket = buckets.buckets.find(b => b.name === name);

      if (!bucket) {
        logger.info(`Bucket "${name}" not found`);
        return;
      }

      // Delete all files first
      await this.deleteAllFiles(bucket.$id);

      // Delete the bucket
      await this.storage.deleteBucket(bucket.$id);
      logger.success(`Bucket deleted: ${name} (${bucket.$id})`);

    } catch (error) {
      logger.error(`Error deleting bucket: ${error}`);
    }
  }

  /**
   * Delete all users
   */
  async deleteAllUsers(): Promise<void> {
    if (!this.users) {
      throw new Error('Users service not initialized');
    }

    try {
      logger.info('Deleting all users...');

      // List all users (in batches to handle pagination)
      let hasMore = true;
      let offset = 0;
      const limit = 100;
      let deletedCount = 0;

      while (hasMore) {
        const users = await this.users.list([Query.limit(limit), Query.offset(offset)]);

        if (users.users.length === 0) {
          hasMore = false;
          continue;
        }

        for (const user of users.users) {
          try {
            await this.users.delete(user.$id);
            deletedCount++;
            logger.success(`Deleted user: ${user.name || user.email} (${user.$id})`);
          } catch (error) {
            logger.error(`Failed to delete user ${user.email}: ${error}`);
          }
        }

        offset += users.users.length;

        // If we got fewer users than the limit, we've reached the end
        if (users.users.length < limit) {
          hasMore = false;
        }
      }

      logger.success(`Deleted ${deletedCount} users in total`);
    } catch (error) {
      logger.error(`Error deleting users: ${error}`);
    }
  }

  /**
   * Drop everything
   */
  async dropEverything(): Promise<void> {
    try {
      logger.info('Starting full data deletion process...');

      // Initialize Appwrite client
      await this.initialize();

      // Упрощенное подтверждение
      const confirmation = await this.rl.question(
        `WARNING: This will delete ALL ${DATABASE_NAME} data, ${STORAGE_NAME}, and users. This action cannot be undone.\n` +
        'Type "DELETE" to confirm: '
      );

      if (confirmation !== 'DELETE') {
        logger.info('Operation cancelled');
        this.rl.close();
        return;
      }

      // Delete database
      await this.deleteDatabase();

      // Delete bucket
      await this.deleteBucket();

      // Delete users
      await this.deleteAllUsers();

      logger.success('=========================================');
      logger.success('All data has been successfully deleted!');
      logger.success('=========================================');

      this.rl.close();
    } catch (error) {
      logger.error(`Critical error during deletion: ${error}`);
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run the dropper
const dropper = new AppwriteDropper();
dropper.dropEverything().catch(error => {
  logger.error(`Unhandled error: ${error}`);
  process.exit(1);
}); 
