import React from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { useLocalStorage } from "./useLocalStorage";
import type { ThemeMode } from "../types";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (next: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const detectInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [mode, setMode] = useLocalStorage<ThemeMode>(STORAGE_KEYS.themeMode, detectInitialTheme);

  React.useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.body.dataset.theme = mode;
  }, [mode]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      mode,
      setTheme: setMode,
      toggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme должен использоваться внутри ThemeProvider");
  }
  return context;
};
