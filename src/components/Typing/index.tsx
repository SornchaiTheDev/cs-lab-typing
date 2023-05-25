/*
  react-typing-game-hook 
  Github Repo : https://github.com/jokarz/react-typing-game-hook
  Thank you for this awesome library :D
*/

import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import useTypingGame from "react-typing-game-hook";
import { useTypingStore } from "~/store";

interface Props {
  text: string;
}
function TypingGame({ text }: Props) {
  const [stats, setStats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStats,
    state.setStatus,
  ]);

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
      setStats({ endTime: new Date() });
    } else if (phase === 1) {
      setStatus("Started");
      setStats({ startTime: new Date() });
    }
  }, [phase, startTime, endTime, setStatus, setStats]);

  const letterElements = useRef<HTMLDivElement>(null);
  const typingElement = useRef<HTMLInputElement>(null);

  // set cursor
  const pos = useMemo(() => {
    if (currIndex !== -1 && letterElements.current) {
      const spanref = letterElements.current.children[
        currIndex
      ] as HTMLSpanElement;
      let left, top;
      if (spanref) {
        left = spanref.offsetLeft + spanref.offsetWidth - 2;
        top = spanref.offsetTop - 2;
      }
      return { left, top };
    } else {
      return {
        left: 2,
        top: 2,
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
    } else if (letter === "Backspace") {
      deleteTyping(control);
    } else if (letter.length === 1) {
      insertTyping(letter);
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
        className="absolute opacity-0"
        ref={typingElement}
        onKeyDown={(e) => handleKeyDown(e.key, e.ctrlKey, e)}
      />
      <div className="mt-12 flex flex-col items-center gap-6 ">
        <div
          onClick={() => typingElement.current?.focus()}
          className={`relative font-serif text-4xl outline-none`}
          tabIndex={0}
        >
          <div
            ref={letterElements}
            className="pointer-events-none select-none text-center text-3xl leading-relaxed tracking-wider text-sand-11 outline-none"
            tabIndex={0}
          >
            {text.split("").map((letter, index) => {
              const state = charsState[index];
              const color =
                state === 0
                  ? "text-sand-8"
                  : state === 1
                  ? "text-sand-12"
                  : "text-red-9";
              return (
                <span
                  key={letter + index}
                  className={clsx(
                    color,
                    state === 2 && letter === " " && "border-b-2 border-b-red-9"
                  )}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          {phase !== 2 ? (
            <span
              style={{
                left: pos.left,
                top: pos.top,
              }}
              className={`caret border-l-2 border-black`}
            >
              &nbsp;
            </span>
          ) : null}
        </div>

        <h4 className="text-sand-11">
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
