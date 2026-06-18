import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const position = searchParams.get("position");
    const adminAll = searchParams.get("admin");

    if (adminAll) await auth();

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

    const imageUrls: string[] =
      Array.isArray(body.imageUrls) && body.imageUrls.length > 0
        ? (body.imageUrls as string[]).slice(0, 5)
        : body.imageUrl
        ? [String(body.imageUrl)]
        : [];

    if (imageUrls.length === 0) {
      return NextResponse.json({ success: false, error: "At least one image is required" }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title: String(body.title ?? ""),
        titleKu: body.titleKu || null,
        titleAr: body.titleAr || null,
        subtitle: body.subtitle || null,
        subtitleKu: body.subtitleKu || null,
        subtitleAr: body.subtitleAr || null,
        imageUrl: imageUrls[0],
        imageUrls,
        linkUrl: body.linkUrl || null,
        linkText: body.linkText || null,
        linkTextKu: body.linkTextKu || null,
        linkTextAr: body.linkTextAr || null,
        position: body.position ?? "HERO",
        sortOrder: Number(body.sortOrder) || 0,
        isActive: Boolean(body.isActive ?? true),
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/banners]", error);
    return NextResponse.json({ success: false, error: "Failed to create banner" }, { status: 500 });
  }
}
