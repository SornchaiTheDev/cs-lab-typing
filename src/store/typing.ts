import { create } from "zustand";
import { PhaseType } from "react-typing-game-hook";

interface TypingStats {
  correctChar: number;
  errorChar: number;
  totalChars: number;
  startTime: Date | null;
  endTime: Date | null;
}

type gamePhase = "NotStarted" | "Started" | "Ended";

interface TypingStore {
  text: string;
  setText: (text: string) => void;
  stats: TypingStats;
  setStats: (status: Partial<TypingStats>) => void;
  status: gamePhase;
  setStatus: (status: gamePhase) => void;
}

export const useTypingStore = create<TypingStore>((set) => ({
  text: "",
  setText: (text) => set({ text }),
  stats: {
    correctChar: 0,
    errorChar: 0,
    totalChars: 0,
    startTime: null,
    endTime: null,
  },
  setStats: (stats) =>
    set((state) => ({ stats: { ...state.stats, ...stats } })),
  status: "NotStarted",
  setStatus: (status) => set({ status }),
}));
