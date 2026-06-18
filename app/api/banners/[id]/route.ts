import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const imageUrls: string[] | undefined =
      Array.isArray(body.imageUrls) && body.imageUrls.length > 0
        ? (body.imageUrls as string[]).slice(0, 5)
        : body.imageUrl
        ? [String(body.imageUrl)]
        : undefined;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(imageUrls && { imageUrl: imageUrls[0], imageUrls }),
        position: body.position,
        sortOrder: Number(body.sortOrder) || 0,
        isActive: Boolean(body.isActive ?? true),
      },
    });

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error("[PUT /api/banners/[id]]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.banner.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    console.error("[DELETE /api/banners/[id]]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete banner" },
      { status: 500 }
    );
  }
}
