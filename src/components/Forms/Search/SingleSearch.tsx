import { Icon } from "@iconify/react";
import Skeleton from "~/components/Common/Skeleton";
import type { SearchValue } from "~/types";
import { twMerge } from "tailwind-merge";
import useSearchInput from "./hooks/useSearchInput";
import SuggestionList from "./SuggestionList";

interface Props {
  title: string;
  isError?: boolean;
  error?: string;
  className?: string;
  optional?: boolean;
  value: SearchValue;
  onChange: (value: SearchValue) => void;
  queryFn: (query: string) => Promise<SearchValue[]>;
  canAddItemNotInList?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const SingleSearch = (props: Props) => {
  const {
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
    queryFn,
  } = props;

  const {
    input: { search, handleOnSearch },
    selectRef,
    isQuerying,
    onClear,
    handleOnKeyDown,
    suggestions,
    selectedIndex,
    addItem,
  } = useSearchInput({
    queryFn,
    canAddItemNotInList,
    onChange,
  });

  const isSelected = value.label.length > 0;

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
            className={twMerge(
              "relative flex min-h-[2.5rem] w-full flex-wrap items-center gap-2 rounded-md border border-sand-6 bg-sand-1 p-2",
              isError && "border-tomato-7"
            )}
          >
            {isSelected ? (
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
                value={search}
                className="w-full bg-transparent outline-none"
                onChange={handleOnSearch}
                onKeyDown={handleOnKeyDown}
              />
            )}
          </div>

          <SuggestionList
            {...{
              search,
              suggestions,
              selectedIndex,
              isQuerying,
            }}
            onAddSuggestion={addItem}
          />
        </div>
      )}
    </div>
  );
};

export default SingleSearch;
