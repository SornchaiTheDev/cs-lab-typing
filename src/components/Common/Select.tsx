import clsx from "clsx";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  title: string;
  error?: string;
  isError?: boolean;
  optional?: boolean;
}

function Select({
  options,
  value,
  onChange,
  className,
  title,
  isError,
  error,
  optional,
}: Props) {
  const [isShow, setIsShow] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLUListElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useOnClickOutside(selectRef, () => setIsShow(false));

  const handleOnKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + options.length) % options.length
        );
        break;
      case "Enter":
        e.preventDefault();
        onChange(options[selectedIndex]);
        setIsShow(false);
        break;
    }
  };

  useEffect(() => {
    const optionsList = optionRef.current;
    const selectedOption = optionsList?.querySelector(
      ".selected"
    ) as HTMLElement;
    if (selectedOption && optionsList) {
      const offset = selectedOption.offsetTop - optionsList.offsetTop + 10;
      optionsList?.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  }, [selectedIndex, isShow]);

  return (
    <div {...{ className }}>
      <div className="flex justify-between">
        <h4 className="block mb-2 font-semibold text-sand-12">
          {title}{" "}
          {optional && <span className="text-sm text-sand-11">(optional)</span>}
        </h4>
        {isError && (
          <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
            {error}
          </h6>
        )}
      </div>
      <div
        onKeyDown={handleOnKeyDown}
        tabIndex={0}
        ref={selectRef}
        className={clsx(
          "w-full border border-sand-6 rounded-md outline-none bg-sand-1 relative min-h-[2.5rem]",
          isError && "border-tomato-7"
        )}
        onClick={() => setIsShow(!isShow)}
      >
        <Icon
          icon={
            isShow
              ? "solar:alt-arrow-up-line-duotone"
              : "solar:alt-arrow-down-line-duotone"
          }
          className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
        />
        <h6 className="p-2 select-none">{value}</h6>
        {isShow && (
          <ul
            ref={optionRef}
            className="absolute z-20 flex flex-col w-full max-h-[14rem] overflow-y-auto shadow gap-2 p-2 break-words bg-white border rounded-lg top-12 border-sand-6"
          >
            {options.map((data, i) => (
              <li
                onClick={() => {
                  onChange(data);
                  setSelectedIndex(i);
                }}
                key={data}
                className={clsx(
                  "p-2 rounded-lg cursor-pointer hover:bg-sand-2 text-sand-11",
                  selectedIndex === i && "bg-sand-4 selected text-sand-12"
                )}
              >
                {data}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Select;
