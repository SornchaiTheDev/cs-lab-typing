import { create } from "zustand";

interface TypingStats {
  correctChar: number;
  errorChar: number;
  totalChars: number;
  startedAt: Date | null;
  endedAt: Date | null;
}

type gamePhase = "NotStarted" | "Started" | "Ended" | "History";

interface TypingStore {
  text: string;
  setText: (text: string) => void;
  stats: TypingStats;
  setStats: (status: Partial<TypingStats>) => void;
  status: gamePhase;
  setStatus: (status: gamePhase) => void;
  reset: () => void;
}

const DEFAULT_STATS: TypingStats = {
  correctChar: 0,
  errorChar: 0,
  totalChars: 0,
  startedAt: null,
  endedAt: null,
};

export const useTypingStore = create<TypingStore>((set) => ({
  text: "",
  setText: (text) => set({ text }),
  stats: DEFAULT_STATS,
  reset: () => set({ text: "", stats: DEFAULT_STATS, status: "NotStarted" }),
  setStats: (stats) =>
    set((state) => ({ stats: { ...state.stats, ...stats } })),
  status: "NotStarted",
  setStatus: (status) => set({ status }),
}));
