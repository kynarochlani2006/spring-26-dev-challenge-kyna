import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";

const cartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

async function getOrCreateCart(userId: string | null, guestId: string | null) {
  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  if (!guestId) {
    throw new Error("Guest ID missing");
  }

  return prisma.cart.upsert({
    where: { guestId },
    update: {},
    create: { guestId },
  });
}

export async function GET(request: Request) {
  try {
    const { userId, guestId } = await getAuthContext(request);
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { guestId: guestId ?? undefined },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("GET /api/cart failed", error);
    return NextResponse.json(
      { error: "Unable to load cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, guestId } = await getAuthContext(request);
    const body = await request.json();
    const parsed = cartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(userId, guestId);

    const item = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parsed.data.productId,
        },
      },
      update: {
        quantity: { increment: parsed.data.quantity },
      },
      create: {
        cartId: cart.id,
        productId: parsed.data.productId,
        quantity: parsed.data.quantity,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("POST /api/cart failed", error);
    return NextResponse.json(
      { error: "Unable to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, guestId } = await getAuthContext(request);
    const body = await request.json();
    const parsed = cartSchema.pick({ productId: true }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { guestId: guestId ?? undefined },
    });

    if (!cart) {
      return NextResponse.json({ removed: false });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: parsed.data.productId,
      },
    });

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("DELETE /api/cart failed", error);
    return NextResponse.json(
      { error: "Unable to update cart" },
      { status: 500 }
    );
  }
}
