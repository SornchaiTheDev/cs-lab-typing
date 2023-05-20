import { create } from "zustand";

type selectedObj = {
  selected: string;
  type: string;
};

interface deleteAffectStore {
  selectedObj: selectedObj | null;
  setSelectedObj: (selected: selectedObj | null) => void;
}

export const useDeleteAffectStore = create<deleteAffectStore>((set) => ({
  selectedObj: null,
  setSelectedObj: (selectedObj) => set({ selectedObj }),
}));
