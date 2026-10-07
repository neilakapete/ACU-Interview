import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { ColorModeContext } from "./ColorModeContext";

function getInitialMode() {
    try {
        const saved = localStorage.getItem("color-mode");
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // ignore
    }
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
}

export default function AppThemeProvider({ children }) {
    const [mode, setMode] = useState(getInitialMode);

    useEffect(() => {
        try {
            localStorage.setItem("color-mode", mode);
        } catch {
            // ignore
        }
    }, [mode]);

    const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

    const theme = createTheme({
        palette: {
            mode,
            primary: { main: mode === "light" ? "#1565C0" : "#90CAF9" },
            secondary: { main: mode === "light" ? "#6A1B9A" : "#CE93D8" },
        },
        shape: { borderRadius: 8 },
    });

    return (
        <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
