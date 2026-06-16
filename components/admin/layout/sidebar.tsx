"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Ticket,
  ImageIcon,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";

const navItems = [
  { href: "/admin/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/products", labelKey: "products", icon: Package },
  { href: "/admin/categories", labelKey: "categories", icon: Tag },
  { href: "/admin/orders", labelKey: "orders", icon: ShoppingCart },
  { href: "/admin/coupons", labelKey: "coupons", icon: Ticket },
  { href: "/admin/banners", labelKey: "banners", icon: ImageIcon },
  { href: "/admin/customers", labelKey: "customers", icon: Users },
  { href: "/admin/reports", labelKey: "reports", icon: BarChart3 },
  { href: "/admin/messages", labelKey: "messages", icon: MessageSquare },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [collapsed, setCollapsed] = useState(false);
  const adminSidebarOpen = useUIStore((s) => s.adminSidebarOpen);
  const closeAdminSidebar = useUIStore((s) => s.closeAdminSidebar);

  return (
    <>
      {/* Mobile backdrop */}
      {adminSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeAdminSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex flex-col border-e border-sidebar-border bg-sidebar shadow-sm transition-all duration-300 shrink-0",
          "fixed inset-y-0 start-0 z-50 w-60",
          "md:relative md:z-auto md:translate-x-0",
          adminSidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          collapsed ? "md:w-16" : "md:w-60",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 h-16 border-b border-sidebar-border">
          <Image src="/logo.png" alt="Taurus Thrift" width={32} height={32} className="h-8 w-auto shrink-0 dark:hidden" />
          <Image src="/logo-white.png" alt="Taurus Thrift" width={32} height={32} className="hidden h-8 w-auto shrink-0 dark:block" />
          <div className={cn("overflow-hidden", collapsed && "md:hidden")}>
            <p className="font-semibold text-sm leading-tight text-brand-brown dark:text-brand-accent">{t("brandName")}</p>
            <p className="text-xs text-muted-foreground">{t("adminPanel")}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            const label = t(item.labelKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAdminSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-brand-brown/8 dark:bg-brand-brown/80 text-brand-brown dark:text-brand-white border-s-2 border-brand-brown dark:border-brand-accent"
                    : "text-foreground/50 dark:text-brand-white/50 hover:bg-muted hover:text-foreground dark:hover:text-brand-white"
                )}
                title={collapsed ? label : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-brand-brown dark:text-brand-accent" : ""
                  )}
                />
                <span className={cn("truncate", collapsed && "md:hidden")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 hidden md:block border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4 rtl:rotate-180" /> : <ChevronLeft className="h-4 w-4 rtl:rotate-180" />}
          </Button>
        </div>
      </aside>
    </>
  );
}
