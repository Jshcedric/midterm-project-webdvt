import { createContext, useContext, useState, useEffect } from "react";

const THEME_STORAGE_KEY = "budget-tracker-theme";

const ThemeContext = createContext(null);

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch (error) {
    console.error("Failed to read theme from localStorage:", error);
  }
  return "light";
}

// Wrap the whole app in this so any component can read/toggle the theme
// via useTheme() without passing props down through every level.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Whenever the theme changes: save it, and set a data-theme attribute
  // on <html> so our CSS (see index.css) can switch color variables.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Small custom hook so components just call useTheme() instead of
// importing useContext + ThemeContext everywhere.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return context;
}
