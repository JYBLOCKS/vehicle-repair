import { createTheme, extendTheme } from "@mui/material/styles";

import { brand, gradients, shape } from "./tokens";

const common = {
  shape: { borderRadius: shape.radius },
  typography: {
    fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"`,
    h1: { fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.3 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.65 },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: {
          backgroundImage: gradients.subtle,
          backgroundAttachment: "fixed",
        },
        "*::-webkit-scrollbar": { height: 10, width: 10 },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: brand.gray[300],
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: shape.radius, paddingInline: 18 },
        containedPrimary: {
          backgroundImage: gradients.brand,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.radius,
          border: `1px solid ${brand.gray[200]}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: shape.radius,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 42 },
        indicator: { height: 3, borderRadius: 3 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 10, fontSize: 12, padding: "8px 10px" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: shape.radius + 2 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: shape.radius },
      },
    },
  },
};

const extendThemes = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: brand.primary[500],
          light: brand.primary[300],
          dark: brand.primary[700],
          contrastText: "#04210f",
        },
        secondary: {
          main: brand.secondary[500],
          light: brand.secondary[300],
          dark: brand.secondary[700],
          contrastText: "#021718",
        },
        success: { main: "#16a34a" },
        warning: { main: "#f59e0b" },
        error: { main: "#ef4444" },
        info: { main: brand.secondary[400] },
        background: {
          default: "#ffffff",
          paper: "#ffffff",
        },
        text: {
          primary: brand.gray[800],
          secondary: brand.gray[600],
        },
        divider: brand.gray[200],
      },
      ...common,
    },
    dark: {
      palette: {
        primary: {
          main: brand.primary[400],
          light: brand.primary[300],
          dark: brand.primary[700],
          contrastText: "#03140a",
        },
        secondary: {
          main: brand.secondary[400],
          light: brand.secondary[300],
          dark: brand.secondary[700],
          contrastText: "#031012",
        },
        success: { main: "#22c55e" },
        warning: { main: "#fbbf24" },
        error: { main: "#f87171" },
        info: { main: brand.secondary[300] },
        background: {
          default: brand.gray[900],
          paper: brand.gray[800],
        },
        text: {
          primary: "#e7edf6",
          secondary: brand.gray[300],
        },
        divider: "rgba(255,255,255,0.12)",
      },
      ...common,
    },
  },
});

export const theme = createTheme({
  colorSchemes: { ...extendThemes.colorSchemes },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});
