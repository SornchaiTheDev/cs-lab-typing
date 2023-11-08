import { create } from "zustand";
import type { z } from "zod";
import type { KeyStroke } from "~/schemas/TypingResult";

interface TypingStats {
  correctChar: number;
  errorChar: number;
  totalChars: number;
  startedAt: Date | null;
  endedAt: Date | null;
}

type gamePhase = "NotStarted" | "Started" | "Ended" | "History";

interface TypingStore {
  keyStrokes: z.infer<typeof KeyStroke>[];
  setKeyStrokes: (keyStrokes: z.infer<typeof KeyStroke>) => void;
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
  keyStrokes: [],
  setKeyStrokes: (keyStrokes) =>
    set((state) => ({
      keyStrokes: [...state.keyStrokes, keyStrokes],
    })),
  stats: DEFAULT_STATS,
  reset: () =>
    set({ keyStrokes: [], stats: DEFAULT_STATS, status: "NotStarted" }),
  setStats: (stats) =>
    set((state) => ({ stats: { ...state.stats, ...stats } })),
  status: "NotStarted",
  setStatus: (status) => set({ status }),
}));
