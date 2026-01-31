import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";

const wishlistSchema = z.object({
  productId: z.string().min(1),
});

export async function GET() {
  try {
    const { userId, guestId } = await getAuthContext();
    const items = await prisma.wishlistItem.findMany({
      where: userId ? { userId } : { guestId: guestId ?? undefined },
      include: { product: true },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/wishlist failed", error);
    return NextResponse.json(
      { error: "Unable to load wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, guestId } = await getAuthContext();
    const body = await request.json();
    const parsed = wishlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (userId) {
      const existing = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: parsed.data.productId,
          },
        },
      });

      if (existing) {
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ removed: true });
      }

      const item = await prisma.wishlistItem.create({
        data: {
          userId,
          productId: parsed.data.productId,
        },
      });
      return NextResponse.json({ item });
    }

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID missing" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        guestId_productId: {
          guestId,
          productId: parsed.data.productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ removed: true });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        guestId,
        productId: parsed.data.productId,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("POST /api/wishlist failed", error);
    return NextResponse.json(
      { error: "Unable to update wishlist" },
      { status: 500 }
    );
  }
}
