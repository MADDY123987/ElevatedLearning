import { useEffect } from "react";
import { useTheme } from "@/components/ui/theme-provider";

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return { theme, toggleTheme };
}
