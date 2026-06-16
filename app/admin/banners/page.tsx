import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/shared/delete-button";

export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: [{ position: "asc" }, { sortOrder: "asc" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage homepage banners</p>
        </div>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href="/admin/banners/new"><Plus className="h-4 w-4 me-2" />Add Banner</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner: any) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {banner.imageUrl && (
              <div className="relative h-40 bg-muted">
                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{banner.title}</h3>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">{banner.position}</Badge>
                  {banner.isActive ? (
                    <Badge className="text-xs bg-green-500/15 text-green-400 ring-1 ring-green-500/20 border-0">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                </div>
              </div>
              {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/banners/${banner.id}`}><Pencil className="h-3 w-3 me-1" />Edit</Link>
                </Button>
                <DeleteButton id={banner.id} apiPath="/api/banners" label="banner" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
