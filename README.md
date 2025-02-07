<div align="center">
  <img src="preview/logo.webp" width="100" alt="Organify Logo">
  <h1>Organify</h1>
  <h4><i>Own your time. We're here to help.</i></h4>
  <a href="https://choosealicense.com/licenses/mit/"><img src="https://img.shields.io/badge/MIT-3DA638?style=for-the-badge&label=license&link=https%3A%2F%2Fchoosealicense.com%2Flicenses%2Fmit%2F"></a>
  <img src="https://img.shields.io/badge/educational-ED7D31?style=for-the-badge&label=project&link=https%3A%2F%2Fchoosealicense.com%2Flicenses%2Fmit%2F">
  <img src="https://img.shields.io/badge/version-1.0.0-9cf?style=for-the-badge&label=version&link=https%3A%2F%2Fgithub.com%2F...%2Forganify">
</div>

<br>

**Organify** is a time management tool designed for developers and IT teams. It enables users to track, analyze, and optimize the time spent on tasks, facilitating efficient workflow organization.

## _About_

**Name:** Organify  
**Description:** A time management tool designed for developers and IT teams. It enables users to track, analyze, and optimize the time spent on tasks, facilitating efficient workflow organization.  
**Slogan:** *Own your time. We're here to help.*  
**Year:** 2024  
**Stack:** 

[![Static Badge](https://img.shields.io/badge/bun-F9F1E1?style=for-the-badge&logo=bun&logoColor=%23000000&label=1.2.2&labelColor=F9F1E1&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://bun.sh/) 
[![Static Badge](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF&label=^5&labelColor=3178C6&link=https%3A%2F%2Fwww.typescriptlang.org%2F)](https://www.typescriptlang.org/) 
[![Static Badge](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF&label=14.2.18&labelColor=000000&link=https%3A%2F%2Fnextjs.org%2F)](https://nextjs.org/) 
[![Static Badge](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=282C34&label=^18&labelColor=61DAFB&link=https%3A%2F%2Fru.legacy.reactjs.org%2F)](https://legacy.reactjs.org/) 
[![Static Badge](https://img.shields.io/badge/hono-%23E36002?style=for-the-badge&logo=Hono&logoColor=FFFFFF&link=https%3A%2F%2Fhono.dev%2F)](https://hono.dev/) 
[![Static Badge](https://img.shields.io/badge/tailwind%20css-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=F8FAFC&link=https%3A%2F%2Ftailwindcss.com%2F)](https://tailwindcss.com/) 
[![Static Badge](https://img.shields.io/badge/%40tanstack%2Freact%20query-%23FF4154?style=for-the-badge&logo=reactquery&logoColor=FFFFFF&link=https%3A%2F%2Ftanstack.com%2Fquery%2Flatest)](https://tanstack.com/query/latest) 
[![Static Badge](https://img.shields.io/badge/postcss-DD3A0A?style=for-the-badge&logo=postcss&link=https%3A%2F%2Fpostcss.org%2F)](https://postcss.org/) 
[![Static Badge](https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&link=https%3A%2F%2Feslint.org%2F)](https://eslint.org/) 
[![Static Badge](https://img.shields.io/badge/shadcn%2Fui-18181B?style=for-the-badge&link=https%3A%2F%2Fui.shadcn.com%2F)](https://ui.shadcn.com/) 
[![Static Badge](https://img.shields.io/badge/zod-%233E67B1?style=for-the-badge&logo=zod&logoColor=FFFFFF&link=https%3A%2F%2Fzod.dev%2F)](https://zod.dev/) 
[![Static Badge](https://img.shields.io/badge/appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=FFFFFF&link=https%3A%2F%2Fappwrite.io%2F)](https://appwrite.io/)  

## _Features_

> [!important]
>
> Add features

## _Installation_

> [!important]
>
> Add installation screenshots

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

    - **Appwrite** > `<your organization>` > `<your project>` > `Databases` > `Create Database`

    - copy `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
    <img src="preview/database-4-1.webp" width="100%" alt="Appwrite database id"><br/>

5. Create **collection**

    - **Appwrite** > `<your organization>` > `<your project>` > `Databases` > `<your database>` > `Collections` > `Create collection`

    - create `workspaces` collection

    - copy `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`
    <img src="preview/database-5-1.webp" width="100%" alt="Appwrite workspace collection id"><br/>

6. Add the following values to `@/.env.local` file

    ```env
    ╭───────────────────────────────────────╮
    │ .env.local                            │
    │───────────────────────────────────────│
    │  5 # DATABASE                         │
    │  6 NEXT_PUBLIC_APPWRITE_ENDPOINT=     │
    │  7 NEXT_PUBLIC_APPWRITE_PROJECT=      │
    │  8                                    │
    │  9 NEXT_PUBLIC_APPWRITE_DATABASE_ID=  │
    │ 10 NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=│
    │ 11                                    │
    │ 12 NEXT_APPWRITE_KEY=                 │
    ╰───────────────────────────────────────╯
    ```

</details>


## _Roadmap_

> [!important]
>
> Remove this after the project is complete

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
- [ ] `style(dashboard)`: refactor dashboard UI

## _License_

[MIT](https://choosealicense.com/licenses/mit/)
