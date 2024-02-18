import { atom } from "jotai";
import { TestCaseStatus, type TestCase } from "./editorTestCase";

interface ProblemTaskStore {
  description: string;
  sourceCode: string;
  testCases: TestCase[];
  languageId: number | null;
  allFieldsInitialValues: string;
  tmpSourceCode: string;
}

const getTestCasesWithoutStatus = (testCases: TestCase[]) => {
  return testCases.map(({ input, number, output }) => ({
    input,
    number,
    output,
  }));
};

export const problemTaskAtom = atom<ProblemTaskStore>({
  description: "",
  tmpSourceCode: "",
  sourceCode: "",
  testCases: [],
  languageId: null,
  allFieldsInitialValues: "",
});

export const setInitialProblemTaskAtom = atom(
  null,
  (
    get,
    set,
    fields: Omit<ProblemTaskStore, "allFieldsInitialValues" | "tmpSourceCode">
  ) => {
    const { description, testCases, sourceCode } = fields;
    const allFieldsInitialValues = [
      description,
      sourceCode,
      JSON.stringify(getTestCasesWithoutStatus(testCases)),
    ].toString();

    set(problemTaskAtom, {
      ...fields,
      tmpSourceCode: sourceCode,
      allFieldsInitialValues,
    });
  }
);

export const descriptionAtom = atom(
  (get) => get(problemTaskAtom).description,
  (get, set, update: string) => {
    set(problemTaskAtom, (prev) => ({ ...prev, description: update }));
  }
);

export const sourceCodeAtom = atom(
  (get) => get(problemTaskAtom).sourceCode,
  (get, set, update: string) => {
    set(problemTaskAtom, (prev) => ({ ...prev, sourceCode: update }));
  }
);

export const testCasesAtom = atom(
  (get) => get(problemTaskAtom).testCases,
  (get, set, testCases: TestCase[]) =>
    set(problemTaskAtom, (prev) => ({ ...prev, testCases }))
);

export const addNewTestCaseAtom = atom(null, (get, set) => {
  const testCases = get(testCasesAtom);
  set(problemTaskAtom, (prev) => ({
    ...prev,
    testCases: [
      ...testCases,
      {
        number: testCases.length + 1,
        input: "",
        output: "",
        status: TestCaseStatus.IDLE,
      },
    ],
  }));
});

export const removeTestCaseAtom = atom(null, (get, set, number: number) => {
  const testCases = get(problemTaskAtom).testCases;

  const newTestCases = testCases
    .filter((testCase) => testCase.number !== number)
    .map((testCase, index) => ({
      ...testCase,
      number: index + 1,
    }));
  set(problemTaskAtom, (prev) => ({ ...prev, testCases: newTestCases }));
});

export const setAllFieldsInitialValuesAtom = atom(
  null,
  (get, set, update: any[]) =>
    set(problemTaskAtom, (prev) => ({
      ...prev,
      allFieldsInitialValues: update.toString(),
    }))
);

export const getAllFieldsCurrentValuesAtom = atom((get) => {
  const { description, testCases, sourceCode } = get(problemTaskAtom);
  return [
    description,
    sourceCode,
    JSON.stringify(getTestCasesWithoutStatus(testCases)),
  ].toString();
});

export const isAlreadySaveAtom = atom((get) => {
  const initialValues = get(problemTaskAtom).allFieldsInitialValues;
  const currentValues = get(getAllFieldsCurrentValuesAtom);
  return initialValues === currentValues;
});

export const isSourceCodeChangedAtom = atom(
  (get) => {
    const tmpSourceCode = get(problemTaskAtom).tmpSourceCode;
    const currentSourceCode = get(problemTaskAtom).sourceCode;
    return tmpSourceCode !== currentSourceCode;
  },
  (get, set, updatedSourceCode: string) => {
    set(problemTaskAtom, (prev) => ({
      ...prev,
      tmpSourceCode: updatedSourceCode,
    }));
  }
);
