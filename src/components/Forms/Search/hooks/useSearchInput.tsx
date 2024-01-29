import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";
import type { SearchValue } from "~/types";

interface Props {
  canAddItemNotInList?: boolean;
  value: SearchValue[];
  onChange: (value: SearchValue[]) => void;
  queryFn?: (query: string) => Promise<SearchValue[]>;
  multiple?: boolean;
  isStatic?: boolean;
  options?: SearchValue[];
}

const MINIMUM_SEARCH_LENGTH = 1;

function useSearchInput({
  canAddItemNotInList,
  onChange,
  queryFn,
  multiple = false,
  value,
  isStatic = false,
  options,
}: Props) {
  const [suggestions, setSuggestions] = useState<SearchValue[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => setIsShow(false));

  useEffect(() => {
    const _selectRef = selectRef.current;
    if (!_selectRef) return;

    const handleOnClick = () => {
      setIsShow(true);
    };

    _selectRef.addEventListener("click", handleOnClick);

    return () => _selectRef.removeEventListener("click", handleOnClick);
  }, []);

  const isSearching = search.length >= MINIMUM_SEARCH_LENGTH;

  const isEmpty = suggestions.length === 0;

  useEffect(() => {
    if (isStatic && options) {
      setSuggestions(options);
    }
  }, [options, isStatic, suggestions.length]);

  const setToInitialState = () => {
    setIsQuerying(false);
    setSelectedIndex(0);
    setSearch("");
    setSuggestions([]);
  };

  const addItem = (text: string) => {
    const isTextInSuggestions = suggestions.some(
      (suggestion) => suggestion.label === text
    );

    const isAlreadyInList = value.some(
      (selectedItem) => selectedItem.label === text
    );

    if ((!canAddItemNotInList && !isTextInSuggestions) || isAlreadyInList)
      return;
    if (!multiple && value.length > 0) return;

    let item: SearchValue;

    if (!isTextInSuggestions) {
      item = { label: text, value: text };
    } else {
      item = suggestions.filter(
        (suggestion) => suggestion.label === text
      )[0] as SearchValue;
    }
    onChange([...value, item]);

    if (!isStatic) setToInitialState();
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
        break;
      case "Enter":
        e.preventDefault();
        if (canAddItemNotInList) {
          addItem(search);
        }
        if (isEmpty) return;
        addItem(suggestions[selectedIndex]!.label);
        break;
      case "Backspace":
        handleOnDelete();
        break;
    }
  };

  const handleOnDelete = (selectedItem?: string) => {
    if (search.length > 0) return;
    if (selectedItem) {
      onChange(value.filter((data) => data.label !== selectedItem));
      return;
    }

    onChange(value.slice(0, -1));
  };

  useEffect(() => {
    if (!isSearching && !isStatic) {
      setToInitialState();
    }
  }, [isSearching, isStatic]);

  useEffect(() => {
    if (!isSearching || isStatic) return;

    const query = async (search: string) => {
      setIsQuerying(true);
      if (!queryFn) {
        throw new Error("queryFn is required when using Search Component");
      }
      try {
        const res = await queryFn(search);
        updateSuggestions(res);
      } catch (err) {}
      setIsQuerying(false);
    };

    const updateSuggestions = (suggestions: SearchValue[]) => {
      const unselectedSuggestions = suggestions.filter(
        (suggestion) =>
          !value.some((selectedItem) => selectedItem.label === suggestion.label)
      );
      setSuggestions(unselectedSuggestions);
    };

    let timeout = setTimeout(() => {
      query(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, isSearching, queryFn, value, isStatic]);

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    suggestions,
    input: {
      search,
      handleOnSearch,
    },
    selectedIndex,
    isQuerying,
    handleOnKeyDown,
    addItem,
    handleOnDelete,
    selectRef,
    isShow,
  };
}

export default useSearchInput;
