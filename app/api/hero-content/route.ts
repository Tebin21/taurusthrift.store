import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    let heroContent = await prisma.heroContent.findFirst();
    if (!heroContent) {
      heroContent = await prisma.heroContent.create({
        data: { titleEn: "", titleKu: "", titleAr: "" },
      });
    }
    return NextResponse.json({ success: true, data: heroContent });
  } catch (error) {
    console.error("[GET /api/hero-content]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    let heroContent = await prisma.heroContent.findFirst();
    if (heroContent) {
      heroContent = await prisma.heroContent.update({
        where: { id: heroContent.id },
        data: {
          titleEn: String(body.titleEn ?? ""),
          titleKu: String(body.titleKu ?? ""),
          titleAr: String(body.titleAr ?? ""),
        },
      });
    } else {
      heroContent = await prisma.heroContent.create({
        data: {
          titleEn: String(body.titleEn ?? ""),
          titleKu: String(body.titleKu ?? ""),
          titleAr: String(body.titleAr ?? ""),
        },
      });
    }

    return NextResponse.json({ success: true, data: heroContent });
  } catch (error) {
    console.error("[PUT /api/hero-content]", error);
    return NextResponse.json({ success: false, error: "Failed to save hero content" }, { status: 500 });
  }
}
