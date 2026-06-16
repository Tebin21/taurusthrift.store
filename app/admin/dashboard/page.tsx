import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardStats } from "@/components/admin/dashboard/stats-cards";
import { AccountingSection } from "@/components/admin/dashboard/accounting-section";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders-table";
import { SalesCharts } from "@/components/admin/dashboard/sales-charts";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const t = await getTranslations("dashboard");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-72 w-full rounded-xl" />}>
        <AccountingSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-56 w-full rounded-xl" />}>
        <SalesCharts />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}
