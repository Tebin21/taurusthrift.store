import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils/slug";
import { roundToIQD } from "@/lib/utils/currency";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizes = searchParams.getAll("size");
    const colors = searchParams.getAll("color");
    const brand = searchParams.get("brand");
    const sortBy = searchParams.get("sortBy") ?? "newest";

    const ids = searchParams.get("ids");
    if (ids) {
      const idList = ids.split(",").filter(Boolean);
      const products = await prisma.product.findMany({
        where: { id: { in: idList }, isActive: true },
        include: {
          categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } },
          variants: true,
        },
      });
      return NextResponse.json({ success: true, data: products });
    }

    const where: Record<string, unknown> = { isActive: true };

    if (category) where.categories = { some: { slug: category } };
    if (brand) where.brand = { equals: brand, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameKu: { contains: search, mode: "insensitive" } },
        { nameAr: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
        { categories: { some: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (featured === "true") where.isFeatured = true;
    if (newArrival === "true") where.isNewArrival = true;
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) (where.basePrice as Record<string, unknown>).gte = parseInt(minPrice, 10);
      if (maxPrice) (where.basePrice as Record<string, unknown>).lte = parseInt(maxPrice, 10);
    }
    if (sizes.length > 0) {
      where.variants = { some: { size: { in: sizes }, stock: { gt: 0 } } };
    }
    if (colors.length > 0) {
      where.variants = { some: { color: { in: colors }, stock: { gt: 0 } } };
    }

    const orderBy: Record<string, unknown> =
      sortBy === "price-asc"
        ? { basePrice: "asc" }
        : sortBy === "price-desc"
          ? { basePrice: "desc" }
          : sortBy === "featured"
            ? { isFeatured: "desc" }
            : { createdAt: "desc" };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } },
          variants: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name, nameKu, nameAr, description, descriptionKu, descriptionAr,
      basePrice, compareAtPrice, images, thumbnailUrl, categoryIds,
      isActive, isFeatured, isNewArrival, tags, material, brand, condition,
      variants,
    } = body;

    const slug = generateSlug(name);

    const product = await prisma.product.create({
      data: {
        name, nameKu, nameAr, description, descriptionKu, descriptionAr,
        basePrice: roundToIQD(Number(basePrice)),
        compareAtPrice: compareAtPrice ? roundToIQD(Number(compareAtPrice)) : undefined,
        images: images ?? [],
        thumbnailUrl,
        slug,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? false,
        tags: tags ?? [],
        material, brand, condition,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
        variants: variants
          ? {
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

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
