import { atom } from "jotai";

export enum TestCaseStatus {
  RUNNING,
  IDLE,
}
export interface TestCase {
  number: number;
  status: TestCaseStatus;
  input: string;
  output: string;
}

export const editorTestCaseAtom = atom<TestCase[]>([]);
