import { atom } from "jotai";

export const frontProblemTaskAtom = atom({
  sourceCode: "",
});

export const inputOutputAtom = atom({
  input: "",
  output: "",
});

export enum Status {
  SAVED,
  SAVING,
  ONLINE,
  OFFLINE,
}

export const saveStatusAtom = atom<Status>(Status.SAVED);
