import clsx from "clsx";
import { Icon } from "@iconify/react";
import Skeleton from "~/components/Common/Skeleton";
import type { SearchValue } from "~/types";
import useSearchInput from "./hooks/useSearchInput";
import SuggestionList from "./SuggestionList";

interface Props {
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
  queryFn?: (query: string) => Promise<SearchValue[]>;
  multiple?: boolean;
  isStatic?: boolean;
  options?: SearchValue[];
}

const Search = (props: Props) => {
  const {
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
    queryFn,
    multiple,
    options,
    isStatic,
  } = props;
  const {
    addItem,
    handleOnKeyDown,
    input: { search, handleOnSearch },
    isQuerying,
    suggestions,
    selectedIndex,
    handleOnDelete,
    selectRef,
    isShow,
  } = useSearchInput({
    value,
    onChange,
    canAddItemNotInList,
    queryFn,
    multiple,
    options,
    isStatic,
  });

  const isSingleAndHasValue = !multiple && value.length > 0;
  const _disabled = disabled || isSingleAndHasValue;

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
              "flex max-h-[10rem] min-h-[2.5rem] w-full flex-wrap items-center gap-2 overflow-auto rounded-md border border-sand-6 bg-sand-1 p-2 outline-none",
              isError && "border-tomato-7"
            )}
          >
            {value.map(({ label, value }) => (
              <button
                type="button"
                key={value}
                className="flex items-center rounded-md bg-sand-12 px-2 py-1 text-sm font-semibold text-sand-1"
                onClick={() => handleOnDelete(label)}
              >
                {label} <Icon icon="material-symbols:close-rounded" />
              </button>
            ))}
            <div className="relative flex-1">
              <input
                disabled={_disabled}
                value={search}
                onChange={handleOnSearch}
                onKeyDown={handleOnKeyDown}
                className="w-full min-w-[5rem] bg-transparent text-sand-12 caret-sand-12 outline-none"
              />
            </div>
          </div>
          {isShow && (
            <SuggestionList
              {...{
                isQuerying,
                onAddSuggestion: addItem,
                suggestions,
                search,
                selectedIndex,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
