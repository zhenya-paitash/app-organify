<div align="center">
<!-- TODO: добавить оглавление для быстрого перехода к параграфу -->

  <img src="preview/logo.webp" width="100" alt="Organify Logo">
  <h1>Organify</h1>
  <h4><i>Own your time. We're here to help.</i></h4>
  <a href="https://choosealicense.com/licenses/mit/"><img src="https://img.shields.io/badge/MIT-3DA638?style=for-the-badge&label=license&link=https%3A%2F%2Fchoosealicense.com%2Flicenses%2Fmit%2F"></a>
  <img src="https://img.shields.io/badge/educational-ED7D31?style=for-the-badge&label=project&link=https%3A%2F%2Fchoosealicense.com%2Flicenses%2Fmit%2F">
  <img src="https://img.shields.io/badge/version-1.0.0-9cf?style=for-the-badge&label=version&link=https%3A%2F%2Fgithub.com%2F...%2Forganify">
</div>

<br>

**Organify** is a time management tool designed for developers and IT teams. It enables users to track, analyze, and optimize the time spent on tasks, facilitating efficient workflow organization.


<!-- TODO: вставить какую-нибудь GIF или превьюшку проекта  -->

## _Table of Contents_

<div align="center">

[![Static Badge](https://img.shields.io/badge/About-FFCDB2?style=for-the-badge)](#about) 
[![Static Badge](https://img.shields.io/badge/Features-FFB4A2?style=for-the-badge)](#features)
[![Static Badge](https://img.shields.io/badge/Installation-E5989B?style=for-the-badge)](#installation)
[![Static Badge](https://img.shields.io/badge/License-B5828C?style=for-the-badge)](#license)

</div>

## _About_

**Name:** Organify  
**Description:** A time management tool designed for developers and IT teams. It enables users to track, analyze, and optimize the time spent on tasks, facilitating efficient workflow organization.  
**Slogan:** *Own your time. We're here to help.*  
**Year:** 2024  
**Stack:** 

[![Static Badge](https://img.shields.io/badge/bun-F9F1E1?style=for-the-badge&logo=bun&logoColor=%23000000&label=1.2.13&labelColor=F9F1E1&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://bun.sh/) 
[![Static Badge](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF&label=^5&labelColor=3178C6&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://www.typescriptlang.org/) 
[![Static Badge](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF&label=14.2.18&labelColor=000000&link=https%3A%2F%2Fnextjs.org%2F)](https://nextjs.org/) 
[![Static Badge](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=282C34&label=^18&labelColor=61DAFB&link=https%3A%2F%2Fru.legacy.reactjs.org%2F)](https://legacy.reactjs.org/) 
[![Static Badge](https://img.shields.io/badge/hono-%23E36002?style=for-the-badge&logo=Hono&logoColor=FFFFFF&link=https%3A%2F%2Fhono.dev%2F)](https://hono.dev/) 
[![Static Badge](https://img.shields.io/badge/tailwind%20css-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=F8FAFC&link=https%3A%2F%2Ftailwindcss.com%2F)](https://tailwindcss.com/) 
[![Static Badge](https://img.shields.io/badge/tanstack%2Freact%20query-%23FF4154?style=for-the-badge&logo=reactquery&logoColor=FFFFFF&link=https%3A%2F%2Ftanstack.com%2Fquery%2Flatest)](https://tanstack.com/query/latest) 
[![Static Badge](https://img.shields.io/badge/nuqs-FFF?style=for-the-badge&link=https%3A%2F%2Fnuqs.47ng.com%2F)](https://nuqs.47ng.com/)
[![Static Badge](https://img.shields.io/badge/postcss-DD3A0A?style=for-the-badge&logo=postcss&link=https%3A%2F%2Fpostcss.org%2F)](https://postcss.org/) 
[![Static Badge](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&link=https%3A%2F%2Feslint.org%2F)](https://eslint.org/) 
[![Static Badge](https://img.shields.io/badge/shadcn%2Fui-18181B?style=for-the-badge&link=https%3A%2F%2Fui.shadcn.com%2F)](https://ui.shadcn.com/) 
[![Static Badge](https://img.shields.io/badge/radix%20ui-161618?style=for-the-badge&logo=radixui&link=https%3A%2F%2Fwww.radix-ui.com%2F)](https://www.radix-ui.com/) 
[![Static Badge](https://img.shields.io/badge/zod-%233E67B1?style=for-the-badge&logo=zod&logoColor=FFFFFF&link=https%3A%2F%2Fzod.dev%2F)](https://zod.dev/) 
[![Static Badge](https://img.shields.io/badge/appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=FFFFFF&link=https%3A%2F%2Fappwrite.io%2F)](https://appwrite.io/) 
[![Static Badge](https://img.shields.io/badge/react%20big%20calendar-FFF?style=for-the-badge&logo=square&logoColor=000&link=https%3A%2F%2Fgithub.com%2Fjquense%2Freact-big-calendar)](https://github.com/jquense/react-big-calendar)  

## _Features_

> [!important]
>
> Add features

## _Installation_


<details>
    <summary>Настройка базы данных <a href="https://appwrite.io/">Appwrite</a></summary>
    <br/>

**Note**: настройку `Appwrite` для проекта на Next.js c SSR аутентификацией можно найти здесь https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-1

1. Создать **аккаунт** на [Appwrite](https://appwrite.io/)

2. Создать **проект**  
<img src="preview/database-2.webp" width="100%" alt="Appwrite project"><br/>

3. Создать **ключи API** с привилегиями и добавить значения в `.env.local` файл  

    - copy `NEXT_PUBLIC_APPWRITE_ENDPOINT` & `NEXT_PUBLIC_APPWRITE_PROJECT`
    <img src="preview/database-3-1.webp" width="100%" alt="Apprite project & Appwrite endpoint"><br/>

    - copy `NEXT_APPWRITE_KEY`
    <img src="preview/database-3-2.webp" width="100%" alt="Appwrite api key"><br/>

4. Create **database**

    - **Appwrite** > `<your organization>` > `<your project>` > **Databases** > **Create Database**

    - copy `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
    <img src="preview/database-4-1.webp" width="100%" alt="Appwrite database id"><br/>

5. Create **collection**

    - **Appwrite** > `<your organization>` > `<your project>` > **Databases** > `<your database>` > **Collections** > **Create collection**

    - create `workspaces` collection
        - attribute `name` type `string` size `256` `required`
        - attribute `userId` type `string` size `100` `required`
        - attribute `inviteCode` type `string` size `10` `required`
        - attribute `imageUrl` type `string` size `1400000`

        - copy `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`
        <img src="preview/database-5-1.webp" width="100%" alt="Appwrite workspace collection id"><br/>

    - create `members` collection
        - attribute `userId` type `string` size `50` `required`
        - attribute `workspaceId` type `string` size `50` `required`
        - attribute `role` type `enum` elements `ADMIN MEMBERS` `required`

        - settings > permissions > add `All users` > create ✓ read ✓ update ✓ delete ✓

        - copy `NEXT_PUBLIC_APPWRITE_MEMBERS_ID`

    - create `projects` collection
        - attribute `name` type `string` size `256` `required`
        - attribute `workspaceId` type `string` size `50` `required`
        - attribute `imageUrl` type `string` size `1400000`

        - settings > permissions > add `All users` > create ✓ read ✓ update ✓ delete ✓

        - copy `NEXT_PUBLIC_APPWRITE_PROJECTS_ID`

    - create `tasks` collection
        - attribute `name` type `string` size `256` `required`
        - attribute `status` type `enum` elements `BACKLOG TODO IN_PROGRESS IN_REVIEW DONE` `required`
        - attribute `dueDate` type `datetime` `required`
        - attribute `position` type `integer` min `1000` max `1000000` `required`
        - attribute `workspaceId` type `string` size `50` `required`
        - attribute `projectId` type `string` size `50` `required`
        - attribute `executorId` type `string` size `50` `required`
        - attribute `description` type `string` size `2048`

        - settings > permissions > add `All users` > create ✓ read ✓ update ✓ delete ✓

        - copy `NEXT_PUBLIC_APPWRITE_TASKS_ID`

6. Create **storage** 

    - **Appwrite** > `<your organization>` > `<your project>` > **Storage** > **Create Storage**
    <img src="preview/database-6-1.webp" width="100%" alt="Appwrite storage images"><br/>

    - copy `NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID`
    <img src="preview/database-6-2.webp" width="100%" alt="Appwrite storage images bucket id"><br/>

    - configurate settings 
    <img src="preview/database-6-3.webp" width="100%" alt="Appwrite storage images permissions"><br/>
    <img src="preview/database-6-4.webp" width="100%" alt="Appwrite storage images size & filetypes"><br/>

7. Add the following values to `@/.env.local` file

    ```env
    ╭────────────────────────────────────────────────────────────────╮
    │ .env.local                                                     │
    │────────────────────────────────────────────────────────────────│
    │  1 # APP                                                       │
    │  2 NEXT_PUBLIC_APP_URL=http://localhost:3000                   │
    │  3                                                             │
    │  4                                                             │
    │  5 # DATABASE                                                  │
    │  6 NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1  │
    │  7 NEXT_PUBLIC_APPWRITE_PROJECT=                               │
    │  8                                                             │
    │  9 NEXT_PUBLIC_APPWRITE_DATABASE_ID=                           │
    │ 10 NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=                         │
    │ 11 NEXT_PUBLIC_APPWRITE_MEMBERS_ID=                            │
    │ 12 NEXT_PUBLIC_APPWRITE_PROJECTS_ID=                           │
    │ 13 NEXT_PUBLIC_APPWRITE_TASKS_ID=                              │
    │ 14 NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=                      │
    │ 15                                                             │
    │ 16 NEXT_APPWRITE_KEY=                                          │
    ╰────────────────────────────────────────────────────────────────╯
    ```

</details>

<br/>

<details>
    <summary>Setting up OAuth providers <a href="https://appwrite.io/">Appwrite</a></summary>
    <br/>


1. Create `GitHub` provider

    - **Appwrite** > `<your organization>` > `<your project>` > **Auth** > **settings**
    - create `GitHub` provider
        - switch `Disabled` to `Enabled`
        - copy `URI` to `Authorization callback URL` on `GitHub`

    <!-- https://github.com/settings/developers -->
    - **GitHub** > **Settings** > **Developer settings** > **OAuth Apps** > **New OAuth App**
        - enter `Application name` your `<your project>`
        - enter `Homepage URL` `http://localhost:3000`
        - paste `Authorization callback URL` from `Appwrite OAuth2 Providers URI`
        - click `Register application`
        - copy `Client ID` to `App ID` on `Appwrite OAuth2 Providers`
        - click `Generate a new client secret`
        - copy `Client Secret` to `App Secret` on `Appwrite OAuth2 Providers`

    - complete configuration `Appwrite` `GitHub` provider
        - paste `Client ID` from `GitHub`
        - paste `Client Secret` from `GitHub`
        - click `Update`

2. Create `Google` provider

    - **Appwrite** > `<your organization>` > `<your project>` > **Auth** > **settings**
    - create `Google` provider
        - switch `Disabled` to `Enabled`
        - copy `URI` to `Authorization callback URL` on `Google`

    <!-- https://console.cloud.google.com/ -->
    - **Google Cloud** > **Open project picker** `<Ctrl+O>` > **New project** || open `https://console.cloud.google.com/projectcreate`
        - enter `Project name` your `<your project>`
        - click `Create`
        - select `<your project>`
        - click `APIs & Services` > `OAuth consent screen` > `External` > `Create`
        - enter `App name` your `<your project>`
        - select `User support email` your `<your email>`
        - click `Save and continue`
        - click `Clients` > `Create client` 
        - select `Application type` `Web application`
        - click `Authorized JavaScript origins` `+ Add URI`
        - enter `Authorized JavaScript origins` `http://localhost:3000`
        - click `Authorized redirect URIs` `+ Add URI`
        - paste `Authorization callback URL` from `Appwrite OAuth2 Providers URI`
        - click `Create`
        - copy `Client ID`
        - copy `Client secret`

    - complete configuration `Appwrite` `Google` provider
        - paste `Client ID` from `Google Cloud`
        - paste `Client Secret` from `Google Cloud`
        - click `Update`

</details>

## _TODOs_

- [x] `docs`: initial documentation
- [x] `init`: project setup
- [x] `feat`: add shadcn/ui component library
- [x] `chore`: add shadcn/ui components
- [x] `chore`: fix linting issues in components
- [x] `feat`: create auth pages
- [x] `style`: refactor UI styles
- [x] `feat`: api with Hono
- [x] `feat(api)`: add auth entities
- [x] `feat(database)`: configurate Appwrite as database
- [x] `feat(database)`: add session middleware
- [x] `feet(auth)`: protect routes
- [x] `feet`: add dashboard
- [x] `feet(dashboard)`: add workspace forms
- [x] `feet(workspaces)`: add image upload feature
- [x] `feet(workspaces)`: create workspace selector
- [x] `feet(workspaces)`: create workspace members
- [x] `feet(workspaces)`: add create workspace responsive modal
- [x] `feet(workspaces)`: create standalone create workspace page
- [x] `feet(workspaces)`: build workspace settings
- [x] `refactor`: refactor queries 
- [x] `feet(workspaces)`: delete workspace
- [x] `feet(workspaces)`: reset invite code
- [x] `feet(workspaces)`: invite members to workspace
- [x] `feet(workspaces)`: delete members from workspace
- [x] `feet(workspaces)`: add workspace projects
- [x] `feet(projects)`: create project settings
- [x] `feet`: create task api
- [x] `feet(tasks)`: add task form
- [x] `feet(tasks)`: add task filters
- [x] `feet(tasks)`: add task table
- [x] `feet(tasks)`: add task settings
- [x] `feet(tasks)`: add task kanban view
- [x] `feet(tasks)`: add task kanban update API
- [x] `feet(tasks)`: add task calendar view
- [x] `feet(tasks)`: add task page
- [x] `refactor`: refactor some server and client components
- [x] `feet(projects)`: add project analytics
- [x] `feet(workspaces)`: add workspace analytics
- [x] `build`: resolve build errors and some fixes
- [x] `feet(auth)`: add OAuth providers
- [x] `style`: refactor application UI
- [ ] `docs`: create seed file for database

## _License_

[MIT](https://choosealicense.com/licenses/mit/)
