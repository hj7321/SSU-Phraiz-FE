import { useNewWorkStore } from "@/stores/newWork.store";
import { useEffect, useRef } from "react";

const useResetOnNewWork = (reset: () => void) => {
  const version = useNewWorkStore((state) => state.version);
  const last = useRef<number>(version);

  useEffect(() => {
    if (version !== last.current) {
      last.current = version;
      reset();
    }
  }, [version, reset]);
};

export default useResetOnNewWork;
