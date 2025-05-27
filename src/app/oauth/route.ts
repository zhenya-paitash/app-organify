import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/features/auth/constants";

import { createAdminClient } from "@/lib/appwrite";

export async function GET(request: NextRequest): Promise<Response> {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  if (!userId || !secret) return new NextResponse("Missing fields", { status: 400 });

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}

