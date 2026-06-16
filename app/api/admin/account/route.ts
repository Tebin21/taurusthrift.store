import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, newPassword, confirmPassword } = body as {
      email?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    if (!email && !newPassword) {
      return NextResponse.json(
        { success: false, error: "Enter a new email or password to save" },
        { status: 400 }
      );
    }

    const data: { email?: string; password?: string } = {};

    if (email) {
      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
      }
      data.email = email.trim().toLowerCase();
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 });
      }
      data.password = await bcrypt.hash(newPassword, 12);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[PATCH /api/admin/account]", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 });
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Your session is out of date. Please log out and log back in." },
          { status: 401 }
        );
      }
    }
    return NextResponse.json({ success: false, error: "Failed to update account settings" }, { status: 500 });
  }
}
