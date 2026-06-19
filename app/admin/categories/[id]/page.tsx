import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/categories/category-form";

export default async function CategoryFormPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <CategoryForm />;
  }

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <CategoryForm
      categoryId={id}
      initialData={{
        name: category.name,
        nameKu: category.nameKu ?? "",
        nameAr: category.nameAr ?? "",
        description: category.description ?? "",
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        imageUrl: category.imageUrl,
      }}
    />
  );
}
