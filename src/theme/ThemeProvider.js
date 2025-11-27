// src/theme/AppThemeProvider.jsx
import React, { createContext, useMemo, useState, useContext, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ColorModeContext = createContext();
export const useColorMode = () => useContext(ColorModeContext);

const LOCAL_KEY = "appThemeMode"; // localStorage key

// --------------------------
// LIGHT PALETTE (YOUR COLORS)
// --------------------------
const light = {
  palette: {
    mode: "light",

    // YOUR COLORS
    background: {
      default: "#F9F8F6", // main background
      paper: "#EFE9E3", // cards / appbar / drawer
      surface: "#D9CFC7", // elevated card
      elevated: "#D9CFC7",
    },

    primary: { main: "#C9B59C", contrastText: "#2B241A" }, // your accent
    secondary: { main: "#8E735B", contrastText: "#F9F8F6" },

    text: {
      primary: "#2B241A", // deep warm brown
      secondary: "#5A5046", // muted brown-gray
      disabled: "rgba(43,36,26,0.38)",
    },

    divider: "rgba(0,0,0,0.1)",

    action: {
      hover: "rgba(201,181,156,0.15)", // light brown tint
      selected: "rgba(201,181,156,0.25)",
      focus: "rgba(201,181,156,0.3)",
      active: "rgba(0,0,0,0.1)",
    },

    status: {
      notReturned: "#B85C5C", // muted red
      found: "#C6A55D", // golden
      returned: "#6FAF81", // sage green
      default: "#C9B59C",

    },

    surfaceContrast: {
      onSurface: "#2B241A",
      muted: "#E8E3DD",
    },
  },
};

// --------------------------
// DARK PALETTE (YOUR COLORS)
// --------------------------
const dark = {
  palette: {
    mode: "dark",

    background: {
      default: "#222831",
      paper: "#393E46",
      surface: "#948979",
      elevated: "#948979",
    },

    primary: { main: "#DFD0B8", contrastText: "#222831" },
    secondary: { main: "#948979", contrastText: "#222831" },

    text: {
      primary: "#DFD0B8",
      secondary: "#B9B1A5",
      disabled: "rgba(223,208,184,0.38)",
    },

    divider: "rgba(255,255,255,0.08)",

    action: {
      hover: "rgba(223,208,184,0.12)",
      selected: "rgba(223,208,184,0.22)",
      focus: "rgba(223,208,184,0.3)",
      active: "rgba(255,255,255,0.1)",
    },

    status: {
      lost: "#FF7373",
      found: "#E2C06A",
      returned: "#9BD4A5",
      default: "#DFD0B8",
    },

    surfaceContrast: {
      onSurface: "#222831",
      muted: "#2F353B",
    },
  },
};

// --------------------------
// Helper: initial mode (localStorage -> prefers -> fallback)
// --------------------------
const getInitialMode = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored === "light" || stored === "dark") return stored;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
  } catch (e) {
    // ignore and fallback
  }
  return "light";
};

// --------------------------
const AppThemeProvider = ({ children }) => {
  // initialize from localStorage or system preference
  const [mode, setMode] = useState(getInitialMode);

  // persist to localStorage whenever mode changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(LOCAL_KEY, mode);
    } catch (e) {
      // ignore storage errors
    }
  }, [mode]);

  // context: toggle + explicit setter + current mode
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
      setColorMode: (m) => {
        if (m === "light" || m === "dark") setMode(m);
      },
      mode,
    }),
    [mode]
  );

  // build theme using provided palettes
  const theme = useMemo(() => {
    const palette = mode === "light" ? light.palette : dark.palette;

    const base = createTheme({
      palette,
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        h4: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 600 },
      },

      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: palette.background.default,
              color: palette.text.primary,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            },
          },
        },

        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: palette.background.paper,
              borderRadius: 12,
              boxShadow:
                mode === "light"
                  ? "0 8px 20px rgba(0,0,0,0.06)"
                  : "0 6px 16px rgba(0,0,0,0.5)",
            },
          },
        },

        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              "&.Mui-selected": {
                backgroundColor: palette.action.selected,
              },
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            },
          },
        },

        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            },
          },
        },

        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: palette.background.paper,
            },
          },
        },

        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: palette.background.paper,
            },
          },
        },

        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              "&.Mui-checked": {
                "& + .MuiSwitch-track": {
                  backgroundColor: palette.action.selected,
                },
              },
            },
            track: {
              opacity: 1,
              backgroundColor: mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    });

    return {
      ...base,
      custom: {
        status: palette.status,
        surfaceElevated: palette.background.elevated,
        surfaceContrast: palette.surfaceContrast,
      },
    };
  }, [mode]);

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
