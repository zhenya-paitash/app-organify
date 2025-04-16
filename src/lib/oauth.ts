"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

import { createAdminClient } from "@/lib//appwrite";

async function signUpWithOAuth(provider: OAuthProvider) {
  const { account } = await createAdminClient();
  const origin = headers().get("origin");
  const redirectUrl = await account.createOAuth2Token(provider, `${origin}/oauth`, `${origin}/register`);
  return redirect(redirectUrl);
}

export async function signUpWithGoogle() { return signUpWithOAuth(OAuthProvider.Google) }
export async function signUpWithGithub() { return signUpWithOAuth(OAuthProvider.Github) }

