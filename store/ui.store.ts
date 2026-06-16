"use client";

import { create } from "zustand";

type UIStore = {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  activeImageIndex: number;
  adminSidebarOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  setActiveImageIndex: (index: number) => void;
  openAdminSidebar: () => void;
  closeAdminSidebar: () => void;
  toggleAdminSidebar: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  activeImageIndex: 0,
  adminSidebarOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setActiveImageIndex: (index) => set({ activeImageIndex: index }),
  openAdminSidebar: () => set({ adminSidebarOpen: true }),
  closeAdminSidebar: () => set({ adminSidebarOpen: false }),
  toggleAdminSidebar: () => set((s) => ({ adminSidebarOpen: !s.adminSidebarOpen })),
}));
