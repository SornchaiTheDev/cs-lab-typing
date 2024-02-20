import { useEffect, useRef, useState } from "react";
import { getStyle } from "../utils/getStyle";

export enum Direction {
  HORIZONTAL,
  VERTICAL,
}

interface Props {
  minSize: number;
  initialSize: number;
  maxSize?: number;
  direction: Direction;
}

function useDragSection({ minSize, initialSize, maxSize, direction }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState(initialSize);
  const _maxSize = maxSize ?? "fit-content";

  const handleOnMouseDown = () => {
    setIsResizing(true);
  };

  const resetToInitialSize = () => {
    setSize(initialSize);
  };

  const handleOnMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleOnMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      let currentPositon = 0;

      if (direction === Direction.HORIZONTAL) {
        const sectionOffset = sectionRef.current?.offsetLeft || 0;
        const dragWidth = dragRef.current?.getBoundingClientRect().width || 0;
        currentPositon = e.clientX - sectionOffset - dragWidth / 2;
      }

      if (direction === Direction.VERTICAL) {
        const sectionOffset = sectionRef.current?.offsetTop || 0;
        const dragHeight = dragRef.current?.getBoundingClientRect().height || 0;
        currentPositon = e.clientY - sectionOffset - dragHeight / 2;
      }

      setSize(currentPositon);
    };

    document.addEventListener("mousemove", handleOnMouseMove);
    document.addEventListener("mouseup", handleOnMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleOnMouseMove);
      document.removeEventListener("mouseup", handleOnMouseUp);
    };
  }, [isResizing, minSize, maxSize, initialSize, direction]);

  return {
    dragRef,
    sectionRef,
    style: getStyle(direction, minSize, size, _maxSize),
    onMouseDown: handleOnMouseDown,
    resetToInitialSize,
  };
}

export default useDragSection;
