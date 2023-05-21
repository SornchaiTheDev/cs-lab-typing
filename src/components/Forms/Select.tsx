import clsx from "clsx";
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside } from "usehooks-ts";
import Skeleton from "../Common/Skeleton";

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  title: string;
  error?: string;
  isError?: boolean;
  optional?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

function Select({
  options = [],
  value = "",
  onChange,
  className,
  title,
  isError,
  error,
  optional,
  disabled,
  isLoading,
}: Props) {
  const [isShow, setIsShow] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLUListElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useOnClickOutside(selectRef, () => setIsShow(false));

  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
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
        onChange(options[selectedIndex] as string);
        setIsShow(false);
        break;
    }
  };

  const isEmpty = options.length === 0;

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
    <>
      <div {...{ className }}>
        <div className="flex justify-between">
          <h4 className="mb-2 block font-semibold text-sand-12">
            {title}{" "}
            {optional && (
              <span className="text-sm text-sand-11">(optional)</span>
            )}
          </h4>
          {isError && (
            <h6 className="mb-2 block text-sm font-semibold text-tomato-9">
              {error}
            </h6>
          )}
        </div>
        {isLoading ? (
          <Skeleton width="100%" height="2.5rem" />
        ) : (
          <div
            onKeyDown={handleOnKeyDown}
            tabIndex={0}
            ref={selectRef}
            className={clsx(
              "relative min-h-[2.5rem] w-full rounded-md border border-sand-6 bg-sand-1 outline-none",
              isError && "border-tomato-7"
            )}
            onClick={() => {
              if (disabled) return;
              setIsShow(!isShow);
            }}
          >
            <Icon
              icon={
                isShow
                  ? "solar:alt-arrow-up-line-duotone"
                  : "solar:alt-arrow-down-line-duotone"
              }
              className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <h6 className="select-none p-2">{value}</h6>
            {isShow && (
              <ul
                ref={optionRef}
                className="absolute top-12 z-20 flex max-h-[14rem] w-full flex-col gap-2 overflow-y-auto break-words rounded-lg border border-sand-6 bg-white p-2 shadow"
              >
                {!isEmpty ? (
                  options.map((data, i) => (
                    <li
                      onClick={() => {
                        onChange(data);
                        setSelectedIndex(i);
                      }}
                      key={data}
                      className={clsx(
                        "cursor-pointer rounded-lg p-2 text-sand-11 hover:bg-sand-2",
                        selectedIndex === i && "selected bg-sand-4 text-sand-12"
                      )}
                    >
                      {data}
                    </li>
                  ))
                ) : (
                  <span className="cursor-not-allowed py-1 text-sand-6">
                    No Data
                  </span>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Select;
