import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "category" });
  return { title: t("browseTitle") };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "category" });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-accent mb-2">Browse</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("browseTitle")}</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t("browseSubtitle")}</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">{t("noProducts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const localName =
              (locale === "ku" ? cat.nameKu : locale === "ar" ? cat.nameAr : null) ?? cat.name;

            return (
              <Link
                key={cat.id}
                href={`/${locale}/category/${cat.slug}`}
                className="group block rounded-2xl overflow-hidden bg-brand-beige dark:bg-muted border border-transparent hover:border-brand-brown/15 hover:shadow-luxury transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-48 bg-brand-beige-dark dark:bg-muted/80">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={localName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Tag className="h-16 w-16 text-brand-brown/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h2 className="font-semibold text-lg group-hover:text-brand-brown transition-colors">
                    {localName}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("products", { count: cat._count.products })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
