import { useEffect } from "react";
interface Props {
  optionsRef: React.RefObject<HTMLUListElement>;
  selectedIndex: number;
}
function useKeyboardScroll({ optionsRef, selectedIndex }: Props) {
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
  }, [selectedIndex, optionsRef]);
}

export default useKeyboardScroll;
