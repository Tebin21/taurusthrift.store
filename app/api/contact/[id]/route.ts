import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { isRead } = await req.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("[PATCH /api/contact/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 500 });
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
    await prisma.contactMessage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("[DELETE /api/contact/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 });
  }
}
