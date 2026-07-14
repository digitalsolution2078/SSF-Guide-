import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, name: true, role: true, quote: true, rating: true },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
