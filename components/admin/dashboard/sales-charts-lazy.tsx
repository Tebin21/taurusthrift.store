"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const SalesChartsLazy = dynamic(
  () => import("./sales-charts-client").then((m) => m.SalesChartsClient),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-xl" /> }
);
