import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { type PropsWithChildren } from "react";
import { theme } from "../theme/theme";

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
