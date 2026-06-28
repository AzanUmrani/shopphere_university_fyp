// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark" | "auto";

// interface ThemeContextType {
//   theme: Theme;
//   effectiveTheme: "light" | "dark";
//   setTheme: (theme: Theme) => void;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };

// interface ThemeProviderProps {
//   children: React.ReactNode;
// }

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
//   const [theme, setTheme] = useState<Theme>(() => {
//     const savedTheme = localStorage.getItem("shopsphere-theme") as Theme;
//     return savedTheme || "light";
//   });

//   const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
//     "light"
//   );

//   useEffect(() => {
//     const updateEffectiveTheme = () => {
//       if (theme === "auto") {
//         const prefersDark = window.matchMedia(
//           "(prefers-color-scheme: dark)"
//         ).matches;
//         setEffectiveTheme(prefersDark ? "dark" : "light");
//       } else {
//         setEffectiveTheme(theme);
//       }
//     };

//     updateEffectiveTheme();

//     if (theme === "auto") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       mediaQuery.addEventListener("change", updateEffectiveTheme);
//       return () =>
//         mediaQuery.removeEventListener("change", updateEffectiveTheme);
//     }
//   }, [theme]);

//   useEffect(() => {
//     const root = window.document.documentElement;

//     // Remove previous theme classes
//     root.classList.remove("light", "dark");

//     // Add current theme class
//     root.classList.add(effectiveTheme);

//     // Update meta theme-color for mobile browsers
//     const metaThemeColor = document.querySelector('meta[name="theme-color"]');
//     if (metaThemeColor) {
//       metaThemeColor.setAttribute(
//         "content",
//         effectiveTheme === "dark" ? "#1f2937" : "#ffffff"
//       );
//     }
//   }, [effectiveTheme]);

//   const handleSetTheme = (newTheme: Theme) => {
//     setTheme(newTheme);
//     localStorage.setItem("shopsphere-theme", newTheme);
//   };

//   const toggleTheme = () => {
//     if (theme === "light") {
//       handleSetTheme("dark");
//     } else if (theme === "dark") {
//       handleSetTheme("auto");
//     } else {
//       handleSetTheme("light");
//     }
//   };

//   const value = {
//     theme,
//     effectiveTheme,
//     setTheme: handleSetTheme,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;
