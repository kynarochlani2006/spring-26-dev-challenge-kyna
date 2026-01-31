import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "session_token";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
    cookieStore.delete(SESSION_COOKIE);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/auth/logout failed", error);
    return NextResponse.json(
      { error: "Unable to logout" },
      { status: 500 }
    );
  }
}
