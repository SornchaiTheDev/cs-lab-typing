import { Fragment } from "react";
import TestCaseItem from "./TestCaseItem";
import { type TestCase } from "../../hooks/useTestCase";

interface Props {
  testCases: TestCase[];
  handleOnInputChange: (number: number) => (value: string) => void;
  handleOnRunTestCase: (number: number) => void;
  handleOnRemoveTestCase: (number: number) => void;
}

function TestCaseList({
  testCases,
  handleOnInputChange,
  handleOnRunTestCase,
  handleOnRemoveTestCase,
}: Props) {
  return testCases.map(({ number, input, output }) => {
    const isLastItem = number === testCases.length - 1;
    return (
      <Fragment key={number}>
        <TestCaseItem
          number={number}
          input={input}
          output={output}
          handleOnRemoveTestCase={() => handleOnRemoveTestCase(number)}
          handleOnRunTestCase={() => handleOnRunTestCase(number)}
          onChangeInput={handleOnInputChange(number)}
        />
        {!isLastItem && <hr className="my-4" />}
      </Fragment>
    );
  });
}

export default TestCaseList;
