import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

import logger from './logger';
import { AppwriteService } from './appwrite-service';
import { CsvLoader } from './csv-loader';
import { EnvManager } from './env-manager';
import { Utils } from './utils';
import { ResourceIds } from './types';
import { Query } from 'node-appwrite';
import { UserCSV, WorkspaceCSV, ProjectCSV, TaskCSV, MemberCSV } from './csv-loader';

/**
 * Main seeder class
 */
export class Seeder {
  private appwrite: AppwriteService | null = null;
  private rl: readline.Interface;

  // Resource IDs
  private resourceIds: ResourceIds = {
    projectId: '',
    apiKey: '',
    databaseId: '',
    workspacesId: '',
    membersId: '',
    projectsId: '',
    tasksId: '',
    imagesBucketId: ''
  };

  // Maps for entity relationships
  private userMap: Map<string, string> = new Map();
  private workspaceMap: Map<string, string> = new Map();
  private projectMap: Map<string, string> = new Map();
  private memberMap: Map<string, Map<string, string>> = new Map(); // email -> workspace -> memberId

  constructor() {
    this.rl = readline.createInterface({ input, output });
  }

  /**
   * Request required parameters from user
   */
  async promptRequiredParams(): Promise<void> {
    // Use Appwrite cloud endpoint
    const endpoint = 'https://cloud.appwrite.io/v1';
    logger.info(`Using endpoint: ${endpoint}`);

    // Request Project ID
    this.resourceIds.projectId = await this.rl.question('Enter Appwrite Project ID: ');
    if (!this.resourceIds.projectId) {
      throw new Error('Project ID is required to continue');
    }

    // Request API Key
    this.resourceIds.apiKey = await this.rl.question('Enter Appwrite API Key: ');
    if (!this.resourceIds.apiKey) {
      throw new Error('API Key is required to continue');
    }

    // Initialize Appwrite service
    this.appwrite = new AppwriteService(
      endpoint,
      this.resourceIds.projectId,
      this.resourceIds.apiKey
    );

    logger.success('Parameters configured successfully');
  }

  /**
   * Initialize database and collections
   */
  async initDatabase(): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    // Create database
    this.resourceIds.databaseId = await this.appwrite.createDatabase('app-organify-database');

    // Create collections
    this.resourceIds.workspacesId = await this.appwrite.createCollection(
      this.resourceIds.databaseId,
      'workspaces'
    );

    this.resourceIds.membersId = await this.appwrite.createCollection(
      this.resourceIds.databaseId,
      'members'
    );

    this.resourceIds.projectsId = await this.appwrite.createCollection(
      this.resourceIds.databaseId,
      'projects'
    );

    this.resourceIds.tasksId = await this.appwrite.createCollection(
      this.resourceIds.databaseId,
      'tasks'
    );

    // Create collection attributes
    await this.appwrite.createCollectionAttributes(
      this.resourceIds.databaseId,
      this.resourceIds.workspacesId,
      'workspaces'
    );

    await this.appwrite.createCollectionAttributes(
      this.resourceIds.databaseId,
      this.resourceIds.membersId,
      'members'
    );

    await this.appwrite.createCollectionAttributes(
      this.resourceIds.databaseId,
      this.resourceIds.projectsId,
      'projects'
    );

    await this.appwrite.createCollectionAttributes(
      this.resourceIds.databaseId,
      this.resourceIds.tasksId,
      'tasks'
    );

    // Create image bucket
    this.resourceIds.imagesBucketId = await this.appwrite.createBucket('app-organify-images');
  }

  /**
   * Delete existing collections for recreation
   */
  async deleteExistingCollections(): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Deleting existing collections for recreation...');

      // Delete collections if they exist
      const collections = [
        { id: this.resourceIds.workspacesId, name: 'workspacesId' },
        { id: this.resourceIds.membersId, name: 'membersId' },
        { id: this.resourceIds.projectsId, name: 'projectsId' },
        { id: this.resourceIds.tasksId, name: 'tasksId' }
      ];

      for (const collection of collections) {
        if (collection.id) {
          try {
            await this.appwrite.deleteCollection(
              this.resourceIds.databaseId,
              collection.id
            );
            logger.success(`Collection with ID ${collection.id} deleted`);
            this.resourceIds[collection.name as keyof ResourceIds] = '';
          } catch (error) {
            logger.error(`Error deleting collection with ID ${collection.id}: ${error}`);
          }
        }
      }

      logger.success('Collections deletion completed');
    } catch (error) {
      logger.error(`Error deleting collections: ${error}`);
    }
  }

  /**
   * Seed users
   * @param users Array of users
   */
  async seedUsers(users: UserCSV[]): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Starting user seeding...');

      for (const user of users) {
        try {
          // Check password requirements
          const passwordValidation = Utils.validatePassword(user.password);
          if (!passwordValidation.valid) {
            logger.error(`Password for user ${user.email} doesn't meet requirements: ${passwordValidation.message}`);
            continue;
          }

          // Create user directly without checking existing
          try {
            const userId = await this.appwrite.createUser(
              user.email,
              user.password,
              user.name
            );

            this.userMap.set(user.email, userId);
            logger.success(`Created user: ${user.name} (${user.email}) with ID: ${userId}`);
          } catch (createError: any) {
            // If user already exists (conflict), just get their ID
            if (createError.code === 409) {
              logger.info(`User ${user.email} already exists, getting their ID`);
              const existingUsers = await this.appwrite.users.list([
                Query.equal('email', user.email)
              ]);

              if (existingUsers.total > 0) {
                const existingUser = existingUsers.users[0];
                this.userMap.set(user.email, existingUser.$id);
                logger.success(`Found existing user: ${user.name} (${user.email}) with ID: ${existingUser.$id}`);
              }
            } else {
              throw createError;
            }
          }
        } catch (error) {
          logger.error(`Error creating user ${user.email}: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Error during user seeding: ${error}`);
    }
  }

  /**
   * Seed workspaces
   * @param workspaces Array of workspaces
   */
  async seedWorkspaces(workspaces: WorkspaceCSV[]): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Starting workspace seeding...');

      const adminId = this.userMap.get('admin@organify.com');
      if (!adminId) {
        logger.error('Admin user not found for workspace creation');
        return;
      }

      for (const workspace of workspaces) {
        try {
          // Create workspace
          const workspaceId = await this.appwrite.createDocument(
            this.resourceIds.databaseId,
            this.resourceIds.workspacesId,
            {
              name: workspace.name,
              userId: adminId,
              inviteCode: Utils.generateInviteCode(10)
            }
          );

          this.workspaceMap.set(workspace.name, workspaceId);
          logger.success(`Created workspace: ${workspace.name}`);

          // Upload image if specified
          if (workspace.imageUrl) {
            const imagePath = join(process.cwd(), 'seed', 'img', workspace.imageUrl);
            if (existsSync(imagePath)) {
              // Get image Data URL with base64
              const imageDataUrl = await this.appwrite.uploadFile(
                this.resourceIds.imagesBucketId,
                imagePath
              );

              await this.appwrite.updateDocument(
                this.resourceIds.databaseId,
                this.resourceIds.workspacesId,
                workspaceId,
                { imageUrl: imageDataUrl }
              );

              logger.success(`Added image for workspace ${workspace.name}`);
            }
          }
        } catch (error) {
          logger.error(`Error creating workspace ${workspace.name}: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Error during workspace seeding: ${error}`);
    }
  }

  /**
   * Seed members
   * @param members Array of members
   */
  async seedMembers(members: MemberCSV[]): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Starting member seeding...');

      for (const member of members) {
        try {
          const userId = this.userMap.get(member.email);
          const workspaceId = this.workspaceMap.get(member.workspace);

          if (!userId || !workspaceId) {
            logger.error(`User ${member.email} or workspace ${member.workspace} not found`);
            continue;
          }

          // Create member directly, handle duplicates via try-catch
          try {
            const memberId = await this.appwrite.createDocument(
              this.resourceIds.databaseId,
              this.resourceIds.membersId,
              {
                userId,
                workspaceId,
                role: member.role
              }
            );

            // Save created member ID
            if (!this.memberMap.has(member.email)) {
              this.memberMap.set(member.email, new Map());
            }
            this.memberMap.get(member.email)!.set(member.workspace, memberId);

            logger.success(`Added member ${member.email} to workspace ${member.workspace}`);
          } catch (createError: any) {
            // If member already exists, we need to get their ID
            if (createError.code === 409) {
              logger.info(`Member ${member.email} might already exist in workspace ${member.workspace}`);

              try {
                // We need to find the document manually
                const existingMembers = await this.appwrite.databases.listDocuments(
                  this.resourceIds.databaseId,
                  this.resourceIds.membersId
                );

                // Find the document that matches our userId and workspaceId
                const existingMember = existingMembers.documents.find(doc =>
                  doc.userId === userId && doc.workspaceId === workspaceId
                );

                if (existingMember) {
                  // Save existing member ID
                  if (!this.memberMap.has(member.email)) {
                    this.memberMap.set(member.email, new Map());
                  }
                  this.memberMap.get(member.email)!.set(member.workspace, existingMember.$id);

                  logger.success(`Found existing member ${member.email} in workspace ${member.workspace}`);
                } else {
                  throw new Error(`Could not find member after conflict error`);
                }
              } catch (listError) {
                logger.error(`Error finding existing member: ${listError}`);
              }
            } else {
              throw createError;
            }
          }
        } catch (error) {
          logger.error(`Error adding member ${member.email}: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Error during member seeding: ${error}`);
    }
  }

  /**
   * Seed projects
   * @param projects Array of projects
   */
  async seedProjects(projects: ProjectCSV[]): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Starting project seeding...');

      for (const project of projects) {
        try {
          const workspaceId = this.workspaceMap.get(project.workspace);

          if (!workspaceId) {
            logger.error(`Workspace ${project.workspace} not found for project ${project.name}`);
            continue;
          }

          // Create project
          const projectId = await this.appwrite.createDocument(
            this.resourceIds.databaseId,
            this.resourceIds.projectsId,
            {
              name: project.name,
              workspaceId
            }
          );

          this.projectMap.set(project.name, projectId);
          logger.success(`Created project: ${project.name}`);

          // Upload image if specified
          if (project.imageUrl) {
            const imagePath = join(process.cwd(), 'seed', 'img', project.imageUrl);
            if (existsSync(imagePath)) {
              // Get image Data URL with base64
              const imageDataUrl = await this.appwrite.uploadFile(
                this.resourceIds.imagesBucketId,
                imagePath
              );

              await this.appwrite.updateDocument(
                this.resourceIds.databaseId,
                this.resourceIds.projectsId,
                projectId,
                { imageUrl: imageDataUrl }
              );

              logger.success(`Added image for project ${project.name}`);
            }
          }
        } catch (error) {
          logger.error(`Error creating project ${project.name}: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Error during project seeding: ${error}`);
    }
  }

  /**
   * Seed tasks
   * @param tasks Array of tasks
   */
  async seedTasks(tasks: TaskCSV[]): Promise<void> {
    if (!this.appwrite) {
      throw new Error('Appwrite service not initialized');
    }

    try {
      logger.info('Starting task seeding...');

      let positionCounter = 1000; // Initial position value

      for (const task of tasks) {
        try {
          const projectId = this.projectMap.get(task.project);

          // Find workspaceId for the project
          let workspaceId = '';
          try {
            if (!projectId) {
              logger.error(`Project ${task.project} not found for task ${task.name}`);
              continue;
            }

            const project = await this.appwrite.getDocument(
              this.resourceIds.databaseId,
              this.resourceIds.projectsId,
              projectId
            );
            workspaceId = project.workspaceId;
          } catch (error) {
            logger.error(`Error getting workspaceId for project ${task.project}: ${error}`);
            continue;
          }

          // Get workspace name by ID
          let workspaceName = '';
          for (const [name, id] of this.workspaceMap.entries()) {
            if (id === workspaceId) {
              workspaceName = name;
              break;
            }
          }

          // Find or create member if needed
          const memberEmail = task.executor;
          let executorId = '';

          if (!this.memberMap.has(memberEmail) || !this.memberMap.get(memberEmail)!.has(workspaceName)) {
            logger.info(`Member mapping not found for ${memberEmail} in workspace ${workspaceName}, attempting to create...`);

            const userId = this.userMap.get(memberEmail);
            if (!userId) {
              logger.error(`User ${memberEmail} not found for task ${task.name}`);
              continue;
            }

            try {
              // Try to find existing member by listing all members
              const members = await this.appwrite.databases.listDocuments(
                this.resourceIds.databaseId,
                this.resourceIds.membersId
              );

              const existingMember = members.documents.find(doc =>
                doc.userId === userId && doc.workspaceId === workspaceId
              );

              if (existingMember) {
                executorId = existingMember.$id;
                logger.success(`Found existing member ${memberEmail} in workspace ${workspaceName}`);

                // Save to our member map
                if (!this.memberMap.has(memberEmail)) {
                  this.memberMap.set(memberEmail, new Map());
                }
                this.memberMap.get(memberEmail)!.set(workspaceName, executorId);
              } else {
                // Create new member if not found
                logger.info(`Creating new member ${memberEmail} in workspace ${workspaceName}`);
                const memberId = await this.appwrite.createDocument(
                  this.resourceIds.databaseId,
                  this.resourceIds.membersId,
                  {
                    userId,
                    workspaceId,
                    role: 'MEMBER' // Default role
                  }
                );

                executorId = memberId;

                // Save to our member map
                if (!this.memberMap.has(memberEmail)) {
                  this.memberMap.set(memberEmail, new Map());
                }
                this.memberMap.get(memberEmail)!.set(workspaceName, executorId);

                logger.success(`Created new member ${memberEmail} in workspace ${workspaceName}`);
              }
            } catch (error) {
              logger.error(`Error finding/creating member ${memberEmail}: ${error}`);
              continue;
            }
          } else {
            executorId = this.memberMap.get(memberEmail)!.get(workspaceName)!;
          }

          if (!executorId) {
            logger.error(`Member with email ${memberEmail} in workspace ${workspaceName} not found for task ${task.name}`);
            continue;
          }

          // Create task
          await this.appwrite.createDocument(
            this.resourceIds.databaseId,
            this.resourceIds.tasksId,
            {
              name: task.name,
              status: task.status,
              dueDate: task.dueDate,
              projectId,
              executorId, // Using memberId instead of userId
              workspaceId,
              position: positionCounter++,
              description: task.description || ''
            }
          );

          logger.success(`Created task: ${task.name}`);
        } catch (error) {
          logger.error(`Error creating task ${task.name}: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Error during task seeding: ${error}`);
    }
  }

  /**
   * Main seeding process
   */
  async seed(): Promise<void> {
    try {
      logger.info('Starting seeding process...');

      // Request required parameters
      await this.promptRequiredParams();

      // Check connection
      if (!this.appwrite) {
        throw new Error('Appwrite service not initialized');
      }

      const connected = await this.appwrite.checkConnection();
      if (!connected) {
        throw new Error('Error connecting to Appwrite');
      }

      // Initialize database and collections
      await this.initDatabase();

      // Delete existing collections for recreation
      await this.deleteExistingCollections();

      // Re-initialize collections
      await this.initDatabase();

      // Load data from CSV files
      const data = CsvLoader.loadAllCsvData();
      const users = data.users as UserCSV[];
      const workspaces = data.workspaces as WorkspaceCSV[];
      const members = data.members as MemberCSV[];
      const projects = data.projects as ProjectCSV[];
      const tasks = data.tasks as TaskCSV[];

      // Seed data
      await this.seedUsers(users);
      await this.seedWorkspaces(workspaces);
      await this.seedMembers(members);
      await this.seedProjects(projects);
      await this.seedTasks(tasks);

      // Generate .env file
      EnvManager.generateEnvFile(this.resourceIds);

      logger.success('=========================================');
      logger.success('Seeding completed successfully!');
      logger.success('.env.local file with resource IDs created');
      logger.success('=========================================');

      // Close readline interface
      this.rl.close();
    } catch (error) {
      logger.error(`Error during seeding: ${error}`);
      this.rl.close();
      process.exit(1);
    }
  }

  /**
   * Initialize database and collections only, without seeding data
   */
  async initOnly(): Promise<void> {
    try {
      logger.info('Starting database initialization process...');

      // Request required parameters
      await this.promptRequiredParams();

      // Check connection
      if (!this.appwrite) {
        throw new Error('Appwrite service not initialized');
      }

      const connected = await this.appwrite.checkConnection();
      if (!connected) {
        throw new Error('Error connecting to Appwrite');
      }

      // Check if we should recreate collections
      const recreate = await this.rl.question('Do you want to recreate existing collections? (y/N): ');

      if (recreate.toLowerCase() === 'y') {
        // Initialize database and collections
        await this.initDatabase();

        // Delete existing collections for recreation
        await this.deleteExistingCollections();

        // Re-initialize collections
        await this.initDatabase();
      } else {
        // Just initialize database and collections
        await this.initDatabase();
      }

      // Generate .env file
      EnvManager.generateEnvFile(this.resourceIds);

      logger.success('=========================================');
      logger.success('Database initialization completed successfully!');
      logger.success('.env.local file with resource IDs created');
      logger.success('=========================================');

      // Close readline interface
      this.rl.close();
    } catch (error) {
      logger.error(`Error during initialization: ${error}`);
      this.rl.close();
      process.exit(1);
    }
  }
} 
