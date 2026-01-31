import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";

export async function GET() {
  try {
    const { userId } = await getAuthContext();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/auth/me failed", error);
    return NextResponse.json(
      { error: "Unable to load session" },
      { status: 500 }
    );
  }
}
