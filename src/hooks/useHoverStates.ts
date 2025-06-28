import { useState } from "react";

const useHoverStates = (length: number) => {
  const [hoverStates, setHoverStates] = useState<boolean[]>(
    Array(length).fill(false)
  );

  const handleMouseEnter = (index: number) => {
    setHoverStates((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const handleMouseLeave = (index: number) => {
    setHoverStates((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  return { hoverStates, handleMouseEnter, handleMouseLeave };
};

export default useHoverStates;
