import {
  useState,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
} from "react";
import clsx from "clsx";
import TextHighlight from "./TextHighlight";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import Skeleton from "~/components/Common/Skeleton";
import type { SearchValue } from "~/types";

interface Props {
  datas: SearchValue[];
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: SearchValue;
  onChange: (value: SearchValue) => void;
  canAddItemNotInList?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const SingleSearch = (props: Props) => {
  const {
    datas = [],
    className,
    title,
    optional,
    isError,
    error,
    canAddItemNotInList,
    value = { label: "", value: "" },
    onChange,
    disabled,
    isLoading,
  } = props;
  const [search, setSearch] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSeaching = search.length > 0;
  const optionsRef = useRef<HTMLUListElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => setIsFocus(false));

  const filteredDatas = isSeaching
    ? datas.filter((data) =>
        data.label.toLowerCase().includes(search.toLowerCase())
      )
    : isFocus
    ? datas
    : [];

  const isEmpty = filteredDatas.length === 0;

  useEffect(() => {
    if (isEmpty) {
      setSelectedIndex(0);
    }
  }, [isEmpty]);

  const handleOnKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredDatas.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredDatas.length) % filteredDatas.length
        );
        break;
      case "Enter":
        e.preventDefault();
        addItem(filteredDatas[selectedIndex]?.label);
        break;
      case "Backspace":
        onClear();
        break;
    }
  };

  const addItem = (text?: string) => {
    if (!text) text = search;
    if (!canAddItemNotInList && !datas.map((data) => data.label).includes(text))
      return;
    const item = datas.filter((data) => data.label === text)[0] as SearchValue;
    onChange(item);
    setSelectedIndex(0);
    setIsFocus(false);
    setSearch("");
  };

  const onClear = () => {
    onChange({ label: "", value: "" });
  };

  useEffect(() => {
    const optionsList = optionsRef.current;
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
  }, [selectedIndex]);

  useEffect(() => {
    if (!isSeaching || isEmpty) setSelectedIndex(-1);
    else {
      setSelectedIndex(0);
    }
  }, [isSeaching, isEmpty]);

  return (
    <div {...{ className }}>
      <div className="flex justify-between">
        <h4 className="mb-2 block font-semibold text-sand-12">
          {title}{" "}
          {optional && <span className="text-sm text-sand-11">(optional)</span>}
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
        <div className="relative" ref={selectRef}>
          <div
            className={clsx(
              "relative flex min-h-[2.5rem] w-full flex-wrap items-center gap-2 rounded-md border border-sand-6 bg-sand-1 p-2",
              isError && "border-tomato-7"
            )}
          >
            {value.label.length > 0 ? (
              <div
                key={value.label}
                className="flex select-none items-center rounded-md bg-sand-12 px-2 py-1 text-sm font-semibold text-sand-1"
              >
                {value.label}{" "}
                {!disabled && (
                  <button
                    onClick={() => !disabled && onClear()}
                    disabled={disabled}
                  >
                    <Icon icon="material-symbols:close-rounded" />
                  </button>
                )}
              </div>
            ) : (
              <input
                disabled={disabled}
                onFocus={() => setIsFocus(true)}
                value={search}
                className="w-full bg-transparent outline-none"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleOnKeyDown}
              />
            )}
          </div>

          {isFocus && !isEmpty && (
            <ul
              ref={optionsRef}
              className="absolute z-50 mt-2 flex max-h-[14rem] w-full flex-col gap-2 overflow-y-auto break-words rounded-lg border border-sand-6 bg-sand-1 p-2 shadow"
            >
              {filteredDatas.map(({ label }, i) => (
                <TextHighlight
                  key={label}
                  search={label}
                  text={label}
                  isSelected={selectedIndex === i}
                  onClick={() => addItem(label)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleSearch;
