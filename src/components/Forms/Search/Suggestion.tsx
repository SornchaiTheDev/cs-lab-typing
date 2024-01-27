import { twMerge } from "tailwind-merge";

const isCharIncludeInSearch = (search: string, char: string) => {
  return search.toLowerCase().includes(char.toLowerCase());
};

interface Props {
  text: string;
  isSelected: boolean;
  search: string;
  onClick: () => void;
}

const HightLightText = ({ text, isSelected, search, onClick }: Props) => {
  return (
    <li
      className={twMerge(
        "cursor-pointer rounded-lg p-2 hover:bg-sand-2",
        isSelected && "selected bg-sand-4"
      )}
      onClick={onClick}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={twMerge(
            isCharIncludeInSearch(search, char)
              ? "font-medium text-lime-9"
              : "text-sand-11"
          )}
        >
          {char}
        </span>
      ))}
    </li>
  );
};

export default HightLightText;
