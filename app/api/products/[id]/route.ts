import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { roundToIQD } from "@/lib/utils/currency";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { variants, basePrice, compareAtPrice, categoryIds, ...productData } = body;

    // Remove any stale categoryId field that might come from old clients
    delete productData.categoryId;
    delete productData.category;
    delete productData.categories;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(basePrice !== undefined && { basePrice: roundToIQD(Number(basePrice)) }),
        ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? roundToIQD(Number(compareAtPrice)) : null }),
        ...(categoryIds !== undefined && {
          categories: { set: categoryIds.map((cid: string) => ({ id: cid })) },
        }),
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((v: Record<string, unknown>) => ({
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                sku: v.sku,
                stock: v.stock ?? 0,
                price: v.price,
              })),
            }
          : undefined,
      },
      include: { variants: true, categories: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[PUT /api/products/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
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
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
