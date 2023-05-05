import {
  useState,
  useRef,
  type KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import TextHighlight from "./TextHighlight";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  datas: string[];
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  canAddItemNotInList?: boolean;
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
  } = props;

  const [search, setSearch] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isSeaching = search.length > 0;
  const optionsRef = useRef<HTMLUListElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => setIsFocus(false));

  const filteredDatas = isSeaching
    ? datas.filter(
        (data) =>
          data.toLowerCase().includes(search.toLowerCase()) &&
          !value.some((selected) => selected === data)
      )
    : isFocus
    ? datas
    : [];

  const isEmpty = filteredDatas.length === 0;

  useEffect(() => {
    if (isEmpty) {
      setSelectedIndex(0);
    }
  }, [search, isEmpty]);

  // send value to parent component

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
        if (search.length === 0) {
          handleDelete();
        }
        break;
    }
  };

  const addItem = (text?: string) => {
    if (!text) text = search;
    if (!canAddItemNotInList && !datas.includes(text)) return;
    if (value.map((data) => data).includes(text)) return;
    onChange([...value, text!]);
    setSearch("");
    setSelectedIndex(0);
  };

  const handleDelete = (item?: string) => {
    if (item) {
      onChange(value.filter((data) => data !== item));
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
      <div className="relative" ref={selectRef}>
        <div
          className={clsx(
            "w-full p-2 border border-sand-6 min-h-[2.5rem] rounded-md outline-none bg-sand-1 flex flex-wrap items-center gap-2",
            isError && "border-tomato-7"
          )}
        >
          {value.map((value) => (
            <button
              key={value}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
              onClick={() => handleDelete(value)}
            >
              {value} <Icon icon="material-symbols:close-rounded" />
            </button>
          ))}
          <div className="relative flex-1">
            <input
              onFocus={() => setIsFocus(true)}
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              onKeyDown={handleOnKeyDown}
              className="w-full outline-none min-w-[5rem] bg-transparent"
            />
          </div>
        </div>
        {isFocus && !isEmpty && (
          <ul
            ref={optionsRef}
            className="mt-2 absolute flex flex-col w-full max-h-[14rem] overflow-y-auto shadow gap-2 p-2 break-words bg-white border rounded-lg border-sand-6 z-50"
          >
            {filteredDatas.map((data, i) => (
              <TextHighlight
                key={data}
                search={search}
                text={data}
                isSelected={selectedIndex === i}
                onClick={() => addItem(data)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Multiple;
