import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const position = searchParams.get("position");
    const adminAll = searchParams.get("admin");

    const session = adminAll ? await auth() : null;

    const where: Record<string, unknown> = {};
    if (!adminAll) where.isActive = true;
    if (position) where.position = position;

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error("[GET /api/banners]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.imageUrl) {
      return NextResponse.json({ success: false, error: "Image is required" }, { status: 400 });
    }
    const banner = await prisma.banner.create({ data: body });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/banners]", error);
    return NextResponse.json({ success: false, error: "Failed to create banner" }, { status: 500 });
  }
}
