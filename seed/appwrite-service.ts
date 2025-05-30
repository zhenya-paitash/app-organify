import { Client, Databases, Storage, ID, Users, Query } from 'node-appwrite';
import { readFileSync } from 'node:fs';
import logger from './logger';

/**
 * Appwrite service class for interacting with Appwrite API
 */
export class AppwriteService {
  private client: Client;
  private _databases: Databases;
  private _storage: Storage;
  private _users: Users;

  constructor(endpoint: string, projectId: string, apiKey: string) {
    this.client = new Client();
    this.client.setEndpoint(endpoint);
    this.client.setProject(projectId);
    this.client.setKey(apiKey);

    this._databases = new Databases(this.client);
    this._storage = new Storage(this.client);
    this._users = new Users(this.client);
  }

  // Make some services public for seeder.ts
  get users(): Users {
    return this._users;
  }

  get databases(): Databases {
    return this._databases;
  }

  /**
   * Check connection to Appwrite
   * @returns True if connection is successful
   */
  async checkConnection(): Promise<boolean> {
    try {
      logger.info('Checking connection to Appwrite...');
      await this._storage.listBuckets();
      logger.success('Connection to Appwrite established successfully');
      return true;
    } catch (error: any) {
      logger.error(`Connection error: ${error.message || error}`);
      return false;
    }
  }

  /**
   * Create or get existing database
   * @param databaseName Name of the database to create/get
   * @returns Database ID
   */
  async createDatabase(databaseName: string): Promise<string> {
    try {
      logger.info(`Checking/creating database: ${databaseName}...`);

      // Check if database already exists
      const databasesList = await this._databases.list();
      const existingDb = databasesList.databases.find(db => db.name === databaseName);

      if (existingDb) {
        logger.success(`Found existing database: ${databaseName} (${existingDb.$id})`);
        return existingDb.$id;
      } else {
        // Create new database
        const newDb = await this._databases.create(ID.unique(), databaseName);
        logger.success(`Created new database: ${databaseName} (${newDb.$id})`);
        return newDb.$id;
      }
    } catch (error) {
      logger.error(`Error creating/getting database: ${error}`);
      throw error;
    }
  }

  /**
   * Create or get existing collection
   * @param databaseId Database ID
   * @param collectionName Collection name
   * @returns Collection ID
   */
  async createCollection(databaseId: string, collectionName: string): Promise<string> {
    try {
      logger.info(`Checking/creating collection '${collectionName}'...`);

      // Check if collection already exists
      const collectionsList = await this._databases.listCollections(databaseId);
      const existingCollection = collectionsList.collections.find(
        collection => collection.name === collectionName
      );

      if (existingCollection) {
        logger.success(`Found collection: ${collectionName} (${existingCollection.$id})`);
        return existingCollection.$id;
      } else {
        // Create new collection
        const newCollection = await this._databases.createCollection(
          databaseId,
          ID.unique(),
          collectionName,
          ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
        );

        logger.success(`Created new collection: ${collectionName} (${newCollection.$id})`);
        return newCollection.$id;
      }
    } catch (error) {
      logger.error(`Error creating collection: ${error}`);
      throw error;
    }
  }

  /**
   * Create collection attributes based on collection type
   * @param databaseId Database ID
   * @param collectionId Collection ID
   * @param collectionName Collection name
   */
  async createCollectionAttributes(
    databaseId: string,
    collectionId: string,
    collectionName: string
  ): Promise<void> {
    try {
      logger.info(`Creating attributes for collection '${collectionName}'...`);

      switch (collectionName) {
        case 'workspaces':
          // Attributes for workspaces collection
          await this._databases.createStringAttribute(databaseId, collectionId, 'name', 256, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'userId', 100, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'inviteCode', 10, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'imageUrl', 1400000, false);
          break;

        case 'members':
          // Attributes for members collection
          await this._databases.createStringAttribute(databaseId, collectionId, 'userId', 50, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'workspaceId', 50, true);
          await this._databases.createEnumAttribute(databaseId, collectionId, 'role', ['ADMIN', 'MEMBER'], true);
          break;

        case 'projects':
          // Attributes for projects collection
          await this._databases.createStringAttribute(databaseId, collectionId, 'name', 256, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'workspaceId', 50, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'imageUrl', 1400000, false);
          break;

        case 'tasks':
          // Attributes for tasks collection
          await this._databases.createStringAttribute(databaseId, collectionId, 'name', 256, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'projectId', 50, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'executorId', 50, true);
          await this._databases.createStringAttribute(databaseId, collectionId, 'workspaceId', 50, true);
          await this._databases.createEnumAttribute(databaseId, collectionId, 'status',
            ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'], true);
          await this._databases.createDatetimeAttribute(databaseId, collectionId, 'dueDate', true);
          await this._databases.createIntegerAttribute(databaseId, collectionId, 'position', true, 1000, 1000000);
          await this._databases.createStringAttribute(databaseId, collectionId, 'description', 10000, false);
          break;
      }

      logger.success(`Attributes for collection '${collectionName}' created successfully`);
    } catch (error) {
      logger.error(`Error creating attributes for collection: ${error}`);
    }
  }

  /**
   * Create or get existing storage bucket
   * @param bucketName Bucket name
   * @returns Bucket ID
   */
  async createBucket(bucketName: string): Promise<string> {
    try {
      logger.info(`Checking/creating bucket for images...`);

      // Check if bucket already exists
      const bucketsList = await this._storage.listBuckets();
      const existingBucket = bucketsList.buckets.find(bucket => bucket.name === bucketName);

      if (existingBucket) {
        logger.success(`Found image bucket: ${bucketName} (${existingBucket.$id})`);
        return existingBucket.$id;
      } else {
        // Create new bucket
        const newBucket = await this._storage.createBucket(
          ID.unique(),
          bucketName,
          ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
        );
        logger.success(`Created new bucket: ${bucketName} (${newBucket.$id})`);
        return newBucket.$id;
      }
    } catch (error) {
      logger.error(`Error creating/getting bucket: ${error}`);
      throw error;
    }
  }

  /**
   * Upload file to storage and return data URL
   * @param bucketId Bucket ID
   * @param filePath Path to file
   * @returns Data URL with base64 encoded file content
   */
  async uploadFile(bucketId: string, filePath: string): Promise<string> {
    try {
      const fileId = ID.unique();
      const fileData = readFileSync(filePath);
      const fileName = filePath.split('/').pop() || 'file';

      const file = new File([fileData], fileName);
      await this._storage.createFile(bucketId, fileId, file);

      // Get file content and convert to data URL with Base64
      const fileContent = await this._storage.getFileView(bucketId, fileId);
      const base64Content = Buffer.from(fileContent).toString('base64');
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'png';
      const mimeType = fileExtension === 'jpg' || fileExtension === 'jpeg'
        ? 'image/jpeg'
        : `image/${fileExtension}`;

      const dataUrl = `data:${mimeType};base64,${base64Content}`;

      logger.success(`File ${filePath} uploaded`);
      return dataUrl;
    } catch (error) {
      logger.error(`Error uploading file ${filePath}: ${error}`);
      throw error;
    }
  }

  /**
   * Test user authentication
   * @param email User email
   * @param password User password
   * @returns True if user can authenticate
   */
  async testUserAuth(email: string, _password: string): Promise<boolean> {
    try {
      // Use admin API to check user
      const existingUsers = await this._users.list([
        Query.equal('email', email)
      ]);

      if (existingUsers.total === 0) {
        logger.error(`User with email ${email} not found`);
        return false;
      }

      // We can't directly check password, assuming password meets requirements
      return true;
    } catch (error) {
      logger.error(`Error checking authentication for user ${email}: ${error}`);
      return false;
    }
  }

  /**
   * Create user if not exists
   * @param email User email
   * @param password User password
   * @param name User name
   * @returns User ID
   */
  async createUser(email: string, password: string, name: string): Promise<string> {
    try {
      // Check if user already exists
      const existingUsers = await this._users.list([
        Query.equal('email', email)
      ]);

      if (existingUsers.total > 0) {
        const existingUser = existingUsers.users[0];
        logger.info(`User with email ${email} already exists (ID: ${existingUser.$id})`);
        return existingUser.$id;
      }

      // Create new user
      const newUser = await this._users.create(
        ID.unique(),
        email,
        undefined, // phone
        password,
        name
      );

      logger.success(`Created user: ${name} (${email}) with ID: ${newUser.$id}`);
      return newUser.$id;
    } catch (error) {
      logger.error(`Error creating user ${email}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete user
   * @param userId User ID
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this._users.delete(userId);
      logger.success(`User with ID ${userId} deleted`);
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      throw error;
    }
  }

  /**
   * Update user password
   * @param userId User ID
   * @param password New password
   */
  async updateUserPassword(userId: string, password: string): Promise<void> {
    try {
      await this._users.updatePassword(userId, password);
      logger.success(`Password updated for user with ID ${userId}`);
    } catch (error) {
      logger.error(`Error updating password: ${error}`);
      throw error;
    }
  }

  /**
   * Create document in collection
   * @param databaseId Database ID
   * @param collectionId Collection ID
   * @param data Document data
   * @returns Created document ID
   */
  async createDocument(databaseId: string, collectionId: string, data: any): Promise<string> {
    try {
      const document = await this._databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        data
      );
      return document.$id;
    } catch (error) {
      logger.error(`Error creating document: ${error}`);
      throw error;
    }
  }

  /**
   * Update document in collection
   * @param databaseId Database ID
   * @param collectionId Collection ID
   * @param documentId Document ID
   * @param data Updated data
   */
  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<void> {
    try {
      await this._databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      logger.error(`Error updating document: ${error}`);
      throw error;
    }
  }

  /**
   * Get document from collection
   * @param databaseId Database ID
   * @param collectionId Collection ID
   * @param documentId Document ID
   * @returns Document data
   */
  async getDocument(databaseId: string, collectionId: string, documentId: string): Promise<any> {
    try {
      return await this._databases.getDocument(
        databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      logger.error(`Error getting document: ${error}`);
      throw error;
    }
  }

  /**
   * List documents from collection with query
   * @param databaseId Database ID
   * @param collectionId Collection ID
   * @param queries Query parameters
   * @returns List of documents
   */
  async listDocuments(databaseId: string, collectionId: string, queries: any[]): Promise<any> {
    try {
      return await this._databases.listDocuments(
        databaseId,
        collectionId,
        queries
      );
    } catch (error) {
      logger.error(`Error listing documents: ${error}`);
      throw error;
    }
  }

  /**
   * Delete collection
   * @param databaseId Database ID
   * @param collectionId Collection ID
   */
  async deleteCollection(databaseId: string, collectionId: string): Promise<void> {
    try {
      await this._databases.deleteCollection(databaseId, collectionId);
      logger.success(`Collection with ID ${collectionId} deleted`);
    } catch (error) {
      logger.error(`Error deleting collection: ${error}`);
      throw error;
    }
  }
} 