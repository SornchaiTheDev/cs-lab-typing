import {
  useState,
  useRef,
  type KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import clsx from "clsx";
import TextHighlight from "./TextHighlight";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import Skeleton from "@/components/Common/Skeleton";

interface Props {
  datas: string[];
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
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
    value,
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
    ? datas.filter((data) => data.toLowerCase().includes(search.toLowerCase()))
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
        addItem(filteredDatas[selectedIndex]);
        break;
      case "Backspace":
        onClear();
        break;
    }
  };

  const addItem = (text?: string) => {
    if (!text) text = search;
    if (!canAddItemNotInList && !datas.includes(text)) return;

    onChange(text);
    setSelectedIndex(0);
    setIsFocus(false);
    setSearch("");
  };

  const onClear = () => {
    onChange("");
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
      {isLoading ? (
        <Skeleton width="100%" height="2.5rem" />
      ) : (
        <div className="relative" ref={selectRef}>
          <div
            className={clsx(
              "relative w-full p-2 border border-sand-6 min-h-[2.5rem] rounded-md bg-sand-1 flex flex-wrap items-center gap-2",
              isError && "border-tomato-7"
            )}
          >
            {value.length > 0 ? (
              <button
                key={value}
                className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
                onClick={() => onClear()}
              >
                {value} <Icon icon="material-symbols:close-rounded" />
              </button>
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
              className="mt-2 absolute flex flex-col w-full max-h-[14rem] overflow-y-auto shadow gap-2 p-2 break-words bg-white border rounded-lg border-sand-6 z-50"
            >
              {filteredDatas.map((data, i) => (
                <TextHighlight
                  key={data}
                  search={value}
                  text={data}
                  isSelected={selectedIndex === i}
                  onClick={() => addItem(data)}
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
