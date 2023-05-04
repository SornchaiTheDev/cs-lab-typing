import { create } from "zustand";

interface BearStore {
  bear: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

export const useBearStore = create<BearStore>()((set) => ({
  bear: 0,
  increasePopulation: () => set((state) => ({ bear: state.bear + 1 })),
  removeAllBears: () => set({ bear: 0 }),
}));
