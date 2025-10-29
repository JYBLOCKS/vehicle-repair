import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip, useColorScheme } from "@mui/material";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  type Mode = "light" | "dark" | "system";
  const STORAGE_KEY = "theme-mode";

  const toggleTheme = (theme: Mode) => {
    setMode(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (savedMode) {
      setMode(savedMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tooltip title={mode === "light" ? "Switch to dark" : "Switch to light"}>
      <IconButton
        onClick={() => toggleTheme(mode === "light" ? "dark" : "light")}
        size="small"
        sx={{ ml: 1 }}
        color={mode === "light" ? "secondary" : "primary"}
      >
        {mode === "light" ? (
          <DarkMode sx={{ size: 20 }} />
        ) : (
          <LightMode sx={{ size: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
