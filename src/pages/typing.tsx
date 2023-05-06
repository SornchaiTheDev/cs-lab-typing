import React from "react";

import useTypingGame, { CharStateType } from "react-typing-game-hook";

const Typing = () => {
  let text = "The quick brown fox jumps over the lazy dog";
  const {
    states: {
      charsState,
      length,
      currIndex,
      currChar,
      correctChar,
      errorChar,
      phase,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame(text);

  const handleKey = (key: any) => {
    if (key === "Escape") {
      resetTyping();
    } else if (key === "Backspace") {
      deleteTyping(false);
    } else if (key.length === 1) {
      insertTyping(key);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-5xl">
      {/* <h1>React Typing Game Hook Demo</h1> */}
      <p>Click on the text below and start typing (esc to reset)</p>
      <div
        className="leading-loose typing-test"
        onKeyDown={(e) => {
          handleKey(e.key);
          e.preventDefault();
        }}
        tabIndex={0}
      >
        {text.split("").map((char: string, index: number) => {
          let state = charsState[index];
          let color = state === 0 ? "black" : state === 1 ? "green" : "red";
          return (
            <span
              key={char + index}
              style={{ color }}
              className={currIndex + 1 === index ? "border-b-4 border-sand-11" : ""}
            >
              {char}
            </span>
          );
        })}
      </div>
      {/* <pre>
        {JSON.stringify(
          {
            startTime,
            endTime,
            length,
            currIndex,
            currChar,
            correctChar,
            errorChar,
            phase,
          },
          null,
          2
        )}
      </pre> */}
    </div>
  );
};

export default Typing;
