import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products failed", error);
    return NextResponse.json(
      { error: "Unable to load products" },
      { status: 500 }
    );
  }
}
