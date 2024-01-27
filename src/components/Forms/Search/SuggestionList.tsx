import type { SearchValue } from "~/types";
import Suggestion from "./Suggestion";
import useKeyboardScroll from "./hooks/useKeyboardScroll";
import { useRef } from "react";

interface Props {
  suggestions: SearchValue[];
  selectedIndex: number;
  onAddSuggestion: (label: string) => void;
  isQuerying: boolean;
  search: string;
}
function SuggestionList({
  suggestions,
  selectedIndex,
  onAddSuggestion,
  isQuerying,
  search,
}: Props) {
  const optionsRef = useRef<HTMLUListElement>(null);

  useKeyboardScroll({ optionsRef, selectedIndex });

  const isEmpty = !isQuerying && suggestions.length === 0;

  if (isEmpty) return null;

  return (
    <ul
      ref={optionsRef}
      className="absolute z-50 mt-2 flex max-h-[14rem] w-full flex-col gap-2 overflow-y-auto break-words rounded-lg border border-sand-6 bg-sand-1 p-2 shadow"
    >
      {isQuerying ? (
        <p className="p-1">Loading...</p>
      ) : (
        suggestions.map(({ label }, i) => (
          <Suggestion
            key={label}
            search={search}
            text={label}
            isSelected={selectedIndex === i}
            onClick={() => onAddSuggestion(label)}
          />
        ))
      )}
    </ul>
  );
}

export default SuggestionList;
