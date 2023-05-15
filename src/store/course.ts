import { Prisma } from "@prisma/client";
import { create } from "zustand";

type courseAndAuthor = Prisma.coursesGetPayload<{ include: { authors: true } }>;

interface courseStore {
  selectedCourse: courseAndAuthor | null;
  setSelectedCourse: (selectedCourse: courseAndAuthor) => void;
}

export const useCourseStore = create<courseStore>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (selectedCourse) => set({ selectedCourse }),
}));
