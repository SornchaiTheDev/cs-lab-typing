import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SearchValue } from "~/types";

interface Props {
  canAddItemNotInList?: boolean;
  onChange: (value: SearchValue) => void;
  queryFn: (query: string) => Promise<SearchValue[]>;
}

const MINIMUM_SEARCH_LENGTH = 1;

function useSearchInput({ canAddItemNotInList, onChange, queryFn }: Props) {
  const [suggestions, setSuggestions] = useState<SearchValue[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isQuerying, setIsQuerying] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const isSearching = search.length >= MINIMUM_SEARCH_LENGTH;

  const isEmpty = suggestions.length === 0;

  const setToInitialState = () => {
    setIsQuerying(false);
    setSelectedIndex(0);
    setSearch("");
    setSuggestions([]);
  };

  const addItem = (text: string) => {
    const isTextInList = suggestions.some(
      (suggestion) => suggestion.label === text
    );
    if (!canAddItemNotInList && !isTextInList) return;

    let item: SearchValue;

    if (!text) {
      item = { label: text, value: text };
    } else {
      item = suggestions.filter(
        (suggestion) => suggestion.label === text
      )[0] as SearchValue;
    }

    onChange(item);
    setToInitialState();
  };

  const onClear = () => {
    onChange({ label: "", value: "" });
    setToInitialState();
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
        if (isEmpty) return;
        addItem(suggestions[selectedIndex]!.label);
        break;
      case "Backspace":
        e.preventDefault();
        onClear();
        break;
    }
  };

  useEffect(() => {
    if (!isSearching) {
      setToInitialState();
    } else {
      setSelectedIndex(0);
    }
  }, [isSearching]);

  useEffect(() => {
    if (!isSearching) return;

    const query = async (search: string) => {
      setIsQuerying(true);
      try {
        const res = await queryFn(search);
        setSuggestions(res);
      } catch (err) {
        if (err instanceof TypeError) {
          throw new Error("queryFn is required when using SingleSearch");
        }
      }
      setIsQuerying(false);
    };

    let timeout = setTimeout(() => {
      query(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, isSearching, queryFn]);

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
    isSearching,
    handleOnKeyDown,
    addItem,
    onClear,
    selectRef,
  };
}

export default useSearchInput;
