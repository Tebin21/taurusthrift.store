import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

type FavoritesStore = {
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) =>
        set((state) => ({
          items: state.items.includes(id)
            ? state.items.filter((i) => i !== id)
            : [...state.items, id],
        })),
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: "taurus-favorites" }
  )
);

export function useFavoritesCount() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    setCount(useFavoritesStore.getState().items.length);
    return useFavoritesStore.subscribe((state) => setCount(state.items.length));
  }, [mounted]);

  return count;
}
