import "server-only";

import { cookies } from "next/headers";
import { Client, Account, Databases, Users } from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";

interface CreateSessionClient {
  readonly account: Account;
  readonly databases: Databases;
}

interface CreateAdminClient {
  readonly account: Account;
  readonly users: Users;
}

export async function createSessionClient(): Promise<CreateSessionClient> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE);
  if (!session || !session.value) { throw new Error("Unauthorized") }

  client.setSession(session.value);

  return {
    get account() { return new Account(client) },
    get databases() { return new Databases(client) },
  }
}

export async function createAdminClient(): Promise<CreateAdminClient> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() { return new Account(client) },
    get users() { return new Users(client) }
  }
}
