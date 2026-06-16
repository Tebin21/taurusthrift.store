"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";

export function MobileSidebarToggle() {
  const toggleAdminSidebar = useUIStore((s) => s.toggleAdminSidebar);
  const t = useTranslations("nav");

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden shrink-0"
      onClick={toggleAdminSidebar}
      aria-label={t("toggleNavigation")}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
