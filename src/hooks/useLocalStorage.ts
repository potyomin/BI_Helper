import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

type InitialValue<T> = T | (() => T);

const resolveInitial = <T,>(initialValue: InitialValue<T>): T =>
  initialValue instanceof Function ? initialValue() : initialValue;

export const useLocalStorage = <T,>(
  key: string,
  initialValue: InitialValue<T>
): [T, Dispatch<SetStateAction<T>>] => {
  const stableInitialValue = useMemo(() => resolveInitial(initialValue), [initialValue]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return stableInitialValue;
    }

    const savedValue = window.localStorage.getItem(key);
    if (!savedValue) {
      return stableInitialValue;
    }

    try {
      return JSON.parse(savedValue) as T;
    } catch {
      return stableInitialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

