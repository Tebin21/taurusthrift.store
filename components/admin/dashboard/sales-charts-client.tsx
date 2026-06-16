"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIQD } from "@/lib/utils/currency";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  CONFIRMED: "#5B9CF6",
  PROCESSING: "#A78BF6",
  SHIPPED: "#818CF8",
  DELIVERED: "#34D399",
  CANCELLED: "#F87171",
  REFUNDED: "#9CA3AF",
};

const DARK_TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 10,
  backgroundColor: "#1A000C",
  border: "1px solid rgba(101,0,11,0.40)",
  color: "#F0EBE8",
  boxShadow: "0 4px 20px rgba(0,0,0,0.50)",
};

const DARK_LEGEND_STYLE = { color: "rgba(240,235,232,0.55)", fontSize: 10 };

type Props = {
  revenueData: { date: string; revenue: number }[];
  statusData: { status: string; count: number }[];
};

export function SalesChartsClient({ revenueData, statusData }: Props) {
  const t = useTranslations("dashboard.charts");
  const tOrders = useTranslations("orders");
  const hasRevenue = revenueData.some((d) => d.revenue > 0);
  const hasOrders = statusData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Revenue Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #C9A66B, #E8C98A)" }}
            />
            {t("revenueTrend")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasRevenue ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              {t("noRevenueData")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65000B" stopOpacity={0.70} />
                    <stop offset="95%" stopColor="#65000B" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "rgba(240,235,232,0.40)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "rgba(240,235,232,0.40)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatIQD(Number(v))}
                  width={60}
                />
                <Tooltip
                  formatter={(value) => [formatIQD(Number(value ?? 0)), t("revenue")]}
                  contentStyle={DARK_TOOLTIP_STYLE}
                  labelStyle={{ color: "rgba(240,235,232,0.70)", marginBottom: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B1E2D"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #C9A66B, #E8C98A)" }}
            />
            {t("ordersByStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasOrders ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              {t("noOrders")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="42%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#8B1E2D"}
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span style={DARK_LEGEND_STYLE}>{tOrders(`statusLabels.${value}`)}</span>
                  )}
                  iconType="circle"
                  iconSize={8}
                />
                <Tooltip
                  contentStyle={DARK_TOOLTIP_STYLE}
                  labelStyle={{ color: "rgba(240,235,232,0.70)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
