
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { createContext, useContext, useMemo, useState } from "react"
import AppRouter from "./AppRouter";

const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("light");
    const [drawerOpen, setDrawerOpen] = useState(false);
    console.log(drawerOpen);

    const theme = useMemo(() => {
        return createTheme({
            palette: {mode}
        })
    }, [mode]);

    return (
        <AppContext.Provider value={{mode, setMode, drawerOpen, setDrawerOpen}}>
            <ThemeProvider theme={theme}>
                <AppRouter />
                <CssBaseline />
            </ThemeProvider>
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext);
}