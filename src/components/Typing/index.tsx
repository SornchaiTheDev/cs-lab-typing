/*
  react-typing-game-hook 
  Github Repo : https://github.com/jokarz/react-typing-game-hook
  Thank you for this awesome library :D
*/

import clsx from "clsx";
import { useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import useTypingGame from "react-typing-game-hook";
import { useTypingStore } from "~/store";

interface Props {
  text: string;
}
function TypingGame({ text }: Props) {
  const { setStats, setStatus, reset, addKeyStroke } = useTypingStore();

  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, deleteTyping, resetTyping },
  } = useTypingGame(text, {
    skipCurrentWordOnSpace: false,
  });

  useEffect(() => {
    if (phase === 2 && endTime && startTime) {
      setStatus("Ended");
      setStats({ endedAt: new Date() });
    } else if (phase === 1) {
      setStatus("Started");
      setStats({ startedAt: new Date() });
    }
  }, [phase, startTime, endTime, setStatus, setStats]);

  const letterElements = useRef<HTMLDivElement>(null);
  const typingElement = useRef<HTMLInputElement>(null);

  // set cursor
  const pos = useMemo(() => {
    if (currIndex !== -1 && letterElements.current) {
      const spanref = letterElements.current.children[
        currIndex + 1
      ] as HTMLSpanElement;
      let left, top;
      if (spanref) {
        left = spanref.offsetLeft + 2;
        top = spanref.offsetTop - 2;
      }
      return { left, top };
    } else {
      return {
        left: 0,
        top: 0,
      };
    }
  }, [currIndex, letterElements]);

  //handle key presses
  const handleKeyDown = (
    letter: string,
    control: boolean,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (letter === "Escape") {
      resetTyping();
      reset();
    } else if (letter === "Backspace") {
      deleteTyping(control);
      addKeyStroke("DEL")
    } else if (letter.length === 1) {
      insertTyping(letter);
      addKeyStroke(letter)
    } else if (letter === "Tab") {
      event.preventDefault();
    }
  };


  // initial typing
  useEffect(() => {
    typingElement.current?.focus();
  }, [typingElement]);

  useEffect(() => {
    setStats({ correctChar, errorChar, totalChars: text.length });
  }, [correctChar, errorChar, setStats, text]);

  return (
    <>
      <input
        className="absolute -top-10 opacity-0"
        ref={typingElement}
        onKeyDown={(e) => handleKeyDown(e.key, e.ctrlKey, e)}
      />
      <div
        className="flex flex-col items-center gap-6"
        onClick={() => typingElement.current?.focus()}
      >
        <div
          className={`monospace pointer-events-none relative select-none text-3xl leading-relaxed text-sand-11 outline-none`}
          tabIndex={0}
          ref={letterElements}
        >
          {text.split("").map((letter, index) => {
            const state = charsState[index];
            const color =
              state === 0
                ? "text-sand-8 dark:text-sand-6"
                : state === 1
                  ? "text-sand-12 dark:text-sand-12"
                  : "text-tomato-11 dark:text-tomato-9";

            return (
              <span
                key={letter + index}
                className={clsx(
                  color,
                  state === 2 &&
                  "border-b-2 border-tomato-11 dark:border-tomato-9"
                )}
              >
                {letter === " " ? " " : letter}
              </span>
            );
          })}

          {phase !== 2 ? (
            <span
              style={{
                left: pos.left,
                top: pos.top,
              }}
              className={`caret border-l-2 border-sand-12`}
            >
              &nbsp;
            </span>
          ) : null}
        </div>

        <h4 className="select-none text-sand-11">
          Press{" "}
          <code className="rounded border-b-2 border-sand-11 bg-sand-6 p-1">
            esc
          </code>{" "}
          to Restart
        </h4>
      </div>
    </>
  );
}

export default TypingGame;
