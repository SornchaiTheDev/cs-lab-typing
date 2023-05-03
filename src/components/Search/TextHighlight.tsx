import clsx from "clsx";
import React from "react";

const isCharIncludeInSearch = (search: string, char: string) => {
  return search.toLowerCase().includes(char.toLowerCase());
};

const HightLightText = ({
  text,
  isSelected,
  search,
}: {
  text: string;
  isSelected: boolean;
  search: string;
}) => (
  <li
    className={clsx(
      "p-2 rounded-lg cursor-pointer hover:bg-sand-2",
      isSelected && "bg-sand-4 selected"
    )}
  >
    {Array.from(text).map((char, i) => (
      <span
        key={i}
        className={clsx(
          (i < search.length && isCharIncludeInSearch(search, char)) ||
            isSelected
            ? "font-medium text-sand-12"
            : "text-sand-11"
        )}
      >
        {char}
      </span>
    ))}
  </li>
);

export default HightLightText;
