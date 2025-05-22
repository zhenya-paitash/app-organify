<div align="center">
  <h1>🎯 Organify</h1>
  <p>A modern task management platform built with Next.js and Appwrite</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#license">License</a>
  </p>
</div>

## ✨ Features

- 🔐 Authentication with Email & OAuth (GitHub, Google)
- 👥 Workspace Management
- 📊 Project Analytics
- 📋 Task Management with Kanban & Calendar views
- 🖼️ Image Upload Support
- 🌓 Light/Dark Mode
- 📱 Responsive Design

## 🛠️ Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono)](https://hono.dev/)

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/organify.git
cd organify
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment file
```bash
cp .env.local.example .env.local
```

## ⚙️ Configuration

### 1. Appwrite Setup

#### Database Configuration
1. Create an [Appwrite](https://appwrite.io/) account
2. Create a new project
   ![Create Project](preview/database-2.webp)

3. Get API Keys
   - Copy `Project ID` and `Endpoint`
     ![Project Settings](preview/database-3-1.webp)
   - Create API Key with required permissions
     ![API Key](preview/database-3-2.webp)

4. Create Database
   - Navigate to: **Databases** > **Create Database**
   - Copy the `Database ID`
     ![Database ID](preview/database-4-1.webp)

5. Create Collections

   <details>
   <summary>📁 Workspaces Collection</summary>

   - Create collection named `workspaces`
   - Required attributes:
     ```
     name: string (256) required
     userId: string (100) required
     inviteCode: string (10) required
     imageUrl: string (1400000)
     ```
   - Copy `Collection ID`
   </details>

   <details>
   <summary>👥 Members Collection</summary>

   - Create collection named `members`
   - Required attributes:
     ```
     userId: string (50) required
     workspaceId: string (50) required
     role: enum (ADMIN, MEMBERS) required
     ```
   - Set permissions: All users (create, read, update, delete)
   - Copy `Collection ID`
   </details>

   <details>
   <summary>📊 Projects Collection</summary>

   - Create collection named `projects`
   - Required attributes:
     ```
     name: string (256) required
     workspaceId: string (50) required
     imageUrl: string (1400000)
     ```
   - Set permissions: All users (create, read, update, delete)
   - Copy `Collection ID`
   </details>

6. Create Storage
   - Navigate to: **Storage** > **Create Storage**
   - Configure permissions and file types
     ![Storage Settings](preview/database-6-3.webp)
   - Copy `Bucket ID`

### 2. OAuth Configuration

<details>
<summary>🔑 GitHub OAuth Setup</summary>

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
   - App name: `Organify`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: (copy from Appwrite OAuth settings)
3. Copy `Client ID` and `Client Secret` to Appwrite
</details>

<details>
<summary>🔑 Google OAuth Setup</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Configure OAuth consent screen
4. Create OAuth credentials
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: (copy from Appwrite OAuth settings)
5. Copy `Client ID` and `Client Secret` to Appwrite
</details>

### 3. Environment Variables

Update `.env.local` with your configuration:
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your_projects_collection_id
NEXT_PUBLIC_APPWRITE_TASKS_ID=your_tasks_collection_id
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_storage_bucket_id
NEXT_APPWRITE_KEY=your_api_key
```

## 🏃‍♂️ Running the App

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

[MIT](LICENSE) © Your Name
````

This new version features:
- Modern emoji usage for better visual hierarchy
- Collapsible sections for detailed information
- Clear step-by-step instructions
- Better visual organization with badges
- Quick navigation links
- Consistent formatting throughout
- Detailed configuration steps with expandable sections
- Clear environment variable setup

Would you like me to make any adjustments to this structure?



