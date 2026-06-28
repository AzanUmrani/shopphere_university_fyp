// Console wrapper to prevent primitive conversion errors
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args: any[]) => {
  try {
    const safeArgs = args.map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(arg);
      }
      return String(arg);
    });
    originalConsoleWarn.apply(console, safeArgs);
  } catch (error) {
    originalConsoleWarn.apply(console, [
      "Console warning failed:",
      args.length,
      "arguments",
    ]);
  }
};

console.error = (...args: any[]) => {
  try {
    const safeArgs = args.map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(arg);
      }
      return String(arg);
    });
    originalConsoleError.apply(console, safeArgs);
  } catch (error) {
    originalConsoleError.apply(console, [
      "Console error failed:",
      args.length,
      "arguments",
    ]);
  }
};

// Export empty object to make this a module
export {};
