"use client";

import { create } from "zustand";

type SortBy = "newest" | "price-asc" | "price-desc" | "featured";

type FilterStore = {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sizes: string[];
  colors: string[];
  sortBy: SortBy;
  page: number;

  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  setSortBy: (sort: SortBy) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
};

const initialState = {
  search: "",
  category: null,
  minPrice: null,
  maxPrice: null,
  sizes: [],
  colors: [],
  sortBy: "newest" as SortBy,
  page: 1,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  toggleSize: (size) =>
    set((state) => ({
      sizes: state.sizes.includes(size)
        ? state.sizes.filter((s) => s !== size)
        : [...state.sizes, size],
      page: 1,
    })),
  toggleColor: (color) =>
    set((state) => ({
      colors: state.colors.includes(color)
        ? state.colors.filter((c) => c !== color)
        : [...state.colors, color],
      page: 1,
    })),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set(initialState),
}));
