import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/banners/banner-form";

export default async function BannerFormPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <BannerForm />;
  }

  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  const imageUrls = banner.imageUrls.length > 0 ? banner.imageUrls : banner.imageUrl ? [banner.imageUrl] : [];

  return (
    <BannerForm
      bannerId={id}
      initialData={{
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        imageUrls,
      }}
    />
  );
}
