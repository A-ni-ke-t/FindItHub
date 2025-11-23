import React, { createContext, useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: {
                  default: "#f9f9f9",
                  paper: "#ffffff",
                },
                primary: { main: "#00bcd4" },
              }
            : {
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                primary: { main: "#00acc1" },
              }),
        },
        typography: {
          fontFamily: "Inter, Roboto, Arial, sans-serif",
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppThemeProvider;
