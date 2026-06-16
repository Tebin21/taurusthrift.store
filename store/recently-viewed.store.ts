import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 10;

type RecentlyViewedStore = {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((i) => i !== id)].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "taurus-recently-viewed" }
  )
);
