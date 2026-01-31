import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    await createSession(user.id);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("POST /api/auth/signup failed", error);
    return NextResponse.json(
      { error: "Unable to create account" },
      { status: 500 }
    );
  }
}
