import "server-only";

import { getCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
  Account,
  Databases,
  Storage,
  Client,
  Models,

  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = getCookie(c, AUTH_COOKIE);
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  try {
    // Establish a session with Appwrite using the provided session cookie
    // and create instances of Appwrite services (Account, Databases, Storage)
    client.setSession(session);
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    // Retrieve the current user's data from Appwrite
    const user = await account.get();

    // Store the Appwrite services and user data in the request context
    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user)

  } catch (error) {
    deleteCookie(c, AUTH_COOKIE);
    return c.json({ error }, 500);
  }

  // ... -> sessionMiddleware() -> ...
  await next();
});
