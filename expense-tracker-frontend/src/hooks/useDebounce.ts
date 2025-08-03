import { useEffect, useState } from "react";

export const useDebouncedState = <T>(initialValue: T, delay: number) => {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [immediateValue, delay]);

  return [immediateValue, debouncedValue, setImmediateValue] as const;
};
