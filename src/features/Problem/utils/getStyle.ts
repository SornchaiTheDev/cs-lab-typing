import { Direction } from "../hooks/useDragSection";

export const getStyle = (
  direction: Direction,
  minSize: number,
  size: number,
  maxSize: number | "fit-content"
) => {
  if (direction === Direction.HORIZONTAL) {
    return {
      minWidth: minSize,
      width: size,
      maxWidth: maxSize,
    };
  }

  if (direction === Direction.VERTICAL) {
    return {
      minHeight: minSize,
      height: size,
      maxHeight: maxSize,
    };
  }
};
