// import React from "react";
// import { Sun, Moon, Monitor } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";

// const ThemeToggle: React.FC = () => {
//   const { theme, effectiveTheme, setTheme } = useTheme();

//   const themeOptions = [
//     { value: "light", label: "Light", icon: Sun },
//     { value: "dark", label: "Dark", icon: Moon },
//     { value: "auto", label: "Auto", icon: Monitor },
//   ] as const;

//   return (
//     <div className="relative group">
//       <button
//         className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
//         aria-label="Toggle theme"
//       >
//         {effectiveTheme === "dark" ? (
//           <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//         ) : (
//           <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//         )}
//       </button>

//       {/* Dropdown */}
//       <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//         <div className="p-2">
//           {themeOptions.map(({ value, label, icon: Icon }) => (
//             <button
//               key={value}
//               onClick={() => setTheme(value)}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
//                 theme === value
//                   ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
//                   : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//               }`}
//             >
//               <Icon className="w-4 h-4" />
//               {label}
//               {theme === value && (
//                 <div className="w-2 h-2 bg-primary-500 rounded-full ml-auto"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemeToggle;

// src/components/ui/ThemeToggle.tsx
import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/index";
import { setTheme } from "../../store/slices/themeSlice";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, effectiveTheme } = useSelector((state: RootState) => state.theme);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "auto", label: "Auto", icon: Monitor },
  ] as const;

  return (
    <div className="relative group">
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
        {effectiveTheme === "dark" ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => dispatch(setTheme(value))} // Dispatching the action
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                theme === value
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ThemeToggle;
