import { atom } from "jotai";
import { TestCaseStatus, type TestCase } from "./editorTestCase";

export interface RuntimeConfig {
  cpu_time_limit: number;
  cpu_extra_time: number;
  wall_time_limit: number;
  memory_limit: number;
  stack_limit: number;
  max_processes_and_or_threads: number;
  enable_per_process_and_thread_time_limit: boolean;
  enable_per_process_and_thread_memory_limit: boolean;
  max_file_size: number;
  number_of_runs: number;
  redirect_stderr_to_stdout: boolean;
  enable_network: boolean;
}

interface ProblemTaskStore {
  description: string;
  sourceCode: string;
  testCases: TestCase[];
  languageId: number | null;
  allFieldsInitialValues: string;
  tmpSourceCode: string;
  config: RuntimeConfig;
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
  config: {
    cpu_time_limit: 2,
    cpu_extra_time: 0.5,
    wall_time_limit: 5,
    memory_limit: 128000,
    stack_limit: 64000,
    max_processes_and_or_threads: 60,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: true,
    max_file_size: 1024,
    number_of_runs: 1,
    redirect_stderr_to_stdout: false,
    enable_network: true,
  },
});

export const setInitialProblemTaskAtom = atom(
  null,
  (
    get,
    set,
    fields: Omit<
      ProblemTaskStore,
      "allFieldsInitialValues" | "tmpSourceCode" | "config"
    >
  ) => {
    const config = get(problemTaskAtom).config;
    const { description, testCases, sourceCode } = fields;
    const allFieldsInitialValues = [
      description,
      sourceCode,
      JSON.stringify(config),
      JSON.stringify(getTestCasesWithoutStatus(testCases)),
    ].toString();

    set(problemTaskAtom, (prev) => ({
      ...prev,
      ...fields,
      tmpSourceCode: sourceCode,
      allFieldsInitialValues,
    }));
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
  const { description, testCases, sourceCode, config } = get(problemTaskAtom);
  return [
    description,
    sourceCode,
    JSON.stringify(config),
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

export const configAtom = atom(
  (get) => get(problemTaskAtom).config,
  (
    get,
    set,
    update: {
      key: keyof RuntimeConfig;
      value: RuntimeConfig[keyof RuntimeConfig];
    }
  ) => {
    set(problemTaskAtom, (prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [update.key]: update.value,
      },
    }));
  }
);
