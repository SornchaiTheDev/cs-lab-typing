import { create } from "zustand";

interface selectedItem {
  display: string;
  id: number;
}

interface selectedObj {
  selected: selectedItem;
  type: string;
}

interface deleteAffectStore {
  selectedObj: selectedObj | null;
  setSelectedObj: (selected: selectedObj | null) => void;
}

export const useDeleteAffectStore = create<deleteAffectStore>((set) => ({
  selectedObj: null,
  setSelectedObj: (selectedObj) => set({ selectedObj }),
}));
