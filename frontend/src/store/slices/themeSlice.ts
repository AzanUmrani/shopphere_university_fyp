// src/store/slices/themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type {  PayloadAction } from "@reduxjs/toolkit";


type Theme = "light" | "dark" | "auto";

interface ThemeState {
  theme: Theme;
  effectiveTheme: "light" | "dark";
}

// Helper to get system preference
const getSystemPreference = () => 
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const savedTheme = localStorage.getItem("shopsphere-theme") as Theme || "light";

const initialState: ThemeState = {
  theme: savedTheme,
  effectiveTheme: savedTheme === "auto" ? getSystemPreference() : savedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("shopsphere-theme", action.payload);
      
      // Update effective theme
      if (action.payload === "auto") {
        state.effectiveTheme = getSystemPreference();
      } else {
        state.effectiveTheme = action.payload;
      }
    },
    updateAutoTheme: (state) => {
      if (state.theme === "auto") {
        state.effectiveTheme = getSystemPreference();
      }
    },
  },
});

export const { setTheme, updateAutoTheme } = themeSlice.actions;
export default themeSlice.reducer;