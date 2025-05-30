# Organify Database Seeder

This directory contains scripts for seeding the Appwrite database with initial data for the Organify application.

## Structure

The seeder is organized into several modular classes using an object-oriented approach:

- **SeedRunner** (index.ts) - Entry point class for running the seeding process
- **Seeder** (seeder.ts) - Main seeder class that orchestrates the seeding process
- **AppwriteService** (appwrite-service.ts) - Service class for interacting with Appwrite API
- **CsvLoader** (csv-loader.ts) - Class for loading and parsing CSV files
- **EnvManager** (env-manager.ts) - Class for managing environment variables
- **Logger** (logger.ts) - OOP-based colorful logger with different message levels
- **Utils** (utils.ts) - Class with static utility methods
- **AppwriteDropper** (drop.ts) - Class for dropping all Appwrite resources

## Data Files

Seed data is stored in CSV format in the `seed/data/` directory:

- **users.csv** - User data (name, email, password)
- **workspaces.csv** - Workspace data
- **members.csv** - Workspace membership data
- **projects.csv** - Project data
- **tasks.csv** - Task data

**Important:** If your CSV data contains commas within fields, you need to escape them with a backslash (e.g., `Sort tools\, donate unused items`) or enclose the entire field in quotes.

## Images

Images for workspaces and projects are stored in the `seed/img/` directory. These are automatically uploaded to Appwrite storage and converted to data URLs (base64 format).

## Usage

To run database seeding (create structure and populate with data):

```bash
npm run seed
```

This will:
1. Prompt for Appwrite Project ID and API Key
2. Create/update necessary database, collections, and storage buckets
3. Seed users, workspaces, members, projects, and tasks
4. Create a `.env.local` file with all necessary Appwrite resource IDs

To initialize database structure only (without populating data):

```bash
npm run seed:init
# or
npm run seed -- --init
```

This will:
1. Prompt for Appwrite Project ID and API Key
2. Create necessary database, collections, and storage buckets with proper structure
3. Ask if you want to recreate existing collections
4. Create a `.env.local` file with all necessary Appwrite resource IDs

To delete all data:

```bash
npm run seed:drop
```

This will:
1. Prompt for Appwrite Project ID and API Key
2. Delete the `app-organify-database` database with all collections
3. Delete the `app-organify-images` storage bucket with all files
4. Delete all users (requires additional confirmation)

## Key Features

- **Modular OOP Architecture**: Code is organized into classes with clear responsibilities
- **Error Handling**: Robust error handling for all operations
- **Auto-creation of Members**: Missing members are automatically created when processing tasks
- **Data URL Image Handling**: Images are stored as base64 data URLs for better portability
- **Smart CSV Parsing**: CSV files are parsed with proper handling of escaped commas
- **Colorful Logging**: All console output is color-coded for better readability:
  - Green: Success messages
  - Red: Error messages
  - Gray: Informational messages
  - Blue: Input prompts 
