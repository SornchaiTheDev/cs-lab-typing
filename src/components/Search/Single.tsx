import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import {
  useState,
  forwardRef,
  type KeyboardEvent,
  ChangeEvent,
  ForwardedRef,
} from "react";
import clsx from "clsx";

interface Props<T extends FieldValues> extends ReturnType<UseFormRegister<T>> {
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
}

const Single = <T extends FieldValues>(
  props: Props<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState(["SornchaiTheDev", "SaacSOS"]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { className, title, optional, isError, error, onChange, onBlur, name } =
    props;

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
        setDatas([]);
        setSearch(datas[selectedIndex]);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onChange(e);
  };

  const isSeaching = search.length > 0;

  const filteredDatas = isSeaching
    ? datas.filter((data) => data.toLowerCase().includes(search.toLowerCase()))
    : [];

  const isCharIncludeInSearch = (char: string) => {
    return search.toLowerCase().includes(char.toLowerCase());
  };

  const HightLightText = ({
    text,
    isSelected,
  }: {
    text: string;
    isSelected: boolean;
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
            i < search.length && isCharIncludeInSearch(char)
              ? "font-medium text-sand-12"
              : "text-sand-11"
          )}
        >
          {char}
        </span>
      ))}
    </li>
  );

  return (
    <div className="relative">
      <div {...{ className }}>
        <div className="flex justify-between">
          <h4 className="block mb-2 font-semibold text-sand-12">
            {title}{" "}
            {optional && (
              <span className="text-sm text-sand-11">(optional)</span>
            )}
          </h4>
          {isError && (
            <h6 className="block mb-2 text-sm font-semibold text-tomato-9">
              {error}
            </h6>
          )}
        </div>

        <input
          name={name}
          ref={ref}
          className={clsx(
            "w-full p-2 border border-sand-6 min-h-[2.5rem] rounded-md outline-none bg-sand-1",
            isError && "border-tomato-7"
          )}
          value={search}
          onBlur={onBlur}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
        />
      </div>
      {isSeaching && (
        <ul className="absolute z-20 flex flex-col w-full max-h-[14rem] overflow-y-scroll shadow gap-2 p-2 break-words bg-white border rounded-lg top-20 border-sand-6">
          {filteredDatas.map((data, i) => (
            <HightLightText
              key={data}
              text={data}
              isSelected={selectedIndex === i}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default forwardRef(Single);
