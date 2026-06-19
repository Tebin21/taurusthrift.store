import { prisma } from "@/lib/prisma";
import { HeroContentForm } from "@/components/admin/hero-content/hero-content-form";

export default async function HeroContentPage() {
  let heroContent = await prisma.heroContent.findFirst();
  if (!heroContent) {
    heroContent = await prisma.heroContent.create({
      data: { titleEn: "", titleKu: "", titleAr: "" },
    });
  }

  return (
    <HeroContentForm
      id={heroContent.id}
      initialData={{
        titleEn: heroContent.titleEn,
        titleKu: heroContent.titleKu,
        titleAr: heroContent.titleAr,
      }}
    />
  );
}
