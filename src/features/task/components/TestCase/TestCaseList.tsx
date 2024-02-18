import { Fragment } from "react";
import TestCaseItem from "./TestCaseItem";
import { useAtomValue } from "jotai";
import { problemTaskAtom } from "~/store/problemTask";

interface Props {
  handleOnInputChange: (number: number) => (value: string) => void;
  handleOnRemoveTestCase: (number: number) => void;
}

function TestCaseList({ handleOnInputChange, handleOnRemoveTestCase }: Props) {
  const { testCases } = useAtomValue(problemTaskAtom);

  return testCases.map(({ number, input, output, status }) => {
    return (
      <Fragment key={number}>
        <TestCaseItem
          status={status}
          number={number}
          input={input}
          output={output}
          handleOnRemoveTestCase={() => handleOnRemoveTestCase(number)}
          onChangeInput={handleOnInputChange(number)}
        />
      </Fragment>
    );
  });
}

export default TestCaseList;
