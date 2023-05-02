import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { useState, type KeyboardEvent, ChangeEvent, useEffect } from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { createId } from "@paralleldrive/cuid2";

interface Props {
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: (value: string[]) => void;
}

type selectedData = { text: string; key: string };

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
      isSelected && "bg-sand-4"
    )}
  >
    {Array.from(text).map((char, i) => (
      <span
        key={i}
        className={clsx(
          i < search.length && isCharIncludeInSearch(search, char)
            ? "font-medium text-sand-12"
            : "text-sand-11"
        )}
      >
        {char}
      </span>
    ))}
  </li>
);

const Multiple = (props: Props) => {
  const { className, title, optional, isError, error, value } = props;

  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState(["SornchaiTheDev", "SaacSOS"]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDatas, setSelectedDatas] = useState<selectedData[]>([]);
  const isSeaching = search.length > 0;

  const filteredDatas = isSeaching
    ? datas.filter((data) => data.toLowerCase().includes(search.toLowerCase()))
    : [];

  const isEmpty = filteredDatas.length === 0;

  useEffect(() => {
    if (!isSeaching || isEmpty) setSelectedIndex(-1);
    else {
      setSelectedIndex(0);
    }
  }, [isSeaching, isEmpty]);

  useEffect(() => {
    // TODO: fetch data from server
  }, [search]);

  useEffect(() => {
    value(selectedDatas.map((data) => data.text));
  }, [selectedDatas, value]);

  const handleOnKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % datas.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + datas.length) % datas.length);
        break;
      case "Enter":
        e.preventDefault();
        addItem();
        break;
      case "Backspace":
        if (search.length === 0) {
          setSelectedDatas((prev) => prev.slice(0, prev.length - 1));
        }
        break;
    }
  };

  const addItem = () => {
    let text = search;
    if (search.length === 0) return;
    if (selectedIndex !== -1) {
      text = filteredDatas[selectedIndex];
    }
    setSelectedDatas((prev) => [...prev, { text, key: createId() }]);
    setSearch("");
  };

  const handleDelete = (key: string) => {
    setSelectedDatas((prev) => prev.filter((data) => data.key !== key));
  };

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
      <div className="relative">
        <div
          className={clsx(
            "w-full p-2 border border-sand-6 min-h-[2.5rem] rounded-md outline-none bg-sand-1 flex flex-wrap items-center gap-2",
            isError && "border-tomato-7"
          )}
        >
          {selectedDatas.map(({ text, key }) => (
            <button
              key={key}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
              onClick={() => handleDelete(key)}
            >
              {text} <Icon icon="material-symbols:close-rounded" />
            </button>
          ))}
          <div className="relative flex-1">
            <input
              onBlur={addItem}
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              onKeyDown={handleOnKeyDown}
              className="w-full outline-none"
            />
          </div>
        </div>
        {isSeaching && !isEmpty && (
          <ul className="mt-2 absolute z-20 flex flex-col w-full max-h-[14rem] overflow-y-auto shadow gap-2 p-2 break-words bg-white border rounded-lg border-sand-6">
            {filteredDatas.map((data, i) => (
              <HightLightText
                key={data}
                search={search}
                text={data}
                isSelected={selectedIndex === i}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Multiple;
