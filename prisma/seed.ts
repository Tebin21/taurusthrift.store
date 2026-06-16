import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@taurusthrift.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@taurusthrift.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin:", admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tops" },
      update: {},
      create: {
        name: "Tops",
        nameKu: "سەرەوە",
        nameAr: "قمصان",
        slug: "tops",
        description: "T-shirts, blouses, shirts and more",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bottoms" },
      update: {},
      create: {
        name: "Bottoms",
        nameKu: "خوارەوە",
        nameAr: "بناطيل",
        slug: "bottoms",
        description: "Jeans, trousers, skirts and more",
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "dresses" },
      update: {},
      create: {
        name: "Dresses",
        nameKu: "کراس",
        nameAr: "فساتين",
        slug: "dresses",
        description: "Casual and formal dresses",
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "outerwear" },
      update: {},
      create: {
        name: "Outerwear",
        nameKu: "ژاکێت",
        nameAr: "ملابس خارجية",
        slug: "outerwear",
        description: "Jackets, coats, and blazers",
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        nameKu: "پێکهاتەکان",
        nameAr: "إكسسوارات",
        slug: "accessories",
        description: "Bags, belts, scarves and more",
        isActive: true,
        sortOrder: 5,
      },
    }),
  ]);
  console.log("Created categories:", categories.length);

  // Sample Products
  const topCategory = categories[0];
  const bottomCategory = categories[1];
  const dressCategory = categories[2];
  const outerCategory = categories[3];

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "vintage-linen-shirt" },
      update: {},
      create: {
        name: "Vintage Linen Shirt",
        nameKu: "کراسی کتانی کلاسیک",
        nameAr: "قميص كتان عتيق",
        slug: "vintage-linen-shirt",
        description: "A beautifully aged linen shirt with relaxed fit and natural texture. Perfect for warm days.",
        descriptionKu: "کراسێکی کتانی نایاب بە شێوەی ئازاد و دۆخی سروشتی. گونجاوە بۆ ڕۆژانی گەرم.",
        descriptionAr: "قميص كتان جميل بقصة مريحة وملمس طبيعي. مثالي للأيام الدافئة.",
        basePrice: 35.00,
        compareAtPrice: 55.00,
        images: [],
        isActive: true,
        isFeatured: true,
        isNewArrival: true,
        condition: "Excellent",
        material: "100% Linen",
        brand: "Vintage",
        tags: ["linen", "vintage", "casual"],
        categories: { connect: [{ id: topCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "high-waist-trousers" },
      update: {},
      create: {
        name: "High-Waist Trousers",
        nameKu: "پانتۆلی بڵندی کەمەر",
        nameAr: "بنطال خصر عالي",
        slug: "high-waist-trousers",
        description: "Classic high-waist trousers in warm camel tone. Timeless style meets comfort.",
        descriptionKu: "پانتۆلی کلاسیکی بڵندی کەمەر بە ڕەنگی گەرمی شتر. شێوازی هەمیشەیی و ئاسوودە.",
        descriptionAr: "بنطال خصر عالي كلاسيكي بلون الجمل الدافئ. أسلوب خالد يجمع بين الأناقة والراحة.",
        basePrice: 42.00,
        compareAtPrice: 68.00,
        images: [],
        isActive: true,
        isFeatured: true,
        isNewArrival: false,
        condition: "Good",
        material: "Cotton Blend",
        brand: "Classic",
        tags: ["trousers", "high-waist", "formal"],
        categories: { connect: [{ id: bottomCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "floral-midi-dress" },
      update: {},
      create: {
        name: "Floral Midi Dress",
        nameKu: "کراسی میدی گوڵاڵە",
        nameAr: "فستان ميدي بطبعة الزهور",
        slug: "floral-midi-dress",
        description: "A romantic floral midi dress with flowy silhouette. Ideal for brunches and garden parties.",
        descriptionKu: "کراسی میدی ڕۆمانتیکی گوڵاڵە بە شێوازی ئازاد. گونجاوە بۆ خوارەکانی بەیانی و پارتیەکانی باخچە.",
        descriptionAr: "فستان ميدي رومانسي بطبعة الزهور وخط سيلويت متدفق. مثالي لوجبات الإفطار والحفلات في الحديقة.",
        basePrice: 48.00,
        compareAtPrice: 85.00,
        images: [],
        isActive: true,
        isFeatured: false,
        isNewArrival: true,
        condition: "Excellent",
        material: "Chiffon",
        brand: "Boho",
        tags: ["dress", "floral", "midi", "feminine"],
        categories: { connect: [{ id: dressCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "camel-wool-blazer" },
      update: {},
      create: {
        name: "Camel Wool Blazer",
        nameKu: "بلازەری موی شتر",
        nameAr: "بليزر صوف جمل",
        slug: "camel-wool-blazer",
        description: "A luxurious camel wool blazer with structured shoulders. The cornerstone of any sophisticated wardrobe.",
        descriptionKu: "بلازەرێکی مۆی شترڤ بە ملوانکەی شێوەدار. بنەمای هەر پۆشاکخانەیەکی کلاسیک.",
        descriptionAr: "بليزر صوف فاخر بكتفين منظمين. ركيزة أي خزانة ملابس راقية.",
        basePrice: 75.00,
        compareAtPrice: 140.00,
        images: [],
        isActive: true,
        isFeatured: true,
        isNewArrival: false,
        condition: "Excellent",
        material: "Wool Blend",
        brand: "Premium",
        tags: ["blazer", "wool", "formal", "luxury"],
        categories: { connect: [{ id: outerCategory.id }] },
      },
    }),
  ]);
  console.log("Created products:", products.length);

  // Add variants to first product
  await prisma.productVariant.upsert({
    where: { sku: "VLS-S-WHT" },
    update: {},
    create: {
      productId: products[0].id,
      size: "S",
      color: "White",
      colorHex: "#FFFFFF",
      sku: "VLS-S-WHT",
      stock: 3,
    },
  });
  await prisma.productVariant.upsert({
    where: { sku: "VLS-M-WHT" },
    update: {},
    create: {
      productId: products[0].id,
      size: "M",
      color: "White",
      colorHex: "#FFFFFF",
      sku: "VLS-M-WHT",
      stock: 2,
    },
  });
  await prisma.productVariant.upsert({
    where: { sku: "VLS-L-WHT" },
    update: {},
    create: {
      productId: products[0].id,
      size: "L",
      color: "White",
      colorHex: "#FFFFFF",
      sku: "VLS-L-WHT",
      stock: 1,
    },
  });

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minimumOrder: 20,
      isActive: true,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
