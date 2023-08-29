import {
  useState,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
} from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import TextHighlight from "./TextHighlight";
import { useOnClickOutside } from "usehooks-ts";
import Skeleton from "~/components/Common/Skeleton";
import type { SearchValue } from "~/types";

interface Props {
  datas: SearchValue[];
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: SearchValue[];
  onChange: (value: SearchValue[]) => void;
  canAddItemNotInList?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const Multiple = (props: Props) => {
  const {
    datas = [],
    className,
    title,
    optional,
    isError,
    error,
    canAddItemNotInList,
    value = [],
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
  const inputBox = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => setIsFocus(false));

  const filteredDatas = isFocus
    ? datas.filter(
        (data) =>
          data.label.toLowerCase().includes(search.toLowerCase()) &&
          !value.some((selected) => selected.label === data.label)
      )
    : datas;

  const isEmpty = filteredDatas.length === 0;

  useEffect(() => {
    if (isEmpty) {
      setSelectedIndex(0);
    }
  }, [isEmpty]);

  // send value to parent component

  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
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
      case "Tab":
      case ",":
        e.preventDefault();
        addItem(filteredDatas[selectedIndex]?.label);
        break;
      case "Backspace":
        if (search.length === 0 && isFocus) {
          handleDelete();
        }
        break;
    }
  };

  const addItem = (text?: string) => {
    if (disabled) return;
    if (!text) text = search;
    if (!canAddItemNotInList && !datas.map((data) => data.label).includes(text))
      return;
    if (value.map((data) => data.label).includes(text)) return;
    if (text.length === 0) return;
    if (canAddItemNotInList) {
      onChange([...value, { label: text, value: text }]);
    } else {
      const item = datas.filter(
        (data) => data.label === text
      )[0] as SearchValue;
      onChange([...value, item]);
    }
    setSearch("");
    setSelectedIndex(0);
  };

  useEffect(() => {
    inputBox.current?.scrollTo(0, inputBox.current.scrollHeight);
  }, [value]);

  const handleDelete = (item?: string) => {
    if (disabled) return;
    if (item) {
      onChange(value.filter((data) => data.label !== item));
      return;
    }
    onChange(value.slice(0, value.length - 1));
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
            ref={inputBox}
            className={clsx(
              "flex max-h-[10rem] min-h-[2.5rem] w-full flex-wrap items-center gap-2 overflow-auto rounded-md border border-sand-6 bg-sand-1 p-2 outline-none",
              isError && "border-tomato-7"
            )}
          >
            {value.map((value) => (
              <button
                type="button"
                key={value.label}
                className="flex items-center rounded-md bg-sand-12 px-2 py-1 text-sm font-semibold text-sand-1"
                onClick={() => handleDelete(value.label)}
              >
                {value.label} <Icon icon="material-symbols:close-rounded" />
              </button>
            ))}
            <div className="relative flex-1">
              <input
                disabled={disabled}
                onFocus={() => setIsFocus(true)}
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleOnKeyDown}
                className="w-full min-w-[5rem] bg-transparent text-sand-12 caret-sand-12 outline-none"
              />
            </div>
          </div>
          {isFocus && !isEmpty && (
            <ul
              ref={optionsRef}
              className="absolute z-50 mt-2 flex max-h-[14rem] w-full flex-col gap-2 overflow-y-auto break-words rounded-lg border border-sand-6 bg-sand-1 p-2 shadow"
            >
              {filteredDatas.map(({ label }, i) => (
                <TextHighlight
                  key={label}
                  search={search}
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

export default Multiple;
